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

function startOfMonth(reference: Date): Date {
  const start = new Date(reference);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function startOfCalendarWeek(reference: Date, startsOnMonday: boolean): Date {
  const start = new Date(reference);
  const day = start.getDay();
  const distance = startsOnMonday ? (day + 6) % 7 : day;
  start.setDate(start.getDate() - distance);
  start.setHours(0, 0, 0, 0);
  return start;
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

export function toLocalDateKey(value: string | Date): string {
  const date = toDate(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatMonthYearLabel(value: string | Date): string {
  const date = toDate(value);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function isSameMonth(left: string | Date, right: string | Date): boolean {
  const leftDate = toDate(left);
  const rightDate = toDate(right);

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth()
  );
}

export function buildCalendarMonthGrid(month: string | Date, startsOnMonday: boolean): Date[] {
  const monthStart = startOfMonth(toDate(month));
  const gridStart = startOfCalendarWeek(monthStart, startsOnMonday);
  const cells: Date[] = [];

  for (let index = 0; index < 42; index += 1) {
    const nextCell = new Date(gridStart);
    nextCell.setDate(gridStart.getDate() + index);
    cells.push(nextCell);
  }

  return cells;
}
