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

    // The dashboard boards draw the card in Green Coal 200 on a Green Coal 100
    // line, with their shadow, and per width this corner and padding:
    //   375 (2424:7715)   343x80,  r20, 8 / 16 / 8 / 12, badge 48, gap 12
    //   768 (2424:4081)   352x112, r18, 16 all round,    badge 80, gap 16
    //   1440 (2422:2943)  448x216, r24, 32 / 32 / 32 / 16, badge 150, gap 8
    // At 1440 that is 16 + 150 + 8 + 242 + 32: the 242 is what "+500 SKAI
    // points" (163) and the Credited pill (64, 10 after it) need side by side
    // (report a4444746). The leaderboard keeps 32 on both sides there. Where
    // the column is narrower still (a 1024 window gives the card 425), the
    // pill drops under the points rather than leave the card.
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col gap-3 md:gap-4 rounded-[20px] md:rounded-[18px] lg:rounded-3xl ring-1 ring-inset ring-green-coal-100 bg-green-coal-200 shadow-[0_10px_80px_rgba(0,0,0,0.3)] py-2 pl-3 pr-4 md:p-4 lg:py-8 lg:pl-4 lg:pr-8",
          className,
        )}
        {...props}
      >
        {/* Badge Info Row */}
        <div data-testid="badge-card-row" className="flex flex-row items-center gap-3 md:gap-4 lg:gap-2">
          {/* Badge Icon */}
          <div className="flex-shrink-0">
            <img
              src={badgeIcon}
              alt={badgeName}
              className="w-12 h-12 md:w-[80px] md:h-[80px] lg:w-[150px] lg:h-[150px] object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = assets.badges.earlyAdopter; }}
            />
          </div>

          <div className="flex md:flex-col justify-between lg:gap-4 gap-2 w-full min-w-0">
            {/* Text */}
            <div className="flex flex-col flex-1 justify-center min-w-0">
              <h3 className="font-manrope text-white text-sub-1-mobile md:text-sub-1-tablet lg:text-sub-1 mb-1">
                {badgeName}
              </h3>
              {/* Subtitle line — Figma 2481:12507 (1440) / 2481:17253 (375)
                  put a 16px icons/action "?" 4px after the subtitle text, and
                  the "- Tooltip" frames (2481:11481, 2481:14785, 2481:15918)
                  are the state where pressing it opens the coachmark. */}
              <div className="flex flex-row items-center gap-1">
                <p className="font-manrope text-skai-gray-100 text-para-2-mobile md:text-para-2-tablet lg:text-para-2">
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
                      /* The tool-tip component's three positions, one per
                         width, all 250 wide with an r8 bubble:
                         375 (2481:15918, Top): connector on top, the bubble
                           under it at 12 padding and 12/14 type.
                         768 (2481:14785, Bottom): the bubble ABOVE the icon at
                           16 padding and 12/16 type, the connector under it
                           pointing down. The arrow sits 16 in from the right
                           end, centred on the icon (bubble right edge = icon
                           centre + 34), and the whole 200 ends 2 above it.
                         1440 (2481:11481, Left): a 16 connector column then a
                           234 bubble, 4 right of the icon and centred on it,
                           at 16 padding and 14/18 type. */
                      <div
                        data-probe="badge-coachmark"
                        role="tooltip"
                        /* At 375 the bubble is CENTRED on the icon rather than
                           placed as drawn (the board sits the icon ~60% across
                           its 250): right-anchoring it ran the left edge 33px
                           off a 375 viewport once the badge card was narrow
                           enough. */
                        className="absolute left-1/2 top-[calc(100%+4px)] z-30 flex w-[250px] max-w-[calc(100vw-32px)] -translate-x-1/2 flex-col items-center md:left-auto md:top-auto md:-right-[26px] md:bottom-[calc(100%+2px)] md:translate-x-0 md:flex-col-reverse md:items-end lg:right-auto lg:bottom-auto lg:left-[calc(100%+4px)] lg:top-1/2 lg:-translate-y-1/2 lg:flex-row lg:items-center"
                      >
                        <span
                          data-probe="badge-coachmark-connector"
                          className="flex h-4 w-[35.01px] shrink-0 items-center justify-center md:mr-4 lg:mr-0 lg:h-[35.01px] lg:w-4"
                        >
                          <CoachArrowIcon className="h-4 w-[35.01px] shrink-0 rotate-180 md:rotate-0 lg:rotate-90" />
                        </span>
                        <div
                          data-probe="badge-coachmark-bubble"
                          className="w-full rounded-lg bg-green-coal-100 p-3 md:p-4 lg:w-[234px]"
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
                          <p className="font-manrope mt-2 text-left text-skai-gray-100 text-para-2-mobile md:text-para-2-tablet lg:text-para-2">
                            {helpBody}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Reward and Status, in Alien Green 300. The boards set the points
                in Numbers 3 (Mulish 14/16, 16/20, 22/26) and the pill's word in
                Label 2 (Mulish 10/14, 10/14, 11/14) on a 2 / 8 pad, 2 / 12 at
                1440, which is what puts the pair in 237 of the 1440 column's 242
                (2422:3975, 2422:3976). At 375 the two stack 4 apart against the
                card's right edge; from 768 they sit in a row 10 apart. */}
            <div data-testid="badge-card-reward" className="flex flex-col md:flex-row md:flex-wrap items-end md:items-center gap-1 md:gap-2.5 flex-shrink-0">
              <span className="font-numbers text-alien-green-bright text-number-3-mobile md:text-number-3-tablet lg:text-number-3 whitespace-nowrap">
                +{badgePoints} SKAI Points
              </span>
              <span className="font-numbers text-label-2-mobile md:text-label-2-tablet lg:text-label-2 px-2 lg:px-3 py-0.5 rounded-lg bg-alien-green-bright text-green-coal-300 whitespace-nowrap">
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Mini Leaderboard */}
        {topUsers && topUsers.length > 0 && (
          <div data-testid="badge-card-leaderboard" className="flex flex-col gap-[6px] mt-1 pt-3 border-t border-[#1a3a37] lg:ml-4">
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
