/**
 * Game UI Patterns Documentation
 *
 * Gaming interface patterns including betting UI, game cards,
 * win/loss animations, and score displays for SKAI games.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import {
  Trophy,
  Flame,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Star,
  Crown,
  Coins,
  Dice5,
  ArrowUp,
  ArrowDown,
  Timer,
  Users,
} from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: "Documentation/Game UI Patterns",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 🎮 Game UI Patterns

Interface patterns for SKAI gaming features including HiLo, Slots, and Predictions.

## Games in SKAI

- **HiLo** - Predict if next value is higher or lower
- **Slots** - Provably fair slot machine
- **Predictions** - Market prediction games

## Key UI Patterns

1. **Bet Slip** - Amount input, odds display, potential win
2. **Game Cards** - Game selection with stats
3. **Win/Loss Feedback** - Animated result displays
4. **Streak Counter** - Visual multiplier tracking
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// BET SLIP COMPONENT
// ============================================================================

const quickAmounts = [5, 10, 25, 50, 100];

export const BetSlip: StoryObj = {
  render: () => {
    const [betAmount, setBetAmount] = useState(25);
    const [odds, _setOdds] = useState(1.95);
    const potentialWin = (betAmount * odds).toFixed(2);

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Bet Slip Pattern</h2>
          <p className="text-muted-foreground mb-6">
            Standard betting interface with amount input, odds, and potential
            win calculation.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-black/60 to-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-400" />
                Place Your Bet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Amounts */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Quick Select
                </label>
                <div className="flex gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        betAmount === amount
                          ? "bg-cyan-500 text-black"
                          : "bg-black/30 hover:bg-black/40"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Bet Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value) || 0)}
                    className="w-full py-3 pl-8 pr-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xl font-bold"
                  />
                </div>
              </div>

              {/* Odds & Potential Win */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-black/30">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Odds
                  </span>
                  <span className="text-xl font-bold text-cyan-400">
                    {odds}x
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-black/30">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Potential Win
                  </span>
                  <span className="text-xl font-bold text-green-400">
                    ${potentialWin}
                  </span>
                </div>
              </div>

              {/* Place Bet Button */}
              <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black">
                <Zap className="h-5 w-5 mr-2" />
                Place Bet
              </Button>

              {/* Balance Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Available Balance</span>
                <span className="font-mono">$1,234.56</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};

// ============================================================================
// GAME CARDS
// ============================================================================

// Color maps for Tailwind classes (dynamic classes are not compiled by Tailwind)
const bgColorMap: Record<string, string> = {
  cyan: "bg-cyan-500/20",
  purple: "bg-purple-500/20",
  amber: "bg-amber-500/20",
  rose: "bg-rose-500/20",
  green: "bg-green-500/20",
  orange: "bg-orange-500/20",
};

const textColorMap: Record<string, string> = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  green: "text-green-400",
  orange: "text-orange-400",
};

const games = [
  {
    name: "HiLo",
    description: "Predict higher or lower",
    icon: TrendingUp,
    color: "cyan",
    players: 234,
    jackpot: "$12,345",
    hot: true,
  },
  {
    name: "Slots",
    description: "Provably fair slots",
    icon: Dice5,
    color: "purple",
    players: 156,
    jackpot: "$45,678",
    hot: false,
  },
  {
    name: "Predictions",
    description: "Market predictions",
    icon: Target,
    color: "amber",
    players: 89,
    jackpot: null,
    hot: true,
  },
  {
    name: "Tournaments",
    description: "Compete for prizes",
    icon: Trophy,
    color: "rose",
    players: 567,
    jackpot: "$100,000",
    hot: false,
  },
];

export const GameCards: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Game Selection Cards</h2>
        <p className="text-muted-foreground mb-6">
          Interactive game cards with player counts, jackpots, and status
          indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <Card
            key={game.name}
            className="cursor-pointer hover:border-cyan-500/50 transition-all hover:scale-[1.02] group"
          >
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${bgColorMap[game.color] || "bg-gray-500/20"} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <game.icon
                    className={`h-7 w-7 ${textColorMap[game.color] || "text-gray-400"}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{game.name}</h3>
                    {game.hot && (
                      <Badge className="bg-orange-500/20 text-orange-400">
                        <Flame className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {game.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {game.players} playing
                    </span>
                    {game.jackpot && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Coins className="h-3 w-3" />
                        {game.jackpot}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compact Variant */}
      <Card>
        <CardHeader>
          <CardTitle>Compact Game List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {games.map((game) => (
            <button
              key={game.name}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-left"
            >
              <game.icon
                className={`h-5 w-5 ${textColorMap[game.color] || "text-gray-400"}`}
              />
              <span className="font-semibold flex-1">{game.name}</span>
              {game.hot && <Flame className="h-4 w-4 text-orange-400" />}
              <span className="text-sm text-muted-foreground">
                {game.players} online
              </span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// WIN/LOSS ANIMATIONS
// ============================================================================

export const WinLossAnimations: StoryObj = {
  render: () => {
    // Note: These state variables are for demo purposes - handlers are wired up but
    // full animation overlay is shown as static examples below for documentation
    const [showWin, setShowWin] = useState(false);
    const [showLoss, setShowLoss] = useState(false);

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Win/Loss Feedback</h2>
          <p className="text-muted-foreground mb-6">
            Animated visual feedback for game results with celebration effects.
            {showWin && " (Win triggered!)"}
            {showLoss && " (Loss triggered!)"}
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setShowWin(true);
              setTimeout(() => setShowWin(false), 2000);
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            Trigger Win
          </Button>
          <Button
            onClick={() => {
              setShowLoss(true);
              setTimeout(() => setShowLoss(false), 2000);
            }}
            variant="destructive"
          >
            Trigger Loss
          </Button>
        </div>

        {/* Static Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Win State */}
          <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.2)_0%,transparent_70%)]" />
            <CardContent className="py-12 relative">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-green-500/30 flex items-center justify-center animate-pulse">
                    <Trophy className="h-12 w-12 text-green-400" />
                  </div>
                  {/* Sparkles */}
                  <Star className="absolute top-0 right-0 h-6 w-6 text-yellow-400 animate-bounce" />
                  <Star className="absolute bottom-0 left-0 h-4 w-4 text-yellow-300 animate-bounce delay-75" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-green-400">
                    YOU WIN!
                  </h3>
                  <p className="text-lg text-muted-foreground mt-2">+$47.50</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                  1.95x Multiplier
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Loss State */}
          <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="h-12 w-12 text-red-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-red-400">
                    Better luck next time
                  </h3>
                  <p className="text-lg text-muted-foreground mt-2">-$25.00</p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Animation Code */}
        <Card>
          <CardHeader>
            <CardTitle>Win Animation CSS</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-cyan-400">
                {`
/* Win celebration pulse */
@keyframes win-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 40px 10px rgba(34, 197, 94, 0.2);
  }
}

.win-animation {
  animation: win-pulse 0.6s ease-out;
}

/* Confetti burst (use react-confetti) */
import Confetti from 'react-confetti';

function WinOverlay({ amount }: { amount: number }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        colors={['#22c55e', '#10b981', '#14b8a6', '#06b6d4']}
      />
      <div className="text-center animate-win-pulse">
        <Trophy className="h-24 w-24 text-green-400" />
        <h2 className="text-4xl font-bold text-green-400">
          +\${amount.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}
              `.trim()}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// STREAK COUNTER
// ============================================================================

export const StreakCounter: StoryObj = {
  render: () => {
    const [streak, setStreak] = useState(5);
    const maxStreak = 10;
    const multiplier = 1 + streak * 0.1;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Streak Counter</h2>
          <p className="text-muted-foreground mb-6">
            Visual representation of win streaks with multiplier bonuses.
          </p>
        </div>

        <div className="flex gap-4 mb-4">
          <Button
            onClick={() => setStreak(Math.max(0, streak - 1))}
            variant="outline"
          >
            Decrease
          </Button>
          <Button onClick={() => setStreak(Math.min(maxStreak, streak + 1))}>
            Increase
          </Button>
        </div>

        {/* Streak Display */}
        <div className="max-w-md">
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardContent className="py-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame
                    className={`h-6 w-6 ${streak > 0 ? "text-orange-400 animate-pulse" : "text-muted-foreground"}`}
                  />
                  <span className="font-bold text-lg">Win Streak</span>
                </div>
                <Badge
                  className={`text-lg px-3 py-1 ${
                    streak >= 7
                      ? "bg-orange-500 text-white"
                      : streak >= 4
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10"
                  }`}
                >
                  {streak}x
                </Badge>
              </div>

              {/* Streak Bar */}
              <div className="space-y-2">
                <div className="flex gap-1">
                  {Array.from({ length: maxStreak }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 flex-1 rounded-sm transition-all duration-300 ${
                        i < streak
                          ? i >= 7
                            ? "bg-orange-500"
                            : i >= 4
                              ? "bg-amber-500"
                              : "bg-green-500"
                          : "bg-white/10"
                      }`}
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span className="text-amber-400">5x Bonus</span>
                  <span className="text-orange-400">10x MAX</span>
                </div>
              </div>

              {/* Multiplier Display */}
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-black/30">
                <span className="text-muted-foreground">
                  Current Multiplier:
                </span>
                <span
                  className={`text-2xl font-bold ${
                    streak >= 7
                      ? "text-orange-400"
                      : streak >= 4
                        ? "text-amber-400"
                        : streak > 0
                          ? "text-green-400"
                          : ""
                  }`}
                >
                  {multiplier.toFixed(1)}x
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestone Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Streak Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {[
                { streak: 3, label: "Hot", icon: Flame, color: "green" },
                { streak: 5, label: "On Fire", icon: Zap, color: "amber" },
                { streak: 7, label: "Blazing", icon: Star, color: "orange" },
                { streak: 10, label: "Legendary", icon: Crown, color: "rose" },
              ].map((milestone) => {
                const isActive = streak >= milestone.streak;
                const activeBgClass =
                  bgColorMap[milestone.color] || "bg-gray-500/20";
                const activeTextClass =
                  textColorMap[milestone.color] || "text-gray-400";
                return (
                  <div
                    key={milestone.streak}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      isActive
                        ? `${activeBgClass} ${activeTextClass}`
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    <milestone.icon className="h-4 w-4" />
                    <span className="font-semibold">{milestone.label}</span>
                    <span className="text-sm">({milestone.streak}+)</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// HILO GAME UI
// ============================================================================

export const HiLoGameUI: StoryObj = {
  render: () => {
    const [currentValue, setCurrentValue] = useState(47);
    const [prediction, setPrediction] = useState<"higher" | "lower" | null>(
      null,
    );
    const [isRevealing, setIsRevealing] = useState(false);

    const handlePredict = (pred: "higher" | "lower") => {
      setPrediction(pred);
      setIsRevealing(true);
      setTimeout(() => {
        setCurrentValue(Math.floor(Math.random() * 100));
        setIsRevealing(false);
        setPrediction(null);
      }, 1500);
    };

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">HiLo Game Interface</h2>
          <p className="text-muted-foreground mb-6">
            Complete HiLo game UI with prediction buttons and reveal animation.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-black/60 to-black/40 overflow-hidden">
            <CardContent className="py-8 space-y-8">
              {/* Current Number Display */}
              <div className="relative">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Number
                  </p>
                  <div
                    className={`text-8xl font-black transition-all duration-300 ${
                      isRevealing ? "blur-sm scale-110" : ""
                    }`}
                  >
                    {currentValue}
                  </div>
                  <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${currentValue}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-xl font-semibold">
                  Will the next number be{" "}
                  <span className="text-cyan-400">higher</span> or{" "}
                  <span className="text-rose-400">lower</span>?
                </p>
              </div>

              {/* Prediction Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePredict("higher")}
                  disabled={isRevealing}
                  className={`group relative py-6 rounded-2xl font-bold text-xl transition-all ${
                    prediction === "higher"
                      ? "bg-green-500 text-black scale-105"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:scale-105"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowUp className="h-8 w-8 mx-auto mb-2 group-hover:-translate-y-1 transition-transform" />
                  Higher
                  <span className="block text-sm font-normal opacity-70">
                    1.95x
                  </span>
                </button>

                <button
                  onClick={() => handlePredict("lower")}
                  disabled={isRevealing}
                  className={`group relative py-6 rounded-2xl font-bold text-xl transition-all ${
                    prediction === "lower"
                      ? "bg-rose-500 text-white scale-105"
                      : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:scale-105"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowDown className="h-8 w-8 mx-auto mb-2 group-hover:translate-y-1 transition-transform" />
                  Lower
                  <span className="block text-sm font-normal opacity-70">
                    1.95x
                  </span>
                </button>
              </div>

              {/* Game Stats */}
              <div className="flex justify-between text-sm text-muted-foreground px-4">
                <span>Rounds: 7</span>
                <span className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-400" />
                  Streak: 3
                </span>
                <span className="text-green-400">+$47.50</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};

// ============================================================================
// PREDICTION MARKET UI
// ============================================================================

const predictions = [
  {
    question: "Will BTC reach $100k by Q4 2025?",
    yes: 67,
    no: 33,
    volume: "$45.2K",
    endDate: "Dec 31, 2025",
    category: "Crypto",
  },
  {
    question: "Will ETH 2.0 fully roll out in 2025?",
    yes: 82,
    no: 18,
    volume: "$23.1K",
    endDate: "Dec 31, 2025",
    category: "Crypto",
  },
];

export const PredictionMarketUI: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Prediction Market Interface</h2>
        <p className="text-muted-foreground mb-6">
          Binary prediction markets with yes/no voting and odds display.
        </p>
      </div>

      <div className="space-y-4">
        {predictions.map((pred, i) => (
          <Card key={i} className="hover:border-cyan-500/30 transition-colors">
            <CardContent className="py-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {pred.category}
                  </Badge>
                  <h3 className="font-bold text-lg">{pred.question}</h3>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {pred.endDate}
                  </div>
                  <div>Volume: {pred.volume}</div>
                </div>
              </div>

              {/* Yes/No Bar */}
              <div className="space-y-2 mb-4">
                <div className="h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-green-500 transition-all"
                    style={{ width: `${pred.yes}%` }}
                  />
                  <div
                    className="bg-red-500 transition-all"
                    style={{ width: `${pred.no}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Yes {pred.yes}%</span>
                  <span className="text-red-400">No {pred.no}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                  Buy Yes ({pred.yes}¢)
                </Button>
                <Button className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">
                  Buy No ({pred.no}¢)
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
};

// ============================================================================
// LEADERBOARD
// ============================================================================

const leaderboardData = [
  {
    rank: 1,
    name: "CryptoKing",
    avatar: "👑",
    wins: 156,
    profit: "$12,345",
    streak: 12,
  },
  {
    rank: 2,
    name: "TradeMaster",
    avatar: "🎯",
    wins: 142,
    profit: "$10,234",
    streak: 8,
  },
  {
    rank: 3,
    name: "LuckyTrader",
    avatar: "🍀",
    wins: 138,
    profit: "$9,876",
    streak: 5,
  },
  {
    rank: 4,
    name: "DiamondHands",
    avatar: "💎",
    wins: 125,
    profit: "$8,543",
    streak: 3,
  },
  {
    rank: 5,
    name: "MoonShot",
    avatar: "🚀",
    wins: 118,
    profit: "$7,654",
    streak: 2,
  },
];

export const GameLeaderboard: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Game Leaderboard</h2>
        <p className="text-muted-foreground mb-6">
          Competitive rankings with achievements and profit tracking.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              Top Players
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Daily</Badge>
              <Badge className="bg-cyan-500/20 text-cyan-400">Weekly</Badge>
              <Badge variant="outline">All Time</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  player.rank === 1
                    ? "bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30"
                    : player.rank <= 3
                      ? "bg-white/5"
                      : "hover:bg-white/5"
                }`}
              >
                {/* Rank */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    player.rank === 1
                      ? "bg-amber-500 text-black"
                      : player.rank === 2
                        ? "bg-gray-400 text-black"
                        : player.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-white/10"
                  }`}
                >
                  {player.rank}
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{player.avatar}</span>
                  <div>
                    <span className="font-semibold">{player.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Trophy className="h-3 w-3" />
                      {player.wins} wins
                    </div>
                  </div>
                </div>

                {/* Streak */}
                {player.streak > 0 && (
                  <Badge className="bg-orange-500/20 text-orange-400">
                    <Flame className="h-3 w-3 mr-1" />
                    {player.streak}
                  </Badge>
                )}

                {/* Profit */}
                <span className="text-green-400 font-bold font-mono">
                  {player.profit}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
