import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

const webMemoryStorage = new Map<string, string>();

const webStorage = {
  getItem: async (key: string) => webMemoryStorage.get(key) ?? null,
  setItem: async (key: string, value: string) => {
    webMemoryStorage.set(key, value);
  },
  removeItem: async (key: string) => {
    webMemoryStorage.delete(key);
  },
};

const nativeStorage = {
  getItem: async (key: string) => {
    const storageModule = await import('@react-native-async-storage/async-storage');
    return storageModule.default.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    const storageModule = await import('@react-native-async-storage/async-storage');
    await storageModule.default.setItem(key, value);
  },
  removeItem: async (key: string) => {
    const storageModule = await import('@react-native-async-storage/async-storage');
    await storageModule.default.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? webStorage : nativeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
