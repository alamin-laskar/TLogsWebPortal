'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import client from '@/utils/client';
import { useAuth } from '@/components/context/AuthContext';
import {
  Users,
  CreditCard,
  BarChart3,
  Bell,
  UserCircle2,
  LogOut
} from 'lucide-react';

const navItems = [
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'All Users', href: '/dashboard/TLogsUsers', icon: Users },
  { name: 'Subs & Plans', href: '/dashboard/subscriptions', icon: CreditCard },
  { name: 'Push Notifications', href: '/dashboard/notifications', icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Error: No Name';
  const roleLabel = profile?.role || 'Error: No Role';
  const emailLabel = profile?.email || user?.email || 'No email available';
  // Inside components/Sidebar.tsx

  const handleLogout = async () => {
    try {
      // 1. Call your custom backend logout route to clear HTTP-only cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // 2. Clear the Supabase client session (if you are still using the client SDK)
      await client.auth.signOut();

    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // 3. Force a router refresh to clear Server Component cache, then redirect
      router.refresh();
      router.push('/');
    }
  };

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-gray-200">

      {/* 1. Admin Profile Info on Top */}
      <div className="flex items-center p-6 border-b border-gray-100">
        <UserCircle2 className="w-10 h-10 text-gray-400" />
        <div className="ml-3 min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {isLoading ? 'Loading...' : displayName}
          </p>
          <p className="text-sm text-gray-500">{roleLabel}</p>
          <p className="truncate text-xs text-gray-400">{emailLabel}</p>
        </div>
      </div>

      {/* 2. Navigation Buttons */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <Icon
                className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-blue-700' : 'text-gray-400'
                  }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Logout Section at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          Log Out
        </button>
      </div>

    </aside>
  );
}