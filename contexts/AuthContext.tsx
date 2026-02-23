import { setUserIdDirectly } from '@/lib/data-service';
import { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Sync user ID to storage whenever session changes
  // Only write to storage when we have a valid user ID.
  // Do NOT clear storage on null session (it could be the initial loading state).
  // Storage is cleared explicitly on SIGNED_OUT event below.
  useEffect(() => {
    if (session?.user?.id) {
      setUserIdDirectly(session.user.id);
    }
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Persist user ID immediately when restoring session
      if (session?.user?.id) {
        setUserIdDirectly(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        // Clear user ID from storage on explicit sign out
        setUserIdDirectly(null);
        // Clear all queries when user signs out to prevent stale data
        queryClient.removeQueries();
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>{children}</AuthContext.Provider>
  );
};
