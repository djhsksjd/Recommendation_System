import { Timestamp } from 'firebase/firestore';

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export function timestampToDate(timestamp: Timestamp | string | undefined): Date | null {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return null;
}

/**
 * Convert JavaScript Date to Firestore Timestamp
 */
export function dateToTimestamp(date: Date | string): Timestamp {
  if (date instanceof Date) {
    return Timestamp.fromDate(date);
  }
  return Timestamp.fromDate(new Date(date));
}

/**
 * Convert Firestore Timestamp to ISO string
 */
export function timestampToISO(timestamp: Timestamp | string | undefined): string | null {
  const date = timestampToDate(timestamp);
  return date ? date.toISOString() : null;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(
  timestamp: Timestamp | string | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = timestampToDate(timestamp);
  if (!date) return 'N/A';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleString('en-US', { ...defaultOptions, ...options });
}

/**
 * Check if a value is a Firestore Timestamp
 */
export function isTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}

