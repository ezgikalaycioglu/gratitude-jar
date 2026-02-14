import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/src/features/auth/useAuth';
import { DS, colors, spacing } from '@/src/design-system';

function RootNavigator() {
  const { loading, session } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (session && !inAppGroup) {
      router.replace('/(app)/home');
    }
  }, [loading, router, segments, session]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <DS.Card style={styles.loadingCard}>
            <DS.Text variant="body">Loading...</DS.Text>
          </DS.Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  loadingCard: {
    alignItems: 'center',
    padding: spacing.sm,
  },
});
