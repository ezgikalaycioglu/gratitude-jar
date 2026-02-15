import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DS, colors, spacing } from '@/src/design-system';
import { Entry } from '@/src/features/entries/entries.api';
import { useEntries } from '@/src/features/entries/useEntries';
import { formatEntryDateLabel } from '@/src/lib/date';

export default function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { getById, update, remove } = useEntries();

  const entryId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [entry, setEntry] = useState<Entry | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadEntry = async () => {
      if (!entryId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const loaded = await getById(entryId);

        if (!active) {
          return;
        }

        setEntry(loaded);
        setText(loaded.text);
      } catch (loadError) {
        if (!active) {
          return;
        }

        const message = loadError instanceof Error ? loadError.message : 'Could not load this note.';
        Alert.alert('Load failed', message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadEntry();

    return () => {
      active = false;
    };
  }, [entryId, getById]);

  const handleSave = async () => {
    if (!entry) {
      return;
    }

    const trimmed = text.trim();

    if (trimmed.length === 0) {
      Alert.alert('Validation', 'Please write a note before saving.');
      return;
    }

    setSaving(true);

    try {
      await update(entry.id, trimmed);
      router.back();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Could not save your note.';
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!entry || deleting) {
      return;
    }

    Alert.alert('Delete note?', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);

          try {
            await remove(entry.id);
            router.back();
          } catch (deleteError) {
            const message =
              deleteError instanceof Error ? deleteError.message : 'Could not delete this note.';
            Alert.alert('Delete failed', message);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <DS.Text>Loading note...</DS.Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <DS.Card style={styles.card}>
            <DS.Text variant="title">Note not found</DS.Text>
            <DS.Button label="Back" onPress={() => router.back()} variant="ghost" />
          </DS.Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <DS.Card style={styles.card}>
          <DS.Text variant="title">Note details</DS.Text>
          <DS.Text variant="caption">{formatEntryDateLabel(entry.created_at)}</DS.Text>
          <DS.Input
            label="Note"
            multiline
            numberOfLines={8}
            style={styles.input}
            value={text}
            onChangeText={setText}
          />
          <View style={styles.actionsRow}>
            <DS.Button
              disabled={deleting || saving}
              label={saving ? 'Saving...' : 'Save'}
              onPress={handleSave}
            />
            <DS.Button
              disabled={deleting || saving}
              label={deleting ? 'Deleting...' : 'Delete'}
              onPress={handleDelete}
              variant="ghost"
            />
          </View>
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
  },
  card: {
    gap: spacing.sm,
  },
  input: {
    minHeight: spacing.xxl * 3,
    textAlignVertical: 'top',
  },
  actionsRow: {
    gap: spacing.xs,
  },
});
