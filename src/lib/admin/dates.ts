/**
 * Date Utility Functions
 * Consistent date formatting for the admin panel
 */

/**
 * Format date as "Dec 9, 2025"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date with time as "Dec 9, 2025 at 2:30 PM"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Format date as relative time
 * e.g., "2 minutes ago", "3 hours ago", "5 days ago"
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes}m ago`;
  }
  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours}h ago`;
  }
  if (secondsAgo < 604800) {
    const days = Math.floor(secondsAgo / 86400);
    return `${days}d ago`;
  }

  return formatDate(d);
}

/**
 * Format time duration in seconds as "2h 30m"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
}
