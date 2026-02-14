import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';

import { supabase } from '@/src/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          return;
        }

        if (isMounted) {
          setSession(data.session ?? null);
          setLoading(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      loading,
      signInWithPassword: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error?.message ?? null;
      },
      signUp: async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        return error?.message ?? null;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return error?.message ?? null;
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
