'use client';
import { createContext, useState, useEffect, useContext, type ReactNode, createElement } from 'react';

type AdminProfile = {
  id?: string | null;
  name?: string | null;
  role?: string | null;
  email?: string | null;
};
  
type AuthUser = {
  id?: string | null;
  name?: string | null;
  role?: string | null;
  email?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  profile: AdminProfile | null;
  isLoading: boolean;
};

// The context type remains AuthContextValue | undefined to force null-checking
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      try {
        const response = await fetch('/api/auth/profile', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const payload = await response.json();

        if (!isMounted) return;

        setUser(payload.user ?? null);
        setProfile(payload.profile ?? null);
      } catch {
        if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    syncSession();

    return () => {
      isMounted = false;
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