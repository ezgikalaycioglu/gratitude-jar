import { Entry } from '@/src/features/entries/entries.api';

export type NoteGroupKey = 'thisWeek' | 'thisMonth' | 'older';

export type NoteGroup = {
  key: NoteGroupKey;
  title: string;
  entries: Entry[];
};

const groupOrder: NoteGroupKey[] = ['thisWeek', 'thisMonth', 'older'];

function startOfWeekMonday(reference: Date): Date {
  const start = new Date(reference);
  const day = start.getDay();
  const distanceFromMonday = (day + 6) % 7;
  start.setDate(start.getDate() - distanceFromMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function startOfMonth(reference: Date): Date {
  const start = new Date(reference);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function toDate(value: string): Date {
  return new Date(value);
}

export function groupEntriesByRecency(entries: Entry[], now: Date = new Date()): NoteGroup[] {
  const weekStart = startOfWeekMonday(now);
  const monthStart = startOfMonth(now);

  const grouped = {
    thisWeek: [] as Entry[],
    thisMonth: [] as Entry[],
    older: [] as Entry[],
  };

  entries.forEach((entry) => {
    const createdAt = toDate(entry.created_at);

    if (createdAt >= weekStart) {
      grouped.thisWeek.push(entry);
      return;
    }

    if (createdAt >= monthStart) {
      grouped.thisMonth.push(entry);
      return;
    }

    grouped.older.push(entry);
  });

  const titles: Record<NoteGroupKey, string> = {
    thisWeek: 'This week',
    thisMonth: 'This month',
    older: 'Older',
  };

  return groupOrder.map((key) => ({
    key,
    title: titles[key],
    entries: grouped[key],
  }));
}
