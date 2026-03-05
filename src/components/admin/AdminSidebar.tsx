'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Tag, Image, Settings, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ isMobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
  };

  const NavLink = ({ href, label, icon: Icon }: typeof navItems[0]) => {
    const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

    return (
      <Link
        href={href}
        onClick={onCloseMobile}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-white'
            : 'text-secondary hover:bg-surface'
        )}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-surface',
          'flex flex-col',
          'transform transition-transform duration-200 md:transform-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-surface">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary text-white rounded-md flex items-center justify-center font-semibold text-sm">
              R
            </div>
            <span className="font-semibold text-secondary">Ridgewood</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-surface">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-secondary hover:bg-surface transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
