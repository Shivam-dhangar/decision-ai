/**
 * Format a number as Indian Rupee (INR / ₹)
 * e.g., 149000 -> "₹1,49,000"
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 * e.g., 0.274 -> "27.4%" or "27%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format date to human-readable string
 * e.g., "27 Aug 2026"
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format relative date (e.g., "Just now", "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return 'Recently';
  }
}

/**
 * Score badge label and color styling helper
 */
export function getScoreFitBadge(score: number): {
  label: string;
  variant: 'emerald' | 'indigo' | 'amber' | 'rose';
} {
  if (score >= 85) {
    return { label: 'Strong Fit', variant: 'emerald' };
  } else if (score >= 75) {
    return { label: 'Moderate Fit', variant: 'indigo' };
  } else if (score >= 60) {
    return { label: 'Viable Option', variant: 'amber' };
  } else {
    return { label: 'Consider with Caution', variant: 'rose' };
  }
}

/**
 * Source badge styling and human readable labels
 */
export function getSourceBadgeInfo(source: string): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  switch (source) {
    case 'AI_SUGGESTED':
      return {
        label: 'AI Suggested',
        bgClass: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/60',
        textClass: 'text-indigo-700 dark:text-indigo-300',
      };
    case 'USER_PROVIDED':
      return {
        label: 'User Provided',
        bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        textClass: 'text-slate-700 dark:text-slate-300',
      };
    case 'USER_EDITED':
      return {
        label: 'User Edited',
        bgClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60',
        textClass: 'text-amber-700 dark:text-amber-300',
      };
    case 'USER_ASSUMPTION':
      return {
        label: 'User Assumption',
        bgClass: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60',
        textClass: 'text-purple-700 dark:text-purple-300',
      };
    case 'CALCULATED':
      return {
        label: 'Calculated',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
        textClass: 'text-emerald-700 dark:text-emerald-300',
      };
    default:
      return {
        label: source,
        bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        textClass: 'text-slate-600 dark:text-slate-400',
      };
  }
}
