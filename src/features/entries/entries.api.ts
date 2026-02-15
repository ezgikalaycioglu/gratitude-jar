import { supabase } from '@/src/lib/supabase';

export type Entry = {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
};

async function requireUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('You must be logged in to manage entries.');
  }

  return user.id;
}

export async function listEntries(): Promise<Entry[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('entries')
    .select('id, user_id, text, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Entry[];
}

export async function createEntry(text: string): Promise<Entry> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('entries')
    .insert({ user_id: userId, text })
    .select('id, user_id, text, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Entry;
}

export async function getEntryById(id: string): Promise<Entry> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('entries')
    .select('id, user_id, text, created_at')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Note not found.');
  }

  return data as Entry;
}

export async function updateEntry(id: string, text: string): Promise<Entry> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('entries')
    .update({ text })
    .eq('id', id)
    .eq('user_id', userId)
    .select('id, user_id, text, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Entry;
}

export async function deleteEntry(id: string): Promise<void> {
  const userId = await requireUserId();

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
}
