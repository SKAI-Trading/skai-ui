/**
 * Spectator Overlay Component
 * 
 * UI overlay shown when spectating another player in gaming contexts.
 * Features real-time stats, live indicators, and smooth animations.
 * 
 * Used for:
 * - Live game spectating
 * - Player following
 * - Real-time stat display
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, User, Zap, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../core/button";

// ============================================================================
// TYPES
// ============================================================================

export interface SpectatorInfo {
  id: string;
  name: string;
  avatar?: string;
  level?: number;
  badge?: string;
}

export interface SpectatorGameState {
  betAmount: number;
  lastWin: number;
  currentGame?: string;
  streak?: number;
  totalWins?: number;
}

export interface SpectatorOverlayProps {
  /** Whether the spectator overlay is active */
  isActive: boolean;
  /** Player being spectated */
  player: SpectatorInfo | null;
  /** Current game state */
  gameState: SpectatorGameState | null;
  /** Callback when exiting spectator mode */
  onExit: () => void;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SpectatorOverlay = React.forwardRef<HTMLDivElement, SpectatorOverlayProps>(
  ({ isActive, player, gameState, onExit, className }, ref) => {
    if (!isActive || !player) return null;

    const multiplier =
      gameState && gameState.betAmount > 0
        ? gameState.lastWin / gameState.betAmount
        : 0;

    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "absolute top-0 left-0 right-0 z-50 pointer-events-none",
            className
          )}
        >
          {/* Top banner */}
          <div className="bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-purple-900/95 backdrop-blur-sm border-b border-purple-500/30 pointer-events-auto">
            <div className="flex items-center justify-between px-4 py-2">
              {/* Left: Watching indicator */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 text-purple-300" />
                </motion.div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200 text-xs uppercase tracking-wider">
                      Watching Live
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-red-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <User className="w-3 h-3 text-purple-200" />
                      </div>
                    )}
                    <span className="font-bold text-white">{player.name}</span>
                    {player.level && (
                      <span className="text-xs px-2 py-0.5 bg-purple-500/30 rounded-full text-purple-200">
                        Lv.{player.level}
                      </span>
                    )}
                    {player.badge && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300">
                        {player.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: Live stats */}
              {gameState && (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-purple-300 text-xs">Bet</div>
                    <div className="font-mono text-white font-bold">
                      {gameState.betAmount.toFixed(4)} SKAI
                    </div>
                  </div>

                  {gameState.lastWin > 0 && (
                    <>
                      <div className="text-center">
                        <div className="text-purple-300 text-xs">Last Win</div>
                        <div className="font-mono text-green-400 font-bold">
                          {gameState.lastWin.toFixed(4)} SKAI
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-purple-300 text-xs">Multiplier</div>
                        <div className={cn(
                          "font-mono font-bold flex items-center gap-1",
                          multiplier >= 2 ? "text-green-400" : "text-yellow-400"
                        )}>
                          {multiplier >= 2 && <TrendingUp className="w-3 h-3" />}
                          {multiplier.toFixed(2)}x
                        </div>
                      </div>
                    </>
                  )}

                  {gameState.currentGame && (
                    <div className="text-center">
                      <div className="text-purple-300 text-xs">Game</div>
                      <div className="text-white font-semibold">
                        {gameState.currentGame}
                      </div>
                    </div>
                  )}

                  {typeof gameState.streak === "number" && gameState.streak > 1 && (
                    <div className="text-center">
                      <div className="text-purple-300 text-xs">Streak</div>
                      <div className="text-orange-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {gameState.streak}
                      </div>
                    </div>
                  )}

                  {typeof gameState.totalWins === "number" && gameState.totalWins > 0 && (
                    <div className="text-center">
                      <div className="text-purple-300 text-xs">Total Wins</div>
                      <div className="text-cyan-400 font-semibold">
                        {gameState.totalWins}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Right: Exit button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExit}
                  className="text-purple-300 hover:text-white hover:bg-purple-500/20 border border-purple-500/30"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit Spectate
                </Button>
              </div>
            </div>
          </div>

          {/* Live indicator pulse overlay */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

SpectatorOverlay.displayName = "SpectatorOverlay";

export { SpectatorOverlay };