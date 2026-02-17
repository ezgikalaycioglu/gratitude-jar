import { supabase } from '@/src/lib/supabase';

export async function deleteMyData(): Promise<void> {
  const { error } = await supabase.rpc('purge_my_data');

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteMyAccount(): Promise<void> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session?.access_token) {
    throw new Error('You must be logged in to delete your account.');
  }

  const { data, error } = await supabase.functions.invoke<{ error?: string }>('delete-account', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: {},
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.error) {
    throw new Error(data.error);
  }
}
