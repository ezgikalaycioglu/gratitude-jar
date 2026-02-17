function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function sameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function dayBounds(reference: Date): { start: Date; end: Date } {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);

  const end = new Date(reference);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function formatShortDate(value: string | Date): string {
  const date = toDate(value);
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${month} ${date.getDate()}`;
}

export function isToday(value: string | Date): boolean {
  const date = toDate(value);
  const { start, end } = dayBounds(new Date());
  return date >= start && date <= end;
}

export function isYesterday(value: string | Date): boolean {
  const date = toDate(value);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return sameDay(date, yesterday);
}

export function formatEntryDateLabel(value: string): string {
  const date = toDate(value);

  if (isToday(date)) {
    return `Today • ${formatTime(date)}`;
  }

  if (isYesterday(date)) {
    return `Yesterday • ${formatTime(date)}`;
  }

  return `${formatShortDate(date)} • ${formatTime(date)}`;
}

export function formatEntryListTimestamp(value: string | Date): string {
  const date = toDate(value);

  if (isToday(date)) {
    return formatTime(date);
  }

  return `${formatShortDate(date)}, ${formatTime(date)}`;
}
