import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/src/features/auth/useAuth';
import { DS, colors, spacing } from '@/src/design-system';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    setSubmitting(true);
    const error = await signUp(email.trim(), password);
    setSubmitting(false);

    if (error) {
      Alert.alert('Sign up failed', error);
      return;
    }

    Alert.alert('Account created', 'You can now log in with your credentials.');
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <DS.Card style={styles.card}>
          <DS.Text variant="title">Create account</DS.Text>
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
            placeholder="Choose a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <DS.Button
            disabled={submitting}
            label={submitting ? 'Creating account...' : 'Sign up'}
            onPress={handleSignUp}
          />
          <DS.Button label="Back to login" onPress={() => router.replace('/(auth)/login')} />
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
