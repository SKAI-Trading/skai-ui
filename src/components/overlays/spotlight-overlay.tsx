/**
 * Spotlight Overlay Component
 * 
 * Creates a full-screen overlay with a "spotlight" effect that highlights
 * a specific element while dimming/blurring everything else.
 * Used for tutorial systems, onboarding, and feature introductions.
 * 
 * Features:
 * - Animated bouncing arrows pointing to target
 * - Pulsing spotlight border
 * - Smooth transitions between steps
 * - Customizable progress indicator
 * - Multiple arrow directions based on element position
 * - Admin/preview mode support
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Eye, SkipForward } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../core/button";

// ============================================================================
// TYPES
// ============================================================================

export interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SpotlightStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  action: "click" | "input" | "navigate" | "observe";
  route?: string;
}

export interface SpotlightQuest {
  id: string;
  title: string;
  icon: string;
  steps: SpotlightStep[];
  points_reward?: number;
}

export interface SpotlightOverlayProps {
  /** Whether the spotlight is currently active */
  isActive: boolean;
  /** The quest/tutorial data */
  quest: SpotlightQuest | null;
  /** Current step index (0-based) */
  currentStepIndex: number;
  /** Current spotlight position */
  position: SpotlightPosition | null;
  /** Preview mode indicator */
  isPreviewMode?: boolean;
  /** Callback when user clicks next/complete */
  onNext?: () => void;
  /** Callback when user clicks previous */
  onPrevious?: () => void;
  /** Callback when user clicks skip/exit */
  onSkip?: () => void;
  /** Callback when user clicks close */
  onClose?: () => void;
  /** Custom arrow direction override */
  arrowDirection?: "up" | "down" | "left" | "right";
  /** Additional CSS class */
  className?: string;
}

interface AnimatedArrowProps {
  position: SpotlightPosition;
  direction: "up" | "down" | "left" | "right";
}

// ============================================================================
// ANIMATED ARROW COMPONENT
// ============================================================================

const AnimatedArrow: React.FC<AnimatedArrowProps> = ({ position, direction }) => {
  const getArrowStyle = () => {
    const arrowSize = 32;
    const offset = 12;
    
    switch (direction) {
      case "down":
        return {
          top: position.top - arrowSize - offset,
          left: position.left + position.width / 2 - arrowSize / 2,
          rotation: 0,
        };
      case "up":
        return {
          top: position.top + position.height + offset,
          left: position.left + position.width / 2 - arrowSize / 2,
          rotation: 180,
        };
      case "right":
        return {
          top: position.top + position.height / 2 - arrowSize / 2,
          left: position.left - arrowSize - offset,
          rotation: -90,
        };
      case "left":
        return {
          top: position.top + position.height / 2 - arrowSize / 2,
          left: position.left + position.width + offset,
          rotation: 90,
        };
    }
  };
  
  const style = getArrowStyle();
  
  return (
    <motion.div
      className="absolute pointer-events-none z-[10001]"
      style={{
        top: style.top,
        left: style.left,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <motion.div
        animate={{ 
          y: direction === "down" ? [0, 10, 0] : direction === "up" ? [0, -10, 0] : 0,
          x: direction === "left" ? [-10, 0, -10] : direction === "right" ? [10, 0, 10] : 0,
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: `rotate(${style.rotation}deg)` }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Glow effect */}
          <defs>
            <filter id="arrow-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M16 4L16 24M16 24L8 16M16 24L24 16"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#arrow-glow)"
          />
          <path
            d="M16 4L16 24M16 24L8 16M16 24L24 16"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SpotlightOverlay = React.forwardRef<HTMLDivElement, SpotlightOverlayProps>(
  ({
    isActive,
    quest,
    currentStepIndex,
    position,
    isPreviewMode = false,
    onNext,
    onPrevious,
    onSkip,
    onClose,
    arrowDirection: customArrowDirection,
    className,
  }, ref) => {
    if (!isActive || !position || !quest || !quest.steps[currentStepIndex]) {
      return null;
    }

    const currentStep = quest.steps[currentStepIndex];
    const totalSteps = quest.steps.length;
    const progress = ((currentStepIndex + 1) / totalSteps) * 100;

    // Auto-determine arrow direction if not provided
    const arrowDirection = customArrowDirection || (() => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const elementCenterX = position.left + position.width / 2;
      
      // Calculate position relative to viewport
      if (position.top < 100) {
        return "up";
      } else if (position.top + position.height > viewportHeight - 100) {
        return "down";
      } else if (elementCenterX < viewportWidth / 3) {
        return "right";
      } else if (elementCenterX > (viewportWidth * 2) / 3) {
        return "left";
      } else {
        return "down";
      }
    })();

    // Calculate tooltip position
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - (position.top + position.height);
    const spaceAbove = position.top;
    
    const tooltipHeight = 200;
    const preferBelow = spaceBelow > tooltipHeight || spaceBelow >= spaceAbove;
    
    const tooltipTop = preferBelow 
      ? position.top + position.height + 20
      : Math.max(16, position.top - tooltipHeight - 20);
    const tooltipLeft = Math.max(16, Math.min(position.left, window.innerWidth - 380));

    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-[9999] pointer-events-auto",
            className
          )}
        >
          {/* Dark overlay with cutout */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "auto" }}
          >
            <defs>
              {/* Create a mask with a transparent "hole" for the spotlight */}
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <motion.rect
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  x={position.left}
                  y={position.top}
                  width={position.width}
                  height={position.height}
                  rx="8"
                  fill="black"
                />
              </mask>
              
              {/* Blur filter for the overlay */}
              <filter id="spotlight-blur">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            
            {/* Dark overlay with the mask applied */}
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.85)"
              mask="url(#spotlight-mask)"
              onClick={() => {
                // Clicking outside spotlight does nothing - keeps tutorial focus
              }}
            />
          </svg>

          {/* Spotlight border glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: position.top - 4,
              left: position.left - 4,
              width: position.width + 8,
              height: position.height + 8,
              borderRadius: "12px",
              border: "3px solid #3b82f6",
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.1)",
            }}
          />

          {/* Multiple pulsing animation rings */}
          {[0, 0.5, 1].map((delay, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 2, repeat: Infinity, delay }}
              className="absolute pointer-events-none"
              style={{
                top: position.top - 4,
                left: position.left - 4,
                width: position.width + 8,
                height: position.height + 8,
                borderRadius: "12px",
                border: "2px solid #3b82f6",
              }}
            />
          ))}

          {/* Animated pointing arrow */}
          <AnimatedArrow position={position} direction={arrowDirection} />

          {/* Tooltip / Instruction panel */}
          <motion.div
            initial={{ opacity: 0, y: preferBelow ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "absolute border rounded-xl shadow-2xl p-4 pointer-events-auto",
              isPreviewMode 
                ? "bg-purple-900/95 border-purple-500/50" 
                : "bg-gray-900/95 border-gray-700"
            )}
            style={{
              top: tooltipTop,
              left: tooltipLeft,
              minWidth: "360px",
              maxWidth: "400px",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Preview mode indicator */}
            {isPreviewMode && (
              <div className="flex items-center gap-2 mb-3 px-2 py-1 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-purple-300">Preview Mode</span>
              </div>
            )}
            
            {/* Quest title and progress */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-2xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {quest.icon}
                </motion.span>
                <span className="text-sm font-medium text-gray-300">{quest.title}</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar with step dots */}
            <div className="relative mb-4">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    isPreviewMode 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  )}
                />
              </div>
              {/* Step dots */}
              <div className="absolute inset-0 flex items-center justify-between px-1">
                {quest.steps.map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full border-2 transition-colors",
                      i < currentStepIndex
                        ? "bg-green-500 border-green-400"
                        : i === currentStepIndex
                        ? isPreviewMode 
                          ? "bg-purple-500 border-purple-300" 
                          : "bg-blue-500 border-blue-300"
                        : "bg-gray-700 border-gray-600"
                    )}
                    animate={i === currentStepIndex ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>

            {/* Step indicator */}
            <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
              <span>Step {currentStepIndex + 1} of {totalSteps}</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs",
                currentStep.action === "click" ? "bg-blue-500/20 text-blue-300" :
                currentStep.action === "input" ? "bg-green-500/20 text-green-300" :
                currentStep.action === "navigate" ? "bg-purple-500/20 text-purple-300" :
                "bg-gray-500/20 text-gray-300"
              )}>
                {currentStep.action}
              </span>
            </div>

            {/* Current step instruction */}
            <h3 className="text-white font-semibold mb-1 text-lg">{currentStep.title}</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{currentStep.description}</p>
            
            {/* Target selector (preview mode only) */}
            {isPreviewMode && (
              <div className="text-xs text-gray-600 mb-3 font-mono bg-gray-800/50 px-2 py-1 rounded">
                Target: {currentStep.targetSelector}
                {currentStep.route && <span className="ml-2 text-purple-400">→ {currentStep.route}</span>}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              {/* Left side - Back and Skip controls */}
              <div className="flex items-center gap-1">
                {/* Back button - always show if not on first step */}
                {currentStepIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPrevious}
                    className="text-gray-400 hover:text-white px-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}
                
                {/* Skip/Exit button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-gray-500 hover:text-white text-xs"
                >
                  <SkipForward className="w-3 h-3 mr-1" />
                  {isPreviewMode ? "Exit" : "Skip All"}
                </Button>
              </div>
              
              {/* Right side - Points and Next */}
              <div className="flex items-center gap-2">
                {!isPreviewMode && quest.points_reward && (
                  <span className="text-xs text-cyan-400 font-medium">
                    +{quest.points_reward} pts
                  </span>
                )}
                <Button
                  size="sm"
                  onClick={onNext}
                  className={cn(
                    "text-white",
                    isPreviewMode 
                      ? "bg-purple-600 hover:bg-purple-500" 
                      : "bg-blue-600 hover:bg-blue-500"
                  )}
                >
                  {currentStepIndex === totalSteps - 1 
                    ? (isPreviewMode ? "Finish Preview" : "Complete") 
                    : "Next"
                  }
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

SpotlightOverlay.displayName = "SpotlightOverlay";

export { SpotlightOverlay };