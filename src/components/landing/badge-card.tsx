import * as React from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";
import { assets } from "../../lib/assets";

const d = content.landing.waitlist.dashboard;

export interface LeaderboardUser {
  username: string;
  skai_points: number;
}

export interface BadgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeName: string;
  badgeSubtitle: string;
  badgePoints: number;
  badgeIcon?: string;
  statusLabel?: string;
  /** Top users for mini-leaderboard */
  topUsers?: LeaderboardUser[];
  /** Body copy for the "?" coachmark on the subtitle line. Pass "" to drop the icon. */
  helpBody?: string;
}

/**
 * icons/action "?" — Figma I2481:12509;1224:1009. Exported vector, a 13.333px
 * glyph centred in a 16px box, App/Ash 300.
 */
const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 13.3333 13.3334" fill="none" className={className} aria-hidden="true">
    <path
      d="M6.63333 10.6667C6.86667 10.6667 7.064 10.586 7.22533 10.4247C7.38667 10.2633 7.46711 10.0662 7.46667 9.83334C7.46622 9.60045 7.38578 9.40311 7.22533 9.24134C7.06489 9.07956 6.86756 8.99911 6.63333 9C6.39911 9.00089 6.202 9.08156 6.042 9.242C5.882 9.40245 5.80133 9.59956 5.8 9.83334C5.79867 10.0671 5.87933 10.2644 6.042 10.4253C6.20467 10.5862 6.40178 10.6667 6.63333 10.6667ZM6.03333 8.1H7.26667C7.26667 7.73334 7.30845 7.44445 7.392 7.23334C7.47556 7.02223 7.71156 6.73334 8.1 6.36667C8.38889 6.07778 8.61667 5.80267 8.78333 5.54134C8.95 5.28 9.03333 4.96623 9.03333 4.6C9.03333 3.97778 8.80556 3.5 8.35 3.16667C7.89445 2.83334 7.35556 2.66667 6.73333 2.66667C6.1 2.66667 5.58622 2.83334 5.192 3.16667C4.79778 3.5 4.52267 3.9 4.36667 4.36667L5.46667 4.8C5.52222 4.6 5.64733 4.38334 5.842 4.15C6.03667 3.91667 6.33378 3.8 6.73333 3.8C7.08889 3.8 7.35556 3.89734 7.53333 4.092C7.71111 4.28667 7.8 4.50045 7.8 4.73334C7.8 4.95556 7.73333 5.164 7.6 5.35867C7.46667 5.55334 7.3 5.73378 7.1 5.9C6.61111 6.33334 6.31111 6.66111 6.2 6.88334C6.08889 7.10556 6.03333 7.51111 6.03333 8.1ZM6.66667 13.3333C5.74445 13.3333 4.87778 13.1584 4.06667 12.8087C3.25556 12.4589 2.55 11.9838 1.95 11.3833C1.35 10.7829 0.875112 10.0773 0.525334 9.26667C0.175556 8.456 0.000445288 7.58934 8.43882e-07 6.66667C-0.000443601 5.744 0.174668 4.87734 0.525334 4.06667C0.876001 3.256 1.35089 2.55045 1.95 1.95C2.54911 1.34956 3.25467 0.87467 4.06667 0.525337C4.87867 0.176003 5.74533 0.000892256 6.66667 3.367e-06C7.588 -0.000885522 8.45467 0.174226 9.26667 0.525337C10.0787 0.876448 10.7842 1.35134 11.3833 1.95C11.9824 2.54867 12.4576 3.25423 12.8087 4.06667C13.1598 4.87912 13.3347 5.74578 13.3333 6.66667C13.332 7.58756 13.1569 8.45423 12.808 9.26667C12.4591 10.0791 11.9842 10.7847 11.3833 11.3833C10.7824 11.982 10.0769 12.4571 9.26667 12.8087C8.45645 13.1602 7.58978 13.3351 6.66667 13.3333Z"
      fill="currentColor"
    />
  </svg>
);

/** icons/action close — Figma I2481:14734;1243:972;778:199. */
const CoachCloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 12.708 12.707" fill="none" className={className} aria-hidden="true">
    <path
      d="M12.708 0.707031L7.06055 6.35352L12.708 12L12 12.707L6.35352 7.06055L0.707031 12.707L0 12L5.64648 6.35352L0 0.707031L0.707031 0L6.35352 5.64551L12 0L12.708 0.707031Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Coachmark connector — Figma I2481:14734;1243:982. 35.0057x14.5806, apex down
 * in its natural orientation; rotated 180 for the bubble-below layout and 90
 * for the bubble-right layout, exactly like the two frame variants.
 */
const CoachArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 35.0057 14.5806" fill="none" className={className} aria-hidden="true">
    <path
      d="M20.2017 13.5329C18.6736 14.9298 16.3321 14.9298 14.804 13.5329L0 0L35.0057 3.06029e-06L20.2017 13.5329Z"
      fill="#123F3C"
    />
  </svg>
);

const BadgeCard = React.forwardRef<HTMLDivElement, BadgeCardProps>(
  (
    {
      badgeName,
      badgeSubtitle,
      badgePoints,
      badgeIcon = assets.badges.pioneer,
      statusLabel = d.badge.status,
      topUsers,
      helpBody = d.badge.helpBody,
      className,
      ...props
    },
    ref,
  ) => {
    const [coachOpen, setCoachOpen] = React.useState(false);
    const coachRef = React.useRef<HTMLDivElement>(null);

    // Escape and outside-click close the coachmark. It is a popover, not a
    // modal, so there is no scrim to hang an onClick on.
    React.useEffect(() => {
      if (!coachOpen) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setCoachOpen(false);
      };
      const onDown = (e: MouseEvent) => {
        if (coachRef.current && !coachRef.current.contains(e.target as Node)) {
          setCoachOpen(false);
        }
      };
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onDown);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("mousedown", onDown);
      };
    }, [coachOpen]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-[33px] rounded-[24px] border border-[#123F3C] bg-[#0D3331] relative",
          className,
        )}
        {...props}
      >
        {/* Badge Info Row */}
        <div className="flex flex-row items-center gap-3 md:gap-4">
          {/* Badge Icon */}
          <div className="flex-shrink-0">
            <img
              src={badgeIcon}
              alt={badgeName}
              className="w-12 h-12 md:w-[80px] md:h-[80px] lg:w-[150px] lg:h-[150px] object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = assets.badges.earlyAdopter; }}
            />
          </div>

          <div className="flex md:flex-col justify-between lg:gap-4 gap-2 w-full">
            {/* Text */}
            <div className="flex flex-col flex-1 justify-center min-w-0">
              <h3 className="font-manrope font-light text-white text-[16px] leading-[18px] md:text-[18px] md:leading-[22px] lg:text-[24px] lg:leading-[28px] tracking-[-0.72px] md:tracking-[-0.8px] lg:tracking-[-0.96px] mb-[4px]">
                {badgeName}
              </h3>
              {/* Subtitle line — Figma 2481:12507 (1440) / 2481:17253 (375)
                  put a 16px icons/action "?" 4px after the subtitle text, and
                  the "- Tooltip" frames (2481:11481, 2481:14785, 2481:15918)
                  are the state where pressing it opens the coachmark. */}
              <div className="flex flex-row items-center gap-1">
                <p className="font-manrope font-normal text-[#E0E0E0] text-[12px] md:text-[14px] leading-[16px] md:leading-[20px]">
                  {badgeSubtitle}
                </p>
                {helpBody ? (
                  <div ref={coachRef} className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setCoachOpen((v) => !v)}
                      aria-label={d.badge.helpLabel}
                      aria-expanded={coachOpen}
                      data-probe="badge-help"
                      className="flex h-4 w-4 items-center justify-center text-[#95A09F] transition-colors hover:text-white"
                    >
                      <HelpIcon className="h-[13.33px] w-[13.33px]" />
                    </button>

                    {coachOpen && (
                      /* 2481:14734 is 250x218 at 1440 — a 16px connector
                         column plus a 234px bubble, sitting 4px right of the
                         icon and centred on it. 2481:17333 is the 375 variant:
                         same 250 width, connector on top, bubble full-width at
                         12px padding and 12/14 type. rounded-lg is 8px in the
                         frame, which is NOT this codebase's rounded-lg (12px),
                         so the radius is written in pixels. */
                      <div
                        data-probe="badge-coachmark"
                        role="tooltip"
                        /* Below lg the bubble hangs under the icon and is
                           CENTRED on it (2481:17333 sits the icon ~56% across
                           its 250px width). Right-anchoring it ran the left
                           edge 33px off a 375 viewport once the badge card was
                           narrow enough. */
                        className="absolute left-1/2 top-[calc(100%+4px)] z-30 flex w-[250px] max-w-[calc(100vw-32px)] -translate-x-1/2 flex-col items-center lg:left-[calc(100%+4px)] lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 lg:flex-row"
                      >
                        <span className="flex h-4 w-[35.01px] shrink-0 items-center justify-center lg:h-[35.01px] lg:w-4">
                          <CoachArrowIcon className="h-4 w-[35.01px] shrink-0 rotate-180 lg:rotate-90" />
                        </span>
                        <div
                          data-probe="badge-coachmark-bubble"
                          className="w-full rounded-[8px] bg-[#123F3C] p-3 lg:w-[234px] lg:p-4"
                        >
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setCoachOpen(false)}
                              aria-label="Close"
                              className="flex h-4 w-4 items-center justify-center text-[#95A09F] transition-colors hover:text-white"
                            >
                              <CoachCloseIcon className="h-[12.71px] w-[12.71px]" />
                            </button>
                          </div>
                          <p className="font-manrope mt-2 text-left font-normal text-[#E0E0E0] text-[12px] leading-[14px] tracking-[-0.48px] lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]">
                            {helpBody}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Reward and Status */}
            <div className="flex flex-col md:flex-row items-end gap-[6px] md:gap-[10px] flex-shrink-0">
              <span className="font-manrope font-normal text-[#2DEDAD] text-[14px] md:text-[16px] lg:text-[22px] leading-[18px] md:leading-[20px] lg:leading-[26px] whitespace-nowrap">
                +{badgePoints} SKAI Points
              </span>
              <span className="font-manrope text-[10px] md:text-[8px] lg:text-[11px] leading-[12px] md:leading-[10px] lg:leading-[14px] px-[8px] md:px-[8px] lg:px-[12px] py-[3px] md:py-[2px] lg:py-[4px] rounded-[8px] bg-[#2DEDAD] text-[#001615] whitespace-nowrap">
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Mini Leaderboard */}
        {topUsers && topUsers.length > 0 && (
          <div className="flex flex-col gap-[6px] mt-1 pt-3 border-t border-[#1a3a37]">
            <div className="flex items-center justify-between mb-[2px]">
              <span className="font-manrope font-medium text-[#8B9E9D] text-[11px] md:text-[12px] uppercase tracking-[0.5px]">
                Leaderboard
              </span>
              <span className="font-manrope text-[10px] text-[#5A7170]">
                by SKAI Points
              </span>
            </div>
            {topUsers.map((user, i) => (
              <div
                key={user.username}
                className="flex items-center justify-between py-[3px] md:py-[4px]"
              >
                <div className="flex items-center gap-[8px] min-w-0">
                  <span
                    className={cn(
                      "font-manrope font-bold text-[11px] md:text-[12px] w-[16px] text-center flex-shrink-0",
                      i === 0 ? "text-[#eab308]" : i === 1 ? "text-[#9ca3af]" : i === 2 ? "text-[#b45309]" : "text-[#5A7170]",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="font-manrope font-normal text-white text-[12px] md:text-[13px] truncate">
                    {user.username}
                  </span>
                </div>
                <span className="font-manrope font-medium text-[#2DEDAD] text-[11px] md:text-[12px] tabular-nums flex-shrink-0 ml-2">
                  {user.skai_points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
BadgeCard.displayName = "BadgeCard";

export { BadgeCard };
