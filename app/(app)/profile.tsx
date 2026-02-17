import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DS, colors, spacing } from '@/src/design-system';
import { useAuth } from '@/src/features/auth/useAuth';
import { useEntries } from '@/src/features/entries/useEntries';
import { useAppMenu } from '@/src/features/navigation/useAppMenu';
import { deleteMyAccount, deleteMyData } from '@/src/features/profile/profile.api';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { entries, loading, error, refresh } = useEntries();
  const totalCount = entries.length;
  const { openMenu } = useAppMenu({ totalCount, currentScreen: 'profile' });

  const [deletingData, setDeletingData] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleConfirmDeleteData = () => {
    Alert.alert(
      'Delete all data?',
      'This will permanently remove all your notes. Your account will stay active.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete data',
          style: 'destructive',
          onPress: async () => {
            setDeletingData(true);

            try {
              await deleteMyData();
              await refresh();
              Alert.alert('Data deleted', 'All your notes were deleted.');
            } catch (deleteError) {
              const message =
                deleteError instanceof Error ? deleteError.message : 'Could not delete your data.';
              Alert.alert('Delete failed', message);
            } finally {
              setDeletingData(false);
            }
          },
        },
      ],
    );
  };

  const handleConfirmDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            setDeletingAccount(true);

            try {
              await deleteMyAccount();
              await signOut();
              router.replace('/(auth)/login');
            } catch (deleteError) {
              const message =
                deleteError instanceof Error ? deleteError.message : 'Could not delete your account.';
              Alert.alert('Delete failed', message);
            } finally {
              setDeletingAccount(false);
            }
          },
        },
      ],
    );
  };

  const actionsDisabled = deletingData || deletingAccount;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <DS.Button label="Back" onPress={() => router.back()} style={styles.backButton} variant="ghost" />
          <DS.Text variant="title" style={styles.headerTitle}>
            Profile
          </DS.Text>
          <DS.Button label="⋯" onPress={openMenu} style={styles.kebabButton} variant="ghost" />
        </View>

        {error ? <DS.Text>{error}</DS.Text> : null}
        {loading ? <DS.Text>Loading profile...</DS.Text> : null}

        <DS.Card style={styles.card}>
          <DS.Text variant="body">Delete data</DS.Text>
          <DS.Text variant="caption" style={styles.warningText}>
            Removes all notes from your account and keeps your login.
          </DS.Text>
          <DS.Button
            disabled={actionsDisabled}
            label={deletingData ? 'Deleting data...' : 'Delete data'}
            onPress={handleConfirmDeleteData}
            variant="ghost"
          />
        </DS.Card>

        <DS.Card style={styles.card}>
          <DS.Text variant="body">Delete account</DS.Text>
          <DS.Text variant="caption" style={styles.warningText}>
            Removes your account and all data permanently.
          </DS.Text>
          <DS.Button
            disabled={actionsDisabled}
            label={deletingAccount ? 'Deleting account...' : 'Delete account'}
            onPress={handleConfirmDeleteAccount}
            variant="ghost"
          />
        </DS.Card>
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
    gap: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    minHeight: spacing.touchTargetMin,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  kebabButton: {
    minHeight: spacing.touchTargetMin,
    minWidth: spacing.touchTargetMin,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  card: {
    gap: spacing.xs,
  },
  warningText: {
    color: colors.textSecondary,
  },
});
