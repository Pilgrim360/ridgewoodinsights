'use client';

import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { usePostStats } from '@/hooks/queries/usePostsQueries';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function WelcomeHero({ className }: { className?: string }) {
  const { user } = useAdminAuth();
  const { data: stats } = usePostStats();

  // Extract name from email or use 'Admin'
  const displayName = user?.email
    ? user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + user.email.split('@')[0].split('.')[0].slice(1)
    : 'Admin';

  const date = new Date();
  const hours = date.getHours();
  let greeting = 'Good morning';
  if (hours >= 12 && hours < 17) greeting = 'Good afternoon';
  if (hours >= 17) greeting = 'Good evening';

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-secondary p-8 md:p-10 text-white shadow-lg',
      className
    )}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-4 border border-white/10">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Welcome back to Ridgewood Insights</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            {greeting}, {displayName}!
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-lg">
            Your blog is performing well. You have <span className="text-white font-semibold">{stats?.published_count || 0} published articles</span> helping your audience grow.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
          >
            Create New Post
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold border border-white/20 transition-all hover:bg-white/20 active:scale-95"
          >
            View Live Site
          </Link>
        </div>
      </div>
    </div>
  );
}
