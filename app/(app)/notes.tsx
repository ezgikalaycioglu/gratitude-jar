import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DS, colors, spacing } from '@/src/design-system';
import { JarIllustration } from '@/src/features/entries/JarIllustration';
import { NoteCardIcon } from '@/src/features/entries/NoteCardIcon';
import { useEntries } from '@/src/features/entries/useEntries';
import { formatEntryDateLabel } from '@/src/lib/date';

export default function NotesScreen() {
  const router = useRouter();
  const { entries, loading, error } = useEntries();
  const totalCount = entries.length;

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
              <DS.Card style={styles.summaryCard}>
                <JarIllustration noteCount={totalCount} />
                <View style={styles.summaryCopy}>
                  <DS.Text variant="title">All notes</DS.Text>
                  <DS.Text>{totalCount} total notes</DS.Text>
                </View>
              </DS.Card>
            }
            contentContainerStyle={styles.listContent}
            data={entries}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<DS.Text>Your jar is empty. Add your first note.</DS.Text>}
            renderItem={({ item, index }) => (
              <DS.Card
                onPress={() =>
                  router.push({ pathname: '/(app)/note/[id]', params: { id: item.id } })
                }
                style={styles.entryCard}
              >
                <View style={styles.cardMetaRow}>
                  <DS.Text variant="caption">{formatEntryDateLabel(item.created_at)}</DS.Text>
                </View>
                <View style={styles.noteRow}>
                  <NoteCardIcon index={index} />
                  <DS.Text style={styles.noteText}>{item.text}</DS.Text>
                </View>
              </DS.Card>
            )}
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
    minHeight: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  entryCard: {
    gap: spacing.xs,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  noteText: {
    flex: 1,
  },
});
