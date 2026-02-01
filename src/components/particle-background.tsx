/**
 * Particle Background Animation Component
 *
 * Creates subtle floating particle effects for decorative backgrounds.
 * Uses Canvas for performance and minimal memory footprint.
 *
 * @example
 * ```tsx
 * import { ParticleBackground } from '@skai/ui';
 *
 * function Page() {
 *   return (
 *     <div className="relative">
 *       <ParticleBackground particleCount={30} speed={0.5} />
 *       <div className="relative z-10">Content</div>
 *     </div>
 *   );
 * }
 * ```
 */

import * as React from "react";
import { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  /** Number of particles (default: 50) */
  particleCount?: number;
  /** RGB color for particles (default: '100, 200, 255') */
  color?: string;
  /** Opacity range [min, max] (default: [0.1, 0.3]) */
  opacityRange?: [number, number];
  /** Speed multiplier (default: 1) */
  speed?: number;
  /** Whether the animation is enabled (default: true) */
  enabled?: boolean;
  /** Additional class names */
  className?: string;
}

// Particle type
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  color = "100, 200, 255", // RGB values for primary-ish color
  opacityRange = [0.1, 0.3],
  speed = 1,
  enabled = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    resizeCanvas();

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3 * speed,
        speedY: (Math.random() - 0.5) * 0.3 * speed,
        opacity:
          Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, color, opacityRange, speed, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className || ""}`}
      style={{ zIndex: 1 }}
    />
  );
};
ParticleBackground.displayName = "ParticleBackground";

export { ParticleBackground };
export type { ParticleBackgroundProps };
