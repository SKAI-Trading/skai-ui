/**
 * SKAI UI Motion
 *
 * Re-exports framer-motion through skai-ui.
 * Import motion primitives from '@skai/ui/motion' instead of 'framer-motion' directly.
 *
 * @example
 * ```tsx
 * import { motion, AnimatePresence } from '@skai/ui/motion';
 * ```
 */
export {
  // Core
  motion,
  AnimatePresence,
  MotionConfig,
  // Layout
  Reorder,
  LayoutGroup,
  // Hooks
  useAnimation,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  useSpring,
  useInView,
  useScroll,
  useReducedMotion,
  useAnimate,
  // Utilities
  animate,
  stagger,
  // Values
  motionValue,
} from "framer-motion";

export type {
  MotionProps,
  Variants,
  Transition,
  AnimatePresenceProps,
  TargetAndTransition,
  MotionValue,
  Spring,
  Tween,
} from "framer-motion";
