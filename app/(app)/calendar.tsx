import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DS, colors, spacing } from '@/src/design-system';
import { useEntries } from '@/src/features/entries/useEntries';
import {
  buildCalendarMonthGrid,
  formatMonthYearLabel,
  isSameMonth,
  isToday,
  toLocalDateKey,
} from '@/src/lib/date';

const daysOfWeekMonday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function clampCountLabel(count: number): string {
  if (count > 99) {
    return '99+';
  }

  return `${count}`;
}

export default function CalendarScreen() {
  const router = useRouter();
  const { entries, loading, error } = useEntries();
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const countsByDate = useMemo(() => {
    const counts = new Map<string, number>();

    entries.forEach((entry) => {
      const key = toLocalDateKey(entry.created_at);
      const nextCount = (counts.get(key) ?? 0) + 1;
      counts.set(key, nextCount);
    });

    return counts;
  }, [entries]);

  const monthCells = useMemo(() => buildCalendarMonthGrid(visibleMonth, true), [visibleMonth]);
  const monthRows = useMemo(() => {
    const rows: Date[][] = [];

    for (let index = 0; index < monthCells.length; index += 7) {
      rows.push(monthCells.slice(index, index + 7));
    }

    return rows;
  }, [monthCells]);

  const goToPreviousMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const handleDayPress = (day: Date) => {
    const dayKey = toLocalDateKey(day);
    const count = countsByDate.get(dayKey) ?? 0;

    if (count === 0) {
      return;
    }

    router.push({ pathname: '/(app)/notes', params: { date: dayKey } });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <DS.Text variant="title">Calendar view</DS.Text>
          <DS.Button label="Back" onPress={() => router.back()} style={styles.backButton} variant="ghost" />
        </View>

        {error ? <DS.Text>{error}</DS.Text> : null}

        <DS.Card style={styles.monthCard}>
          <View style={styles.monthHeaderRow}>
            <DS.Button label="‹" onPress={goToPreviousMonth} style={styles.monthNavButton} variant="ghost" />
            <DS.Text variant="body" style={styles.monthLabel}>
              {formatMonthYearLabel(visibleMonth)}
            </DS.Text>
            <DS.Button label="›" onPress={goToNextMonth} style={styles.monthNavButton} variant="ghost" />
          </View>

          <View style={styles.weekHeaderRow}>
            {daysOfWeekMonday.map((day) => (
              <View key={day} style={styles.weekHeaderCell}>
                <DS.Text variant="caption" style={styles.weekHeaderText}>
                  {day}
                </DS.Text>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {monthRows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.gridRow}>
                {row.map((day) => {
                  const dayKey = toLocalDateKey(day);
                  const noteCount = countsByDate.get(dayKey) ?? 0;
                  const outOfMonth = !isSameMonth(day, visibleMonth);
                  const today = isToday(day);
                  const hasNotes = noteCount > 0;

                  return (
                    <DS.Card
                      key={dayKey}
                      onPress={hasNotes ? () => handleDayPress(day) : undefined}
                      style={[
                        styles.dayCell,
                        outOfMonth ? styles.dayCellMuted : null,
                        today ? styles.todayCell : null,
                        hasNotes ? styles.dayCellWithNotes : null,
                      ]}
                    >
                      <DS.Text
                        variant="caption"
                        style={[styles.dayNumber, outOfMonth ? styles.dayNumberMuted : null]}
                      >
                        {day.getDate()}
                      </DS.Text>

                      {hasNotes ? (
                        <View style={styles.countBadge}>
                          <DS.Text variant="caption" style={styles.countBadgeLabel}>
                            {clampCountLabel(noteCount)}
                          </DS.Text>
                        </View>
                      ) : null}
                    </DS.Card>
                  );
                })}
              </View>
            ))}
          </View>
        </DS.Card>

        {loading ? <DS.Text>Loading notes...</DS.Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    minHeight: spacing.touchTargetMin,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  monthCard: {
    gap: spacing.sm,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  monthNavButton: {
    minHeight: spacing.touchTargetMin,
    minWidth: spacing.touchTargetMin,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  monthLabel: {
    flex: 1,
    textAlign: 'center',
  },
  weekHeaderRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  weekHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekHeaderText: {
    color: colors.textSecondary,
  },
  grid: {
    gap: spacing.xs,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dayCell: {
    flex: 1,
    minHeight: spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderColor: colors.border,
  },
  dayCellMuted: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  dayCellWithNotes: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  todayCell: {
    borderColor: colors.textPrimary,
  },
  dayNumber: {
    color: colors.textPrimary,
  },
  dayNumberMuted: {
    color: colors.placeholder,
  },
  countBadge: {
    minWidth: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeLabel: {
    color: colors.textOnPrimary,
  },
});
