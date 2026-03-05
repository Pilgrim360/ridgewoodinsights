'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Tag,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarState } from '@/types/admin';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminSidebarProps {
  state: SidebarState;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ state }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoading: isAuthLoading } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-surface">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded font-bold text-sm transition-transform group-hover:scale-105">
            R
          </div>
          <span className="text-sm font-bold tracking-tight text-secondary">
            Ridgewood Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-surface text-primary'
                  : 'text-text/70 hover:bg-surface/50 hover:text-secondary'
              )}
            >
              <item.icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-text/50')} />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User / Footer */}
      <div className="p-4 border-t border-surface">
        <div className="px-2 mb-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-text/40 mb-1">Account</p>
          <p className="text-xs font-medium text-secondary truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isAuthLoading}
          className="flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium text-text/70 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-surface h-screen sticky top-0 shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {state.isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={state.closeMobileMenu}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
