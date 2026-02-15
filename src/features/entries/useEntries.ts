import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  createEntry,
  deleteEntry,
  Entry,
  getEntryById,
  listEntries,
  updateEntry,
} from '@/src/features/entries/entries.api';

type UseEntriesResult = {
  entries: Entry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  add: (text: string) => Promise<Entry>;
  getById: (id: string) => Promise<Entry>;
  update: (id: string, text: string) => Promise<Entry>;
  remove: (id: string) => Promise<void>;
};

export function useEntries(): UseEntriesResult {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const nextEntries = await listEntries();
      setEntries(nextEntries);
      setError(null);
    } catch (refreshError) {
      const message = refreshError instanceof Error ? refreshError.message : 'Failed to load entries.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (text: string) => {
    const created = await createEntry(text);
    setEntries((current) => [created, ...current]);
    setError(null);
    return created;
  }, []);

  const getById = useCallback(async (id: string) => {
    const found = entries.find((entry) => entry.id === id);

    if (found) {
      return found;
    }

    const loaded = await getEntryById(id);
    setEntries((current) => {
      const exists = current.some((entry) => entry.id === loaded.id);
      return exists ? current : [loaded, ...current];
    });
    setError(null);
    return loaded;
  }, [entries]);

  const update = useCallback(async (id: string, text: string) => {
    const updated = await updateEntry(id, text);
    setEntries((current) =>
      current.map((entry) => (entry.id === updated.id ? updated : entry)),
    );
    setError(null);
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteEntry(id);
    setEntries((current) => current.filter((entry) => entry.id !== id));
    setError(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return {
    entries,
    loading,
    error,
    refresh,
    add,
    getById,
    update,
    remove,
  };
}
