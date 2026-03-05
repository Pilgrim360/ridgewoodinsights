'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFirstName(email: string): string {
  const localPart = email.split('@')[0];
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

export function WelcomeSection() {
  const { user } = useAdminAuth();

  const greeting = getGreeting();
  const name = user?.email ? getFirstName(user.email) : 'Admin';

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-secondary">
          {greeting}, {name}
        </h1>
        <p className="text-sm text-text/60 mt-0.5">
          Manage your blog content
        </p>
      </div>

      <Link
        href="/admin/posts/new"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        New Post
      </Link>
    </div>
  );
}
