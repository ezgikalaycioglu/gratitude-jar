import { Alert, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/src/features/auth/useAuth';
import { DS, colors, spacing } from '@/src/design-system';
import { useEntries } from '@/src/features/entries/useEntries';

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { entries, loading, error } = useEntries();

  const handleLogout = async () => {
    const logoutError = await signOut();

    if (logoutError) {
      Alert.alert('Log out failed', logoutError);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <DS.Text variant="title">Gratitude Jar</DS.Text>
        <DS.Text>Capture one thing you are grateful for today.</DS.Text>

        <DS.Button label="Add a note" onPress={() => router.push('/(app)/add-entry')} />

        {error ? <DS.Text>{error}</DS.Text> : null}

        {loading ? (
          <DS.Text>Loading entries...</DS.Text>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={entries}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<DS.Text>Your jar is empty. Add your first note.</DS.Text>}
            renderItem={({ item }) => (
              <DS.Card style={styles.entryCard}>
                <DS.Text>{item.text}</DS.Text>
                <DS.Text variant="caption">{new Date(item.created_at).toLocaleString()}</DS.Text>
              </DS.Card>
            )}
            style={styles.list}
          />
        )}

        <DS.Button label="Log out" onPress={handleLogout} />
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
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  entryCard: {
    gap: spacing.xs,
  },
});
