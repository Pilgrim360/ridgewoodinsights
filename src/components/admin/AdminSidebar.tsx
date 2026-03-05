'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Tag, Image as ImageIcon, Settings, LogOut, Plus } from 'lucide-react';
import { SidebarState } from '@/types/admin';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminSidebarProps {
  state: SidebarState;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar = React.forwardRef<HTMLDivElement, AdminSidebarProps>(({ state }, ref) => {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAdminAuth();

  useEffect(() => {
    document.body.style.overflow = state.isMobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.isMobileOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-surface px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3 hover:no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white">R</span>
          <div>
            <p className="text-sm font-semibold text-secondary">Ridgewood CMS</p>
            <p className="text-xs text-text/65">Blog control panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={state.closeMobileMenu}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors hover:no-underline',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:bg-background'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-surface p-3">
        <Link
          href="/admin/posts/new"
          onClick={state.closeMobileMenu}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark hover:no-underline"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>

        <div className="rounded-lg border border-surface bg-background px-3 py-2">
          <p className="truncate text-xs font-medium text-secondary">{user?.email ?? 'Admin'}</p>
          <button
            onClick={logout}
            disabled={isLoading}
            className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-surface bg-white text-xs font-medium text-secondary transition-colors hover:bg-surface/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside ref={ref} className="hidden h-screen w-72 shrink-0 border-r border-surface bg-white md:block">
        {sidebarContent}
      </aside>

      {state.isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            className="absolute inset-0 bg-secondary/35"
            onClick={state.closeMobileMenu}
            aria-label="Close mobile navigation"
          />
          <aside className="relative h-full w-[84%] max-w-xs border-r border-surface bg-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
});

AdminSidebar.displayName = 'AdminSidebar';
