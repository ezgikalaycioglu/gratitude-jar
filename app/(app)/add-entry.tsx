import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DS, colors, spacing } from '@/src/design-system';
import { createEntry } from '@/src/features/entries/entries.api';

export default function AddEntryScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      Alert.alert('Validation', 'Please write a gratitude note before saving.');
      return;
    }

    setSaving(true);

    try {
      await createEntry(trimmed);
      router.replace('/(app)/home');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Could not save your note.';
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <DS.Card style={styles.card}>
          <DS.Text variant="title">Add a gratitude note</DS.Text>
          <DS.Input
            label="Note"
            multiline
            numberOfLines={6}
            placeholder="What are you grateful for today?"
            style={styles.input}
            value={text}
            onChangeText={setText}
          />
          <DS.Button disabled={saving} label={saving ? 'Saving...' : 'Save'} onPress={handleSave} />
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
  input: {
    minHeight: spacing.xxl * 3,
    textAlignVertical: 'top',
  },
});
