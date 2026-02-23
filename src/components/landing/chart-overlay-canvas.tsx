import * as React from "react";
import { useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";

export interface KeyLevel {
  type: "support" | "resistance" | "pivot";
  price?: string;
  description: string;
  verticalPosition?: number;
}

export interface PatternRegion {
  name: string;
  bounds: { x1: number; y1: number; x2: number; y2: number };
}

export interface ChartOverlayCanvasProps {
  imageSrc: string;
  keyLevels: KeyLevel[];
  patternRegions?: PatternRegion[];
  detectedSymbol?: string;
  detectedTimeframe?: string;
  className?: string;
}

const LINE_COLORS: Record<string, string> = {
  support: "#2DEDAD",
  resistance: "#FF6B6B",
  pivot: "#F5A623",
};

const REGION_COLORS = [
  "rgba(86, 199, 243, 0.12)",
  "rgba(45, 237, 173, 0.12)",
  "rgba(245, 166, 35, 0.12)",
];

/**
 * Renders a chart image with a Canvas overlay drawing support/resistance lines
 * and pattern region highlights. The AI vision model provides approximate
 * vertical positions (0.0-1.0) for each key level.
 */
const ChartOverlayCanvas = React.forwardRef<
  HTMLDivElement,
  ChartOverlayCanvasProps
>(({ imageSrc, keyLevels, patternRegions, detectedSymbol, detectedTimeframe, className }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Set canvas size to match container (handle high-DPI)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Draw pattern region highlights
    if (patternRegions?.length) {
      patternRegions.forEach((region, i) => {
        const { x1, y1, x2, y2 } = region.bounds;
        const rx = x1 * w;
        const ry = y1 * h;
        const rw = (x2 - x1) * w;
        const rh = (y2 - y1) * h;

        ctx.fillStyle = REGION_COLORS[i % REGION_COLORS.length];
        ctx.fillRect(rx, ry, rw, rh);

        // Region border
        ctx.strokeStyle = REGION_COLORS[i % REGION_COLORS.length].replace(
          "0.12",
          "0.5",
        );
        ctx.lineWidth = 1;
        ctx.strokeRect(rx, ry, rw, rh);

        // Region label
        ctx.font = "bold 11px Manrope, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillText(region.name, rx + 6, ry + 16);
      });
    }

    // Draw key level lines
    const levelsWithPos = keyLevels.filter(
      (l) => typeof l.verticalPosition === "number",
    );

    levelsWithPos.forEach((level) => {
      const y = level.verticalPosition! * h;
      const color = LINE_COLORS[level.type] || LINE_COLORS.pivot;

      // Dashed line across full width
      ctx.beginPath();
      ctx.setLineDash([8, 4]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price label background
      const label = level.price || level.type.toUpperCase();
      ctx.font = "bold 10px Manrope, sans-serif";
      const textWidth = ctx.measureText(label).width;
      const padding = 6;
      const labelX = w - textWidth - padding * 2 - 8;
      const labelY = y - 10;

      ctx.fillStyle = color.replace(")", ", 0.9)").replace("rgb", "rgba");
      ctx.beginPath();
      ctx.roundRect(labelX, labelY, textWidth + padding * 2, 18, 4);
      ctx.fill();

      // Price label text
      ctx.fillStyle = "#001615";
      ctx.fillText(label, labelX + padding, labelY + 13);
    });

    // Draw symbol/timeframe badge in top-left corner
    if (detectedSymbol) {
      const badgeText = detectedTimeframe
        ? `${detectedSymbol} \u00b7 ${detectedTimeframe}`
        : detectedSymbol;
      ctx.font = "bold 12px Manrope, sans-serif";
      const badgeTextWidth = ctx.measureText(badgeText).width;
      const badgePadH = 8;
      const badgePadV = 4;
      const badgeX = 8;
      const badgeY = 8;
      const badgeW = badgeTextWidth + badgePadH * 2;
      const badgeH = 12 + badgePadV * 2;

      // Background pill
      ctx.fillStyle = "rgba(0, 22, 21, 0.85)";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
      ctx.fill();

      // Badge text
      ctx.fillStyle = "#56C7F3";
      ctx.fillText(badgeText, badgeX + badgePadH, badgeY + badgePadV + 11);
    }
  }, [keyLevels, patternRegions, detectedSymbol, detectedTimeframe]);

  // Redraw on mount and when data changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Redraw on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      draw();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div
      ref={(node) => {
        // Merge refs
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn("relative inline-block w-full", className)}
    >
      <img
        src={imageSrc}
        alt="Chart with AI analysis overlay"
        className="block w-full h-auto rounded-lg"
        onLoad={draw}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none rounded-lg"
      />
    </div>
  );
});
ChartOverlayCanvas.displayName = "ChartOverlayCanvas";

export { ChartOverlayCanvas };
