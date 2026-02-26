'use client';

import React from 'react';
import Link from 'next/link';
import { PenLine } from 'lucide-react';
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
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-secondary">
          {greeting}, {name}
        </h1>
        <p className="text-sm text-text/70 mt-0.5">
          Here&apos;s an overview of your blog content.
        </p>
      </div>

      <Link
        href="/admin/posts/new"
        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex-shrink-0"
      >
        <PenLine className="w-4 h-4" />
        New Post
      </Link>
    </div>
  );
}
