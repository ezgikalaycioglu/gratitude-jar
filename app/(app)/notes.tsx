import { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DS, colors, spacing } from '@/src/design-system';
import { Entry } from '@/src/features/entries/entries.api';
import { groupEntriesByRecency, NoteGroup, NoteGroupKey } from '@/src/features/entries/groupEntries';
import { JarIllustration } from '@/src/features/entries/JarIllustration';
import { NoteCardIcon } from '@/src/features/entries/NoteCardIcon';
import { useEntries } from '@/src/features/entries/useEntries';
import { formatEntryListTimestamp } from '@/src/lib/date';

const initialExpandedState: Record<NoteGroupKey, boolean> = {
  thisWeek: true,
  thisMonth: false,
  older: false,
};

export default function NotesScreen() {
  const router = useRouter();
  const { entries, loading, error } = useEntries();
  const totalCount = entries.length;
  const [expandedSections, setExpandedSections] =
    useState<Record<NoteGroupKey, boolean>>(initialExpandedState);
  const groupedEntries = useMemo(() => groupEntriesByRecency(entries), [entries]);
  const sectionData = totalCount === 0 ? [] : groupedEntries;

  const toggleSection = (key: NoteGroupKey) => {
    setExpandedSections((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const renderNoteCard = (item: Entry, index: number) => (
    <DS.Card
      onPress={() =>
        router.push({ pathname: '/(app)/note/[id]', params: { id: item.id } })
      }
      style={styles.entryCard}
    >
      <View style={styles.noteRow}>
        <NoteCardIcon index={index} />
        <View style={styles.noteContent}>
          <DS.Text ellipsizeMode="tail" numberOfLines={3} style={styles.noteText}>
            {item.text}
          </DS.Text>
          <View style={styles.cardMetaRow}>
            <DS.Text variant="caption" style={styles.timestamp}>
              {formatEntryListTimestamp(item.created_at)}
            </DS.Text>
            <DS.Text variant="caption" style={styles.chevron}>
              ›
            </DS.Text>
          </View>
        </View>
      </View>
    </DS.Card>
  );

  const renderSection = ({ item }: { item: NoteGroup }) => {
    const isExpanded = expandedSections[item.key];

    return (
      <View style={styles.section}>
        <DS.Card onPress={() => toggleSection(item.key)} style={styles.sectionHeaderCard}>
          <View style={styles.sectionHeaderRow}>
            <DS.Text variant="body">{item.title}</DS.Text>
            <View style={styles.sectionHeaderMeta}>
              <DS.Text variant="caption" style={styles.sectionCount}>
                {item.entries.length} {item.entries.length === 1 ? 'note' : 'notes'}
              </DS.Text>
              <DS.Text variant="body" style={styles.sectionChevron}>
                {isExpanded ? '⌄' : '›'}
              </DS.Text>
            </View>
          </View>
        </DS.Card>

        {isExpanded ? (
          <View style={styles.sectionContent}>
            {item.entries.length === 0 ? (
              <DS.Text variant="caption" style={styles.emptySectionText}>
                No notes in this period.
              </DS.Text>
            ) : (
              item.entries.map((entry, index) => (
                <View key={entry.id}>{renderNoteCard(entry, index)}</View>
              ))
            )}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <DS.Text variant="title">All notes</DS.Text>
          <DS.Button label="Back" onPress={() => router.back()} style={styles.backButton} variant="ghost" />
        </View>

        {error ? <DS.Text>{error}</DS.Text> : null}

        {loading ? (
          <DS.Text>Loading notes...</DS.Text>
        ) : (
          <FlatList
            ListHeaderComponent={
              <View style={styles.summaryHeader}>
                <JarIllustration noteCount={totalCount} size={spacing.xxl + spacing.lg} />
                <View style={styles.summaryCopy}>
                  <DS.Text variant="title">All notes</DS.Text>
                  <DS.Text>{totalCount} total notes</DS.Text>
                </View>
              </View>
            }
            contentContainerStyle={styles.listContent}
            data={sectionData}
            keyExtractor={(item) => item.key}
            ListEmptyComponent={<DS.Text>Your jar is empty. Add your first note.</DS.Text>}
            renderItem={renderSection}
            style={styles.list}
          />
        )}
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
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  summaryCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  section: {
    gap: spacing.xs,
  },
  sectionHeaderCard: {
    borderColor: colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionCount: {
    color: colors.textSecondary,
  },
  sectionChevron: {
    color: colors.placeholder,
  },
  sectionContent: {
    gap: spacing.xs,
  },
  emptySectionText: {
    color: colors.textSecondary,
  },
  entryCard: {
    gap: spacing.xs,
    borderColor: colors.primary,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  noteContent: {
    flex: 1,
    gap: spacing.xs,
  },
  noteText: {
    flex: 1,
  },
  timestamp: {
    color: colors.textSecondary,
  },
  chevron: {
    color: colors.placeholder,
  },
});
