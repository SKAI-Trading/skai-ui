/**
 * DockIcon Component
 *
 * macOS-style dock icons with magnification effect.
 * Perfect for navigation bars and toolbars.
 *
 * @example
 * ```tsx
 * import { DockContainer, DockIcon, SimpleDockIcon } from '@skai/ui';
 *
 * // With magnification
 * <DockContainer>
 *   <DockIcon label="Home" onClick={goHome}>
 *     <HomeIcon />
 *   </DockIcon>
 *   <DockIcon label="Settings" onClick={openSettings}>
 *     <SettingsIcon />
 *   </DockIcon>
 * </DockContainer>
 *
 * // Simple variant without magnification
 * <SimpleDockIcon label="Menu" onClick={toggle}>
 *   <MenuIcon />
 * </SimpleDockIcon>
 * ```
 */

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

interface DockIconProps {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  className?: string;
  isActive?: boolean;
  showNotification?: boolean;
  notificationCount?: number;
  notificationColor?: "red" | "cyan" | "green" | "yellow";
  disabled?: boolean;
}

interface DockContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Context for dock magnification
const DockContext = React.createContext<{
  mouseX: number | null;
  registerItem: (ref: HTMLDivElement | null, index: number) => void;
  getScale: (index: number) => number;
}>({
  mouseX: null,
  registerItem: () => {},
  getScale: () => 1,
});

const DockContainer: React.FC<DockContainerProps> = ({
  children,
  className,
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const registerItem = (ref: HTMLDivElement | null, index: number) => {
    if (ref) {
      itemRefs.current.set(index, ref);
    } else {
      itemRefs.current.delete(index);
    }
  };

  const getScale = (index: number) => {
    if (mouseX === null) return 1;

    const item = itemRefs.current.get(index);
    if (!item || !containerRef.current) return 1;

    const itemRect = item.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemCenter = itemRect.left + itemRect.width / 2 - containerRect.left;

    const distance = Math.abs(mouseX - itemCenter);
    const maxDistance = 80; // pixels
    const maxScale = 1.4;
    const minScale = 1;

    if (distance > maxDistance) return minScale;

    // Smooth easing curve
    const progress = 1 - distance / maxDistance;
    const easedProgress = Math.sin((progress * Math.PI) / 2); // Sine easing

    return minScale + (maxScale - minScale) * easedProgress;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    };

    const handleMouseLeave = () => {
      setMouseX(null);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <DockContext.Provider value={{ mouseX, registerItem, getScale }}>
      <div
        ref={containerRef}
        className={cn(
          "flex items-end gap-1 px-2 py-1 h-full",
          "rounded-xl",
          "bg-black/20 backdrop-blur-xl",
          "border border-white/5",
          className,
        )}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<
                DockIconProps & { _dockIndex?: number }
              >,
              {
                _dockIndex: index,
              },
            );
          }
          return child;
        })}
      </div>
    </DockContext.Provider>
  );
};
DockContainer.displayName = "DockContainer";

const DockIcon: React.FC<DockIconProps & { _dockIndex?: number }> = ({
  children,
  label,
  onClick,
  href,
  target,
  className,
  isActive,
  showNotification,
  notificationCount,
  notificationColor = "red",
  disabled,
  _dockIndex = 0,
}) => {
  const { registerItem, getScale, mouseX } = React.useContext(DockContext);
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    registerItem(itemRef.current, _dockIndex);
    return () => registerItem(null, _dockIndex);
  }, [_dockIndex, registerItem]);

  const scale = mouseX !== null ? getScale(_dockIndex) : 1;
  const isNearby = scale > 1.1;

  const notificationColors = {
    red: "bg-red-500",
    cyan: "bg-cyan-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  const content = (
    <div
      ref={itemRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          "w-8 h-8 rounded-lg",
          "bg-white/5 backdrop-blur-[2px]",
          "border border-white/10",
          "transition-all duration-150 ease-out",
          "cursor-pointer",
          isActive && "text-primary bg-primary/10 border-primary/30",
          disabled && "opacity-50 cursor-not-allowed",
          isHovered && !disabled && "bg-white/10 border-white/20",
          className,
        )}
        style={{
          transform: `scale(${scale}) translateY(${(scale - 1) * -8}px)`,
          boxShadow: isNearby
            ? "0 4px 20px 0 rgba(255,255,255,0.1)"
            : undefined,
        }}
        onClick={disabled ? undefined : onClick}
      >
        <div
          className={cn(
            "transition-all duration-150",
            isNearby && "drop-shadow-[0_1px_4px_rgba(255,255,255,0.15)]",
          )}
        >
          {children}
        </div>

        {/* Notification badge with count or dot */}
        {showNotification &&
          (notificationCount && notificationCount > 0 ? (
            <span
              className={cn(
                "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1",
                "flex items-center justify-center",
                "rounded-full text-[10px] font-bold text-white",
                "border-2 border-background",
                notificationColors[notificationColor],
              )}
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse",
                notificationColors[notificationColor],
              )}
            />
          ))}
      </div>

      {/* Tooltip */}
      <div
        className={cn(
          "absolute -top-9 left-1/2 transform -translate-x-1/2",
          "px-2 py-1 rounded-md",
          "bg-black/80 backdrop-blur-md",
          "text-white text-[10px] font-medium",
          "border border-white/10",
          "transition-all duration-150",
          "pointer-events-none",
          "whitespace-nowrap",
          "z-50",
          isHovered && scale > 1.15
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1",
        )}
      >
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
          <div className="w-1.5 h-1.5 bg-black/80 rotate-45 border-r border-b border-white/10" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className="flex items-center"
      >
        {content}
      </a>
    );
  }

  return content;
};
DockIcon.displayName = "DockIcon";

// Simple variant without magnification for simpler use cases
const SimpleDockIcon: React.FC<Omit<DockIconProps, "_dockIndex">> = ({
  children,
  label,
  onClick,
  href,
  target,
  className,
  isActive,
  showNotification,
  notificationCount,
  notificationColor = "red",
  disabled,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const notificationColors = {
    red: "bg-red-500",
    cyan: "bg-cyan-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  const content = (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          "w-8 h-8 rounded-lg",
          "bg-white/5 backdrop-blur-[2px]",
          "border border-white/10",
          "transition-all duration-200 ease-out",
          "cursor-pointer",
          isActive && "text-primary bg-primary/10 border-primary/30",
          disabled && "opacity-50 cursor-not-allowed",
          isHovered &&
            !disabled && [
              "scale-110 bg-white/10 border-white/20 -translate-y-1",
              "shadow-lg shadow-white/10",
            ],
          className,
        )}
        onClick={disabled ? undefined : onClick}
      >
        <div
          className={cn(
            "transition-all duration-200",
            isHovered &&
              "scale-105 drop-shadow-[0_1px_4px_rgba(255,255,255,0.10)]",
          )}
        >
          {children}
        </div>

        {/* Notification badge */}
        {showNotification &&
          (notificationCount && notificationCount > 0 ? (
            <span
              className={cn(
                "absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full",
                "flex items-center justify-center",
                "text-[9px] font-bold text-white",
                notificationColors[notificationColor],
              )}
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse",
                notificationColors[notificationColor],
              )}
            />
          ))}
      </div>

      {/* Tooltip */}
      <div
        className={cn(
          "absolute -top-9 left-1/2 transform -translate-x-1/2",
          "px-2 py-1 rounded-md",
          "bg-black/80 backdrop-blur-md",
          "text-white text-[10px] font-medium",
          "border border-white/10",
          "transition-all duration-150",
          "pointer-events-none",
          "whitespace-nowrap",
          "z-50",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        )}
      >
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
          <div className="w-1.5 h-1.5 bg-black/80 rotate-45 border-r border-b border-white/10" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className="flex items-center"
      >
        {content}
      </a>
    );
  }

  return content;
};
SimpleDockIcon.displayName = "SimpleDockIcon";

export { DockContainer, DockIcon, SimpleDockIcon };
export type { DockIconProps, DockContainerProps };
