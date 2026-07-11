'use client';
import { createContext, useState, useEffect, useContext, type ReactNode, createElement } from 'react';
import type { User } from '@supabase/supabase-js';
import client from '@/utils/client';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};

// The context type remains AuthContextValue | undefined to force null-checking
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  
  return createElement(AuthContext.Provider, { value: { user, isLoading } }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

export { AuthProvider, AuthContext };