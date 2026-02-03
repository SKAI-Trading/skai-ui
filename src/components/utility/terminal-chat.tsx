/**
 * Terminal Chat Component
 * 
 * A retro-style terminal interface for AI interactions.
 * Features typing animations, system messages, and console-style UI.
 * 
 * Used for:
 * - AI chat interfaces
 * - System status displays
 * - Command-line style interactions
 * - Onboarding experiences
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Send,
  Loader2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../core/button";
import { Input } from "../core/input";

// ============================================================================
// TYPES
// ============================================================================

export interface TerminalLine {
  id: string;
  text: string;
  type: "system" | "user" | "ai" | "error" | "success";
  timestamp: Date;
}

export interface TerminalChatProps {
  /** Terminal lines to display */
  lines: TerminalLine[];
  /** Whether the terminal is currently processing */
  isProcessing?: boolean;
  /** Whether to show typing animation for system messages */
  isTyping?: boolean;
  /** Initial system messages to display with typing effect */
  initialMessages?: string[];
  /** Current input value */
  input?: string;
  /** Input change handler */
  onInputChange?: (value: string) => void;
  /** Submit handler */
  onSubmit?: (input: string) => Promise<void> | void;
  /** Whether the input should be disabled */
  disabled?: boolean;
  /** Placeholder text for input */
  placeholder?: string;
  /** Terminal title */
  title?: string;
  /** Color scheme variant */
  variant?: "default" | "success" | "warning" | "error";
  /** Height of the terminal */
  height?: string;
  /** Additional CSS class */
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TerminalChat = React.forwardRef<HTMLDivElement, TerminalChatProps>(
  ({
    lines,
    isProcessing = false,
    isTyping = false,
    initialMessages = [],
    input = "",
    onInputChange,
    onSubmit,
    disabled = false,
    placeholder = "Enter command...",
    title = "Terminal",
    variant = "default",
    height = "400px",
    className,
  }, ref) => {
    const [currentLines, setCurrentLines] = React.useState<TerminalLine[]>([]);
    const [internalInput, setInternalInput] = React.useState(input);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Color schemes
    const colorSchemes = {
      default: {
        bg: "bg-black/90",
        text: "text-green-400",
        border: "border-green-500/30",
        accent: "text-green-300",
        prompt: "text-cyan-400",
      },
      success: {
        bg: "bg-black/90",
        text: "text-green-400",
        border: "border-green-500/50",
        accent: "text-green-300",
        prompt: "text-green-400",
      },
      warning: {
        bg: "bg-black/90",
        text: "text-yellow-400",
        border: "border-yellow-500/50",
        accent: "text-yellow-300",
        prompt: "text-yellow-400",
      },
      error: {
        bg: "bg-black/90",
        text: "text-red-400",
        border: "border-red-500/50",
        accent: "text-red-300",
        prompt: "text-red-400",
      },
    };

    const colors = colorSchemes[variant];

    // Initialize with external lines
    React.useEffect(() => {
      setCurrentLines(lines);
    }, [lines]);

    // Auto-scroll to bottom
    React.useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [currentLines, isProcessing]);

    // Initial typing animation
    React.useEffect(() => {
      if (initialMessages.length > 0 && isTyping) {
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex < initialMessages.length) {
            setCurrentLines(prev => [
              ...prev,
              {
                id: `init-${currentIndex}`,
                text: initialMessages[currentIndex],
                type: "system",
                timestamp: new Date(),
              },
            ]);
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, 600);

        return () => clearInterval(interval);
      }
    }, [initialMessages, isTyping]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInternalInput(value);
      onInputChange?.(value);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = internalInput.trim();
      if (!trimmed || disabled || isProcessing) return;

      // Add user line
      const userLine: TerminalLine = {
        id: `user-${Date.now()}`,
        text: `> ${trimmed}`,
        type: "user",
        timestamp: new Date(),
      };
      
      setCurrentLines(prev => [...prev, userLine]);
      setInternalInput("");
      
      // Call submit handler
      await onSubmit?.(trimmed);
    };

    // Get line color based on type
    const getLineColor = (type: TerminalLine["type"]) => {
      switch (type) {
        case "system":
          return colors.text;
        case "user":
          return colors.prompt;
        case "ai":
          return colors.accent;
        case "error":
          return "text-red-400";
        case "success":
          return "text-green-400";
        default:
          return colors.text;
      }
    };

    // Get line prefix based on type
    const getLinePrefix = (type: TerminalLine["type"]) => {
      switch (type) {
        case "user":
          return ">";
        case "ai":
          return "AI>";
        case "error":
          return "ERROR>";
        case "success":
          return "SUCCESS>";
        default:
          return "";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg overflow-hidden font-mono text-sm",
          colors.bg,
          colors.border,
          "border",
          className
        )}
        style={{ height }}
      >
        {/* Terminal header */}
        <div className={cn(
          "flex items-center justify-between px-4 py-2 border-b",
          colors.border,
          "bg-black/50"
        )}>
          <div className="flex items-center gap-2">
            <Terminal className={cn("w-4 h-4", colors.text)} />
            <span className={cn("font-medium", colors.text)}>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {isProcessing && (
              <div className="flex items-center gap-1">
                <Loader2 className={cn("w-3 h-3 animate-spin", colors.accent)} />
                <span className={cn("text-xs", colors.accent)}>Processing...</span>
              </div>
            )}
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        {/* Terminal content */}
        <div
          ref={scrollRef}
          className="p-4 overflow-y-auto"
          style={{ height: "calc(100% - 100px)" }}
        >
          <AnimatePresence mode="wait">
            {currentLines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={cn(
                  "mb-1 break-words",
                  getLineColor(line.type)
                )}
              >
                <span className="select-none mr-2 opacity-50">
                  {line.timestamp.toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                {getLinePrefix(line.type) && (
                  <span className="mr-1 font-bold">
                    {getLinePrefix(line.type)}
                  </span>
                )}
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Processing indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("flex items-center gap-2 mt-2", colors.accent)}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing request</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ...
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex items-center gap-2 p-4 border-t",
            colors.border,
            "bg-black/30"
          )}
        >
          <div className={cn("flex items-center gap-1", colors.prompt)}>
            <span className="font-bold">{">"}</span>
          </div>
          <Input
            value={internalInput}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled || isProcessing}
            className={cn(
              "flex-1 bg-transparent border-none outline-none font-mono",
              colors.text,
              "placeholder:text-gray-600"
            )}
            autoComplete="off"
          />
          <Button
            type="submit"
            size="sm"
            disabled={disabled || isProcessing || !internalInput.trim()}
            className={cn(
              "bg-transparent border hover:bg-white/10",
              colors.border,
              colors.text
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Scan lines effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-current to-transparent opacity-[0.02] animate-pulse" />
          <motion.div
            animate={{ y: [0, "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className={cn(
              "absolute inset-x-0 h-[1px] bg-current opacity-20",
              colors.text
            )}
          />
        </div>
      </div>
    );
  }
);

TerminalChat.displayName = "TerminalChat";

export { TerminalChat };