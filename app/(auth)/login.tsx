import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/src/features/auth/useAuth';
import { DS, colors, spacing } from '@/src/design-system';

export default function LoginScreen() {
  const { signInWithPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    const error = await signInWithPassword(email.trim(), password);
    setSubmitting(false);

    if (error) {
      Alert.alert('Login failed', error);
      return;
    }

    router.replace('/(app)/home');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <DS.Card style={styles.card}>
          <DS.Text variant="title">Welcome back</DS.Text>
          <DS.Input
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
          />
          <DS.Input
            label="Password"
            placeholder="Your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <DS.Button
            disabled={submitting}
            label={submitting ? 'Signing in...' : 'Log in'}
            onPress={handleLogin}
          />
          <DS.Button label="Create an account" onPress={() => router.push('/(auth)/signup')} />
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
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
});
