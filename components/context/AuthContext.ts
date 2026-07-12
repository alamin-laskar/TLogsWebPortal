'use client';
import { createContext, useState, useEffect, useContext, type ReactNode, createElement } from 'react';
import type { User } from '@supabase/supabase-js';
import client from '@/utils/client';

type AdminProfile = {
  name?: string | null;
  role?: string | null;
  email?: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: AdminProfile | null;
  isLoading: boolean;
};

// The context type remains AuthContextValue | undefined to force null-checking
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async (email?: string | null) => {
      if (!email) {
        return null;
      }

      try {
        const { data, error } = await client
          .from('admin_Profile')
          .select('name, role, email')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          if (error.code !== 'PGRST116' && error.code !== 'PGRST205') {
            console.warn('Unable to load profile from admin_Profile:', error.message);
          }
          return null;
        }

        if (!data) {
          return null;
        }

        return {
          name: data.name ?? null,
          role: data.role ?? null,
          email: data.email ?? null,
        } as AdminProfile;
      } catch (error) {
        console.warn('Unable to query admin_Profile:', error);
        return null;
      }
    };

    const syncSession = async () => {
      const { data: { session }, error } = await client.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }

      const currentUser = session?.user ?? null;
      if (!isMounted) return;

      setUser(currentUser);

      if (currentUser) {
        const fetchedProfile = await loadProfile(currentUser.email);
        if (isMounted) {
          setProfile(fetchedProfile);
        }
      } else {
        if (isMounted) {
          setProfile(null);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    syncSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const fetchedProfile = await loadProfile(currentUser.email);
        if (isMounted) {
          setProfile(fetchedProfile);
        }
      } else {
        if (isMounted) {
          setProfile(null);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return createElement(AuthContext.Provider, { value: { user, profile, isLoading } }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

export { AuthProvider, AuthContext };