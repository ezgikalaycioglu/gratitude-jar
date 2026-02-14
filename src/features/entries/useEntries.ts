import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { createEntry, Entry, listEntries } from '@/src/features/entries/entries.api';

type UseEntriesResult = {
  entries: Entry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  add: (text: string) => Promise<Entry>;
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
  };
}
