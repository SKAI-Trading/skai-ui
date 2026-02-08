/**
 * Date and Time Formatting Utilities
 *
 * @module lib/format/date
 */

/**
 * Format a date/time for display
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: {
    includeTime?: boolean;
    relative?: boolean;
  } = {},
): string {
  if (!date) {
    return "";
  }

  const { includeTime = false, relative = false } = options;
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  if (relative) {
    return formatRelativeTime(dateObj);
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  return dateFormatter.format(dateObj);
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(
  date: string | Date | number | null | undefined,
  options: { includeSeconds?: boolean } = {},
): string {
  if (!date) return "";

  const { includeSeconds = false } = options;
  const dateObj =
    typeof date === "number"
      ? new Date(date)
      : typeof date === "string"
        ? new Date(date)
        : date;

  if (isNaN(dateObj.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
    hour12: true,
  });

  return formatter.format(dateObj);
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatISODate(
  date: Date | string | null | undefined,
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toISOString().split("T")[0];
}

/**
 * Format date and time together
 */
export function formatDateTime(
  date: string | Date | null | undefined,
  options: { includeSeconds?: boolean } = {},
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  const { includeSeconds = false } = options;

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
    hour12: true,
  });

  return formatter.format(dateObj);
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSeconds = Math.floor(seconds % 60);
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Format time ago in short format
 */
export function timeAgo(
  date: string | Date | null | undefined,
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800)
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  if (diffSeconds < 2592000)
    return `${Math.floor(diffSeconds / 604800)}w ago`;
  if (diffSeconds < 31536000)
    return `${Math.floor(diffSeconds / 2592000)}mo ago`;

  return `${Math.floor(diffSeconds / 31536000)}y ago`;
}

/**
 * Check if a date is today
 */
export function isToday(
  date: Date | string | null | undefined,
): boolean {
  if (!date) return false;

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return false;

  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Format date with smart defaults (today shows time, older shows date)
 */
export function formatSmartDate(
  date: string | Date | null | undefined,
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  if (isToday(dateObj)) {
    return formatTimestamp(dateObj);
  }

  return formatDateTime(dateObj);
}
