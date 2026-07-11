import { ReactNode } from 'react';
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Left Side: Persistent Navigation */}
      <Sidebar />

      {/* Right Side: Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Adds internal scrolling to the page content so the sidebar stays fixed */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}