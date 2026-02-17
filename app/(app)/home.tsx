import { useActionSheet } from '@expo/react-native-action-sheet';
import { useRouter } from 'expo-router';
import { Alert, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { DS, colors, spacing } from '@/src/design-system';
import { useAuth } from '@/src/features/auth/useAuth';
import { JarIllustration } from '@/src/features/entries/JarIllustration';
import { NoteCardIcon } from '@/src/features/entries/NoteCardIcon';
import { useEntries } from '@/src/features/entries/useEntries';
import { formatEntryListTimestamp, isToday } from '@/src/lib/date';

const seeAllActionIndex = 0;
const calendarActionIndex = 1;
const logoutActionIndex = 2;
const cancelActionIndex = 3;

export default function HomeScreen() {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const { signOut } = useAuth();
  const { entries, loading, error } = useEntries();

  const todaysEntries = entries.filter((entry) => isToday(entry.created_at));
  const todayCount = todaysEntries.length;
  const totalCount = entries.length;

  const handleMenuPress = () => {
    showActionSheetWithOptions(
      {
        options: [`See all notes · ${totalCount}`, 'Calendar view', 'Log out', 'Cancel'],
        cancelButtonIndex: cancelActionIndex,
        destructiveButtonIndex: logoutActionIndex,
      },
      async (selectedIndex) => {
        if (selectedIndex === seeAllActionIndex) {
          router.push('/(app)/notes');
          return;
        }

        if (selectedIndex === calendarActionIndex) {
          router.push('/(app)/calendar');
          return;
        }

        if (selectedIndex !== logoutActionIndex) {
          return;
        }

        const logoutError = await signOut();

        if (logoutError) {
          Alert.alert('Log out failed', logoutError);
          return;
        }

        router.replace('/(auth)/login');
      },
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <DS.Text variant="title">Your Jar 🫙</DS.Text>
          <DS.Button
            label="⋯"
            onPress={handleMenuPress}
            style={styles.kebabButton}
            variant="ghost"
          />
        </View>

        {error ? <DS.Text>{error}</DS.Text> : null}

        {loading ? (
          <DS.Text>Loading entries...</DS.Text>
        ) : (
          <FlatList
            ListHeaderComponent={
              <View style={styles.summaryHeader}>
                <JarIllustration noteCount={todayCount} size={spacing.xxl + spacing.lg} />
                <View style={styles.summaryCopy}>
                  <DS.Text variant="title">Today&apos;s jar</DS.Text>
                  <DS.Text>{todayCount} notes today</DS.Text>
                </View>
              </View>
            }
            contentContainerStyle={styles.listContent}
            data={todaysEntries}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <DS.Card style={styles.emptyTodayCard}>
                <DS.Text>No note yet for today.</DS.Text>
                <DS.Text variant="caption">Capture one thing you are grateful for.</DS.Text>
                <DS.Button
                  label="Add today’s note"
                  onPress={() => router.push('/(app)/add-entry')}
                />
              </DS.Card>
            }
            renderItem={({ item, index }) => (
              <DS.Card
                onPress={() =>
                  router.push({ pathname: '/(app)/note/[id]', params: { id: item.id } })
                }
                style={styles.todayCard}
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
            )}
            style={styles.list}
          />
        )}
      </View>

      <DS.Fab onPress={() => router.push('/(app)/add-entry')} style={styles.fab} />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kebabButton: {
    minHeight: spacing.touchTargetMin,
    minWidth: spacing.touchTargetMin,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
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
  todayCard: {
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
  emptyTodayCard: {
    gap: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.xs,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
