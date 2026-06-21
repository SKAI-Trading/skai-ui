import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";

export interface MediaSlide {
  type: "image" | "video";
  src: string;
  alt?: string;
}

export interface MediaSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: MediaSlide[];
  autoPlayInterval?: number;
  pauseDuration?: number;
}

const MediaSlider = React.forwardRef<HTMLDivElement, MediaSliderProps>(
  (
    {
      slides,
      autoPlayInterval = 5000,
      pauseDuration = 10000,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

    const setVideoRef = useCallback(
      (index: number) => (el: HTMLVideoElement | null) => {
        if (el) videoRefs.current.set(index, el);
        else videoRefs.current.delete(index);
      },
      [],
    );

    // Play/pause videos when slide changes, sync mute state
    useEffect(() => {
      videoRefs.current.forEach((video, index) => {
        video.muted = isMuted;
        if (index === currentSlide) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, [currentSlide, isMuted]);

    // Auto-play
    useEffect(() => {
      if (isAutoPlayPaused || slides.length <= 1) return;
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }, [slides.length, isAutoPlayPaused, autoPlayInterval]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      };
    }, []);

    const pauseAutoPlay = () => {
      setIsAutoPlayPaused(true);
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = setTimeout(() => {
        setIsAutoPlayPaused(false);
        autoPlayTimeoutRef.current = null;
      }, pauseDuration);
    };

    const goToSlide = (index: number) => {
      setCurrentSlide(index);
      pauseAutoPlay();
    };

    const goToPrevious = () => {
      setCurrentSlide(
        (prev) => (prev - 1 + slides.length) % slides.length,
      );
      pauseAutoPlay();
    };

    const goToNext = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      pauseAutoPlay();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#0a1a19] rounded-[32px] border border-[#123F3C] overflow-hidden flex flex-col justify-center relative",
          className,
        )}
        {...props}
      >
        {/* aspect-video (16:9) matches the 1920x1080 teaser source exactly. A
            16:10 frame around a 16:9 video left dead letterbox bars top+bottom
            (object-contain fits to width), which read as the video being "cut
            off on top and bottom" (report c3b1dc3b). Matching the source aspect
            fills the frame edge-to-edge with no letterbox and no crop. */}
        <div className="relative w-full aspect-video overflow-hidden">
          <div className="relative w-full h-full">
            {slides.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 w-full h-full transition-opacity duration-500",
                  index === currentSlide
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none",
                )}
              >
                {item.type === "image" ? (
                  <>
                    {!imageErrors[index] ? (
                      <img
                        src={item.src}
                        alt={item.alt || `Slide ${index + 1}`}
                        className="w-full h-full object-contain bg-[#0a1a19]"
                        onError={() =>
                          setImageErrors((prev) => ({
                            ...prev,
                            [index]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
                        <div className="text-[#E0E0E0] font-manrope text-[14px] md:text-[16px]">
                          Image failed to load
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <video
                    ref={setVideoRef(index)}
                    src={item.src}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.7)] border border-[rgba(255,255,255,0.2)] flex items-center justify-center transition-all"
                aria-label="Previous slide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.7)] border border-[rgba(255,255,255,0.2)] flex items-center justify-center transition-all"
                aria-label="Next slide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Mute/Unmute toggle — visible only on video slides */}
          {slides[currentSlide]?.type === "video" && (
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="absolute right-3 bottom-14 z-20 w-8 h-8 rounded-full bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.7)] border border-[rgba(255,255,255,0.2)] flex items-center justify-center transition-all"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              )}
            </button>
          )}

          {/* Dot Indicators */}
          {slides.length > 1 && (
            <div className="absolute left-0 right-0 bottom-0 py-3 px-4 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm z-20 flex gap-2">
              {slides.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "transition-all h-1.5 duration-300 rounded-full cursor-pointer bg-white/40",
                    index === currentSlide ? "w-9" : "w-1.5",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);
MediaSlider.displayName = "MediaSlider";

export { MediaSlider };
