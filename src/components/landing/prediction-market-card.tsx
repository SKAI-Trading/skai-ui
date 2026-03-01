import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────── */

export interface PricePoint {
  time: number;
  price: number;
}

export interface PredictionResult {
  entryPrice: number;
  exitPrice: number;
  direction: "up" | "down";
  outcome: "win" | "lose" | "push";
  payout: number;
  betAmount: number;
  priceChange: number;
  priceChangePercent: number;
}

export interface PredictionMarketCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  skaiPoints: number;
  userId?: string | null;
  onPointsChange?: (newBalance: number) => void;
  /** Override the default price fetcher (for testing). */
  onFetchPrice?: () => Promise<number>;
  /** Override the default price-history fetcher (for testing). */
  onFetchPriceHistory?: (minutes?: number) => Promise<PricePoint[]>;
}

type Phase = "idle" | "active" | "resolving" | "resolved";

interface HistoryEntry {
  direction: "up" | "down";
  outcome: "win" | "lose" | "push";
  payout: number;
  betAmount: number;
  priceChangePercent: number;
}

/** Persisted active bet — survives refresh / navigation */
interface StoredBet {
  entryPrice: number;
  betAmount: number;
  direction: "up" | "down";
  marketEnd: number; // epoch ms
  pointsBeforeBet: number;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

const MARKET_DURATION = 300; // 5 minutes
const POLL_ACTIVE_MS = 10_000;
const POLL_IDLE_MS = 30_000;
// Push zone: price must move >0.03% to count as a win.
// This gives ~47% win probability per side (matching HiLo's ~4700/10000 odds).
// Remaining ~6% falls into push zone → house edge.
const PUSH_THRESHOLD = 0.03;
const WIN_MULTIPLIER = 2;
const HISTORY_MINUTES = 10; // Show last 10 min for tighter chart
const MAX_CHART_PTS = 120;

const BINANCE_API = "https://api.binance.com/api/v3";
const COINGECKO_API = "https://api.coingecko.com/api/v3";

/* ─── Helpers ────────────────────────────────────────────────────────── */

const BET_STORAGE_KEY = (uid: string) => `skai_pred_active_${uid}`;

const saveBet = (uid: string, bet: StoredBet) => {
  try { localStorage.setItem(BET_STORAGE_KEY(uid), JSON.stringify(bet)); } catch { /* non-critical */ }
};
const loadBet = (uid: string): StoredBet | null => {
  try {
    const s = localStorage.getItem(BET_STORAGE_KEY(uid));
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};
const clearBet = (uid: string) => {
  try { localStorage.removeItem(BET_STORAGE_KEY(uid)); } catch { /* non-critical */ }
};

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
};

const fmtPrice = (p: number) =>
  `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ─── Default data fetchers (Binance → CoinGecko) ───────────────────── */

const defaultFetchPrice = async (): Promise<number> => {
  try {
    const res = await fetch(`${BINANCE_API}/ticker/price?symbol=ETHUSDT`);
    if (res.ok) {
      const d: { price: string } = await res.json();
      const p = parseFloat(d.price);
      if (!isNaN(p) && p > 0) return p;
    }
  } catch {
    /* fallback */
  }
  const res = await fetch(
    `${COINGECKO_API}/simple/price?ids=ethereum&vs_currencies=usd`,
  );
  if (!res.ok) throw new Error("Price unavailable");
  const d = await res.json();
  const p = d?.ethereum?.usd;
  if (typeof p !== "number" || p <= 0) throw new Error("Invalid price");
  return p;
};

const defaultFetchHistory = async (
  minutes = 60,
): Promise<PricePoint[]> => {
  try {
    const res = await fetch(
      `${BINANCE_API}/klines?symbol=ETHUSDT&interval=1m&limit=${minutes}`,
    );
    if (res.ok) {
      const data: unknown[][] = await res.json();
      return data.map((k) => ({
        time: Number(k[0]),
        price: parseFloat(String(k[4])),
      }));
    }
  } catch {
    /* fallback */
  }
  const hours = Math.max(minutes / 60, 0.1);
  const res = await fetch(
    `${COINGECKO_API}/coins/ethereum/market_chart?vs_currency=usd&days=${(hours / 24).toFixed(4)}`,
  );
  if (!res.ok) throw new Error("Chart data unavailable");
  const d = await res.json();
  return (d.prices as [number, number][]).map(([t, p]) => ({
    time: t,
    price: p,
  }));
};

/* ─── PriceChart (Polymarket-style full-bleed SVG with axes) ─────────── */

const CHART_VB_W = 700;
const CHART_VB_H = 280;

function PriceChart({
  data,
  entryPrice,
  isActive,
}: {
  data: PricePoint[];
  entryPrice?: number | null;
  isActive?: boolean;
}) {
  if (data.length < 2) return null;

  const W = CHART_VB_W;
  const H = CHART_VB_H;
  const pad = { top: 12, bottom: 28, left: 0, right: 72 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const prices = data.map((d) => d.price);
  const allPrices = entryPrice ? [...prices, entryPrice] : prices;
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP;
  const buf = range > 0 ? range * 0.1 : maxP * 0.002;
  const adjMin = minP - buf;
  const adjMax = maxP + buf;
  const adjRange = adjMax - adjMin;

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * cW;
  const toY = (p: number) => pad.top + cH - ((p - adjMin) / adjRange) * cH;

  const pts = data.map((d, i) => ({ x: toX(i), y: toY(d.price) }));
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${H - pad.bottom} L${pts[0].x.toFixed(1)},${H - pad.bottom} Z`;

  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "#2DEDAD" : "#F04438";
  const last = pts[pts.length - 1];
  const entryY = entryPrice != null ? toY(entryPrice) : null;

  // Y-axis price labels (5 levels)
  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const frac = i / (yTicks - 1);
    const price = adjMax - frac * adjRange;
    return { y: toY(price), label: price.toFixed(2) };
  });

  // X-axis time labels — distribute evenly, formatted as HH:MM:SS
  const timeSpan = data[data.length - 1].time - data[0].time;
  const xCount = Math.min(7, data.length);
  const xLabels: { x: number; label: string }[] = [];
  for (let i = 0; i < xCount; i++) {
    const frac = i / (xCount - 1);
    const idx = Math.round(frac * (data.length - 1));
    const t = new Date(data[idx].time);
    // Show seconds if timespan < 15 min
    const fmt = timeSpan < 900_000
      ? t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    xLabels.push({ x: toX(idx), label: fmt });
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: "100%" }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pred-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {yLabels.map((t, i) => (
        <line
          key={`grid-${i}`}
          x1={pad.left}
          y1={t.y}
          x2={pad.left + cW}
          y2={t.y}
          stroke="#ffffff"
          strokeWidth="0.5"
          opacity="0.06"
        />
      ))}

      {/* Area gradient fill */}
      <path d={area} fill="url(#pred-area-grad)" />

      {/* Price line */}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Entry price marker (during active bet) */}
      {entryY !== null && isActive && (
        <>
          <line
            x1={pad.left}
            y1={entryY}
            x2={pad.left + cW}
            y2={entryY}
            stroke="#F5A623"
            strokeWidth="1"
            strokeDasharray="6 3"
            opacity="0.6"
          />
          <rect
            x={pad.left + cW + 4}
            y={entryY - 9}
            width={pad.right - 8}
            height="18"
            rx="4"
            fill="#F5A623"
            opacity="0.2"
          />
          <text
            x={pad.left + cW + pad.right / 2}
            y={entryY + 3}
            fill="#F5A623"
            fontSize="10"
            textAnchor="middle"
            fontFamily="Manrope, sans-serif"
            fontWeight="600"
          >
            Entry
          </text>
        </>
      )}

      {/* Pulsing current-price dot */}
      <circle cx={last.x} cy={last.y} r="4" fill={color} />
      <circle cx={last.x} cy={last.y} r="4" fill={color} opacity="0.4">
        <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Current price horizontal line to Y-axis */}
      <line
        x1={last.x}
        y1={last.y}
        x2={pad.left + cW}
        y2={last.y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      {/* Current price label on Y-axis */}
      <rect
        x={pad.left + cW + 2}
        y={last.y - 10}
        width={pad.right - 4}
        height="20"
        rx="4"
        fill={color}
        opacity="0.15"
      />
      <text
        x={pad.left + cW + pad.right / 2}
        y={last.y + 4}
        fill={color}
        fontSize="10"
        textAnchor="middle"
        fontFamily="Manrope, sans-serif"
        fontWeight="600"
      >
        {prices[prices.length - 1].toFixed(2)}
      </text>

      {/* Y-axis price labels (right side) */}
      {yLabels.map((t, i) => (
        <text
          key={`ylabel-${i}`}
          x={pad.left + cW + 8}
          y={t.y + 3}
          fill="#5A7170"
          fontSize="9"
          fontFamily="Manrope, sans-serif"
          textAnchor="start"
        >
          {t.label}
        </text>
      ))}

      {/* X-axis time labels */}
      {xLabels.map((t, i) => (
        <text
          key={`xlabel-${i}`}
          x={t.x}
          y={H - 6}
          fill="#5A7170"
          fontSize="9"
          textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}
          fontFamily="Manrope, sans-serif"
        >
          {t.label}
        </text>
      ))}
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */

const PredictionMarketCard = React.forwardRef<
  HTMLDivElement,
  PredictionMarketCardProps
>(
  (
    {
      skaiPoints,
      userId,
      onPointsChange,
      onFetchPrice,
      onFetchPriceHistory,
      className,
      ...props
    },
    ref,
  ) => {
    /* ── state ── */
    const [phase, setPhase] = useState<Phase>("idle");
    const [ethPrice, setEthPrice] = useState<number | null>(null);
    const [chartData, setChartData] = useState<PricePoint[]>([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [priceError, setPriceError] = useState(false);
    const [entryPrice, setEntryPrice] = useState<number | null>(null);
    const [betAmount] = useState<number>(1);
    const [direction, setDirection] = useState<"up" | "down" | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(MARKET_DURATION);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [shouldResolve, setShouldResolve] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
      if (!userId) return [];
      try {
        const s = localStorage.getItem(`skai_pred_history_${userId}`);
        return s ? JSON.parse(s) : [];
      } catch {
        return [];
      }
    });

    const pricePollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const marketEndRef = useRef<number | null>(null);

    /* ── fetch wrappers ── */
    const fetchPrice = useCallback(
      () => (onFetchPrice ? onFetchPrice() : defaultFetchPrice()),
      [onFetchPrice],
    );
    const fetchHistory = useCallback(
      (m?: number) =>
        onFetchPriceHistory ? onFetchPriceHistory(m) : defaultFetchHistory(m),
      [onFetchPriceHistory],
    );

    /* ── initial load: chart history + current price ── */
    useEffect(() => {
      let alive = true;
      const load = async () => {
        try {
          const [hist, price] = await Promise.all([
            fetchHistory(HISTORY_MINUTES),
            fetchPrice(),
          ]);
          if (!alive) return;
          setChartData(hist);
          setEthPrice(price);
          setPriceError(false);
        } catch {
          if (!alive) return;
          setPriceError(true);
        } finally {
          if (alive) setChartLoading(false);
        }
      };
      load();
      return () => {
        alive = false;
      };
    }, [fetchPrice, fetchHistory]);

    /* ── restore persisted bet on mount ── */
    useEffect(() => {
      if (!userId || chartLoading) return;          // wait for initial price
      const stored = loadBet(userId);
      if (!stored) return;

      const now = Date.now();
      if (now >= stored.marketEnd) {
        // Bet expired while away — trigger immediate resolution
        setEntryPrice(stored.entryPrice);
        setDirection(stored.direction);
        marketEndRef.current = stored.marketEnd;
        setTimeRemaining(0);
        setPhase("active");
        // The countdown effect will see rem <= 0 and fire shouldResolve
        setShouldResolve(true);
      } else {
        // Bet still active — resume mid-flight
        setEntryPrice(stored.entryPrice);
        setDirection(stored.direction);
        marketEndRef.current = stored.marketEnd;
        setTimeRemaining(Math.floor((stored.marketEnd - now) / 1000));
        setPhase("active");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, chartLoading]);

    /* ── idle price polling ── */
    useEffect(() => {
      if (phase !== "idle") return;
      const id = setInterval(async () => {
        try {
          const p = await fetchPrice();
          setEthPrice(p);
          setChartData((prev) => {
            const next = [...prev, { time: Date.now(), price: p }];
            return next.length > MAX_CHART_PTS ? next.slice(-MAX_CHART_PTS) : next;
          });
          setPriceError(false);
        } catch {
          /* keep last known */
        }
      }, POLL_IDLE_MS);
      return () => clearInterval(id);
    }, [phase, fetchPrice]);

    /* ── active market countdown ── */
    useEffect(() => {
      if (phase !== "active" || !marketEndRef.current) return;
      const tick = setInterval(() => {
        const rem = Math.max(
          0,
          Math.floor((marketEndRef.current! - Date.now()) / 1000),
        );
        setTimeRemaining(rem);
        if (rem <= 0) {
          clearInterval(tick);
          setShouldResolve(true);
        }
      }, 250);
      return () => clearInterval(tick);
    }, [phase]);

    /* ── active market price polling ── */
    useEffect(() => {
      if (phase !== "active") return;
      pricePollRef.current = setInterval(async () => {
        try {
          const p = await fetchPrice();
          setEthPrice(p);
          setChartData((prev) => {
            const next = [...prev, { time: Date.now(), price: p }];
            return next.length > MAX_CHART_PTS ? next.slice(-MAX_CHART_PTS) : next;
          });
        } catch {
          /* swallow — chart shows last known */
        }
      }, POLL_ACTIVE_MS);
      return () => {
        if (pricePollRef.current) clearInterval(pricePollRef.current);
      };
    }, [phase, fetchPrice]);

    /* ── resolution ── */
    useEffect(() => {
      if (!shouldResolve) return;
      setShouldResolve(false);

      const run = async () => {
        setPhase("resolving");
        if (pricePollRef.current) clearInterval(pricePollRef.current);

        try {
          const exitPrice = await fetchPrice();
          setEthPrice(exitPrice);
          setChartData((prev) =>
            [...prev, { time: Date.now(), price: exitPrice }].slice(
              -MAX_CHART_PTS,
            ),
          );

          if (entryPrice === null || direction === null) {
            setPhase("idle");
            return;
          }

          const priceChange = exitPrice - entryPrice;
          const priceChangePercent = (priceChange / entryPrice) * 100;

          let outcome: "win" | "lose" | "push";
          let payout: number;

          if (Math.abs(priceChangePercent) < PUSH_THRESHOLD) {
            outcome = "push";
            payout = betAmount;
          } else if (
            (direction === "up" && priceChange > 0) ||
            (direction === "down" && priceChange < 0)
          ) {
            outcome = "win";
            payout = betAmount * WIN_MULTIPLIER;
          } else {
            outcome = "lose";
            payout = 0;
          }

          const predResult: PredictionResult = {
            entryPrice,
            exitPrice,
            direction,
            outcome,
            payout,
            betAmount,
            priceChange,
            priceChangePercent,
          };

          setResult(predResult);
          setPhase("resolved");
          if (userId) clearBet(userId);

          if (payout > 0) onPointsChange?.(skaiPoints + payout);

          const entry: HistoryEntry = {
            direction,
            outcome,
            payout,
            betAmount,
            priceChangePercent,
          };
          const newHist = [entry, ...history].slice(0, 5);
          setHistory(newHist);
          try {
            localStorage.setItem(
              `skai_pred_history_${userId}`,
              JSON.stringify(newHist),
            );
          } catch {
            /* non-critical */
          }

          setTimeout(() => {
            setPhase("idle");
            setResult(null);
            setDirection(null);
            setEntryPrice(null);
            setTimeRemaining(MARKET_DURATION);
          }, 5000);
        } catch (err) {
          console.error("Market resolution failed:", err);
          if (userId) clearBet(userId);
          onPointsChange?.(skaiPoints + betAmount);
          setPhase("idle");
          setDirection(null);
          setEntryPrice(null);
          setTimeRemaining(MARKET_DURATION);
        }
      };

      run();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldResolve]);

    /* ── place bet ── */
    const handlePlaceBet = useCallback(
      async (dir: "up" | "down") => {
        if (!userId || phase !== "idle" || skaiPoints < betAmount || !ethPrice)
          return;
        try {
          const price = await fetchPrice();
          const end = Date.now() + MARKET_DURATION * 1000;
          setEthPrice(price);
          setEntryPrice(price);
          setDirection(dir);
          marketEndRef.current = end;
          setTimeRemaining(MARKET_DURATION);
          setPhase("active");
          onPointsChange?.(skaiPoints - betAmount);
          saveBet(userId, { entryPrice: price, betAmount, direction: dir, marketEnd: end, pointsBeforeBet: skaiPoints });
        } catch (err) {
          console.error("Failed to start prediction:", err);
        }
      },
      [
        userId,
        phase,
        skaiPoints,
        betAmount,
        ethPrice,
        fetchPrice,
        onPointsChange,
      ],
    );

    /* ── derived ── */
    const canPlay = !!userId;
    const priceDelta =
      entryPrice !== null && ethPrice !== null ? ethPrice - entryPrice : null;
    const priceDeltaPct =
      entryPrice && priceDelta !== null
        ? (priceDelta / entryPrice) * 100
        : null;
    const priceChange1h =
      chartData.length >= 2
        ? ((chartData[chartData.length - 1].price - chartData[0].price) /
            chartData[0].price) *
          100
        : null;

    /* ── render ── */
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col p-[16px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)]",
          className,
        )}
        {...props}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-[8px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] rounded-full bg-[#627EEA] flex items-center justify-center">
              <span className="text-white text-[14px] font-bold">Ξ</span>
            </div>
            <h3 className="font-manrope font-medium text-white text-[16px] md:text-[18px] lg:text-[20px] leading-[22px] tracking-[-0.5px]">
              Ethereum Up or Down — 5 Minutes
            </h3>
          </div>
          <span className="font-manrope font-normal text-[#8B9E9D] text-[12px] md:text-[13px] leading-[16px]">
            Balance:{" "}
            <span className="text-[#2DEDAD] font-medium">
              {skaiPoints.toLocaleString()} pts
            </span>
          </span>
        </div>

        {/* ── Live price + 1h change ── */}
        <div className="flex items-baseline gap-[8px] mb-[4px]">
          {ethPrice ? (
            <>
              <span className="font-manrope font-bold text-white text-[28px] md:text-[32px] tracking-[-1px]">
                {fmtPrice(ethPrice)}
              </span>
              {phase === "active" &&
              priceDelta !== null &&
              priceDeltaPct !== null ? (
                <span
                  className={cn(
                    "font-manrope font-medium text-[13px] md:text-[14px]",
                    priceDelta > 0
                      ? "text-[#2DEDAD]"
                      : priceDelta < 0
                        ? "text-[#F04438]"
                        : "text-[#8B9E9D]",
                  )}
                >
                  {priceDelta >= 0 ? "+" : ""}
                  {priceDeltaPct.toFixed(3)}%
                </span>
              ) : priceChange1h !== null ? (
                <span
                  className={cn(
                    "font-manrope font-medium text-[13px]",
                    priceChange1h > 0
                      ? "text-[#2DEDAD]"
                      : priceChange1h < 0
                        ? "text-[#F04438]"
                        : "text-[#8B9E9D]",
                  )}
                >
                  {priceChange1h >= 0 ? "+" : ""}
                  {priceChange1h.toFixed(2)}% 1h
                </span>
              ) : null}
            </>
          ) : chartLoading ? (
            <span className="font-manrope text-[#8B9E9D] text-[16px] animate-pulse">
              Loading ETH price…
            </span>
          ) : priceError ? (
            <span className="font-manrope text-[#F04438] text-[14px]">
              Price unavailable — retrying…
            </span>
          ) : null}
        </div>

        {/* ── Live Chart ── */}
        <div className="relative mb-[12px] rounded-[12px] overflow-hidden bg-[#001615]/50 border border-[rgba(255,255,255,0.05)] flex-1 min-h-[220px]">
          {chartLoading ? (
            <div
              className="flex items-center justify-center h-full"
            >
              <div className="w-6 h-6 border-2 border-[#56C7F3]/30 border-t-[#56C7F3] rounded-full animate-spin" />
            </div>
          ) : priceError || chartData.length < 2 ? (
            <div
              className="flex items-center justify-center h-full"
            >
              <span className="font-manrope text-[#8B9E9D] text-[13px]">
                {priceError
                  ? "Chart data unavailable — retrying…"
                  : "Loading chart…"}
              </span>
            </div>
          ) : (
            <PriceChart
              data={chartData}
              entryPrice={
                phase === "active" || phase === "resolving"
                  ? entryPrice
                  : null
              }
              isActive={phase === "active" || phase === "resolving"}
            />
          )}

          {/* Timer overlay during active bet */}
          {phase === "active" && (
            <div className="absolute top-[8px] right-[8px] flex items-center gap-[6px] px-[10px] py-[4px] rounded-[8px] bg-[#001615]/80 backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
              <span className="font-manrope font-normal text-[#8B9E9D] text-[10px]">
                Resolves in
              </span>
              <span
                className={cn(
                  "font-manrope font-bold text-[14px] tabular-nums",
                  timeRemaining <= 30
                    ? "text-[#F5A623] animate-pulse"
                    : "text-white",
                )}
              >
                {fmtTime(timeRemaining)}
              </span>
            </div>
          )}

        </div>

        {/* ── IDLE: bet controls ── */}
        {phase === "idle" && (
          <>
            <p className="font-manrope font-normal text-[#8B9E9D] text-[13px] md:text-[14px] text-center mb-[10px]">
              Will ETH be higher or lower in 5 minutes? · 1 pt bet
            </p>

            {/* Direction buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={!canPlay || skaiPoints < betAmount || !ethPrice}
                onClick={() => handlePlaceBet("up")}
                className={cn(
                  "flex-1 py-[14px] md:py-[16px] rounded-[12px] font-manrope font-bold text-[15px] md:text-[16px] transition-all duration-200 flex flex-col items-center gap-[2px]",
                  !canPlay || skaiPoints < betAmount || !ethPrice
                    ? "bg-[#001615] text-[#3A5553] cursor-not-allowed"
                    : "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/20 hover:border-[#2DEDAD]/50 hover:shadow-[0_0_16px_rgba(45,237,173,0.15)] active:scale-[0.97]",
                )}
              >
                <span>▲ HIGHER</span>
                <span className="font-normal text-[10px] md:text-[11px] opacity-60">
                  2× payout
                </span>
              </button>
              <button
                type="button"
                disabled={!canPlay || skaiPoints < betAmount || !ethPrice}
                onClick={() => handlePlaceBet("down")}
                className={cn(
                  "flex-1 py-[14px] md:py-[16px] rounded-[12px] font-manrope font-bold text-[15px] md:text-[16px] transition-all duration-200 flex flex-col items-center gap-[2px]",
                  !canPlay || skaiPoints < betAmount || !ethPrice
                    ? "bg-[#001615] text-[#3A5553] cursor-not-allowed"
                    : "bg-[#0D3D3A] text-[#F04438] border border-[#F04438]/20 hover:border-[#F04438]/50 hover:shadow-[0_0_16px_rgba(240,68,56,0.15)] active:scale-[0.97]",
                )}
              >
                <span>▼ LOWER</span>
                <span className="font-normal text-[10px] md:text-[11px] opacity-60">
                  2× payout
                </span>
              </button>
            </div>
          </>
        )}

        {/* ── ACTIVE: position info + progress bar ── */}
        {phase === "active" && (
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center justify-between px-[12px] py-[10px] rounded-[10px] bg-[#001615] border border-[rgba(255,255,255,0.05)]">
              <div className="flex flex-col gap-[2px]">
                <span className="font-manrope font-normal text-[#8B9E9D] text-[10px]">
                  Entry
                </span>
                <span className="font-manrope font-medium text-white text-[13px]">
                  {entryPrice ? fmtPrice(entryPrice) : "—"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-[2px]">
                <span className="font-manrope font-normal text-[#8B9E9D] text-[10px]">
                  Position
                </span>
                <span
                  className={cn(
                    "font-manrope font-bold text-[13px]",
                    direction === "up"
                      ? "text-[#2DEDAD]"
                      : "text-[#F04438]",
                  )}
                >
                  {direction === "up" ? "▲ HIGHER" : "▼ LOWER"} · {betAmount}{" "}
                  pts
                </span>
              </div>
              <div className="flex flex-col items-end gap-[2px]">
                <span className="font-manrope font-normal text-[#8B9E9D] text-[10px]">
                  Potential
                </span>
                <span className="font-manrope font-medium text-[#2DEDAD] text-[13px]">
                  +{betAmount} pts
                </span>
              </div>
            </div>

            <div className="w-full h-[3px] rounded-full bg-[#001615] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2DEDAD] to-[#56C7F3] transition-all duration-1000"
                style={{
                  width: `${((MARKET_DURATION - timeRemaining) / MARKET_DURATION) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* ── RESOLVING ── */}
        {phase === "resolving" && (
          <div className="flex items-center justify-center py-[16px]">
            <span className="font-manrope font-medium text-[#8B9E9D] text-[14px] animate-pulse">
              Checking final price…
            </span>
          </div>
        )}

        {/* ── RESOLVED ── */}
        {phase === "resolved" && result && (
          <div className="flex flex-col items-center gap-[8px] py-[8px]">
            <div
              className={cn(
                "px-[20px] py-[10px] rounded-[12px] text-center",
                result.outcome === "win"
                  ? "bg-[#0D3D3A] border border-[#2DEDAD]/30"
                  : result.outcome === "lose"
                    ? "bg-[#3D0D0D] border border-[#F04438]/30"
                    : "bg-[#3D2E0D] border border-[#F5A623]/30",
              )}
            >
              <span
                className={cn(
                  "font-manrope font-bold text-[18px] md:text-[20px]",
                  result.outcome === "win"
                    ? "text-[#2DEDAD]"
                    : result.outcome === "lose"
                      ? "text-[#F04438]"
                      : "text-[#F5A623]",
                )}
              >
                {result.outcome === "win"
                  ? `WIN! +${result.payout} pts`
                  : result.outcome === "lose"
                    ? `LOSE -${result.betAmount} pts`
                    : "PUSH (returned)"}
              </span>
            </div>
            <div className="flex items-center gap-[12px] text-[11px] font-manrope text-[#8B9E9D]">
              <span>{fmtPrice(result.entryPrice)}</span>
              <span>→</span>
              <span
                className={
                  result.priceChange > 0
                    ? "text-[#2DEDAD]"
                    : result.priceChange < 0
                      ? "text-[#F04438]"
                      : ""
                }
              >
                {fmtPrice(result.exitPrice)} (
                {result.priceChange >= 0 ? "+" : ""}
                {result.priceChangePercent.toFixed(3)}%)
              </span>
            </div>
          </div>
        )}

        {/* ── History ── */}
        {history.length > 0 &&
          phase !== "active" &&
          phase !== "resolving" && (
            <div className="flex items-center gap-[6px] flex-wrap mt-[8px]">
              <span className="font-manrope font-normal text-[#8B9E9D] text-[10px] leading-[12px]">
                Last:
              </span>
              {history.map((h, i) => (
                <span
                  key={`pred-${i}`}
                  className={cn(
                    "font-manrope font-normal text-[10px] md:text-[11px] leading-[14px]",
                    h.outcome === "push"
                      ? "text-[#F5A623]"
                      : h.outcome === "win"
                        ? "text-[#2DEDAD]"
                        : "text-[#F04438]",
                  )}
                >
                  {h.direction === "up" ? "▲" : "▼"}
                  {h.outcome === "win"
                    ? `+${h.payout}`
                    : h.outcome === "push"
                      ? "="
                      : `-${h.betAmount}`}
                </span>
              ))}
            </div>
          )}

        {/* Not signed in */}
        {!canPlay && phase === "idle" && (
          <p className="font-manrope font-normal text-[#8B9E9D] text-[12px] md:text-[13px] leading-[16px] text-center mt-[8px]">
            Connect your wallet and sign up to predict ETH price
          </p>
        )}

        {/* Zero balance */}
        {canPlay && skaiPoints <= 0 && phase === "idle" && (
          <p className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[12px] leading-[16px] text-center mt-[8px]">
            You need SKAI Points to predict. Earn points by sharing or
            depositing USDC.
          </p>
        )}
      </div>
    );
  },
);
PredictionMarketCard.displayName = "PredictionMarketCard";

export { PredictionMarketCard };
