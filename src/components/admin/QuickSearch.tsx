'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Tag, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { usePostsList } from '@/hooks/queries/usePostsQueries';
import { useCategories } from '@/hooks/queries/useCategoriesQueries';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  label: string;
  description?: string;
  href: string;
  type: 'post' | 'category' | 'action';
  icon: React.ReactNode;
}

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATIC_ACTIONS: SearchResult[] = [
  {
    id: 'new-post',
    label: 'Create New Post',
    description: 'Start writing a new blog post',
    href: '/admin/posts/new',
    type: 'action',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'all-posts',
    label: 'View All Posts',
    href: '/admin/posts',
    type: 'action',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'categories',
    label: 'Manage Categories',
    href: '/admin/categories',
    type: 'action',
    icon: <Tag className="w-4 h-4" />,
  },
];

const listboxId = 'quick-search-listbox';

export function QuickSearch({ isOpen, onClose }: QuickSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: postsData } = usePostsList({ search: query || undefined, per_page: 5 });
  const { data: categories } = useCategories();

  const results = useMemo<SearchResult[]>(() => {
    if (!query) return STATIC_ACTIONS;
    const posts = postsData?.data ?? [];
    return [
      ...posts.map((p) => ({
        id: p.id!,
        label: p.title,
        description: p.status.charAt(0).toUpperCase() + p.status.slice(1),
        href: `/admin/posts/${p.id}`,
        type: 'post' as const,
        icon: <FileText className="w-4 h-4" />,
      })),
      ...(categories ?? [])
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map((c) => ({
          id: c.id!,
          label: c.name,
          href: `/admin/categories`,
          type: 'category' as const,
          icon: <Tag className="w-4 h-4" />,
        })),
    ];
  }, [query, postsData?.data, categories]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      onClose();
      setQuery('');
    },
    [router, onClose]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, results, handleSelect, onClose]);

  if (!isOpen) return null;

  const typeLabel = { post: 'Post', category: 'Category', action: 'Action' };
  const typeBg = {
    post: 'bg-blue-50 text-blue-600',
    category: 'bg-amber-50 text-amber-600',
    action: 'bg-primary/10 text-primary',
  };

  const activeResultId = results[activeIndex] ? `result-${results[activeIndex].id}` : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-label="Quick search"
        aria-modal="true"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-surface overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface">
          <Search className="w-4 h-4 text-text/40 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={results.length > 0}
            aria-activedescendant={activeResultId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, categories…"
            className="flex-1 text-sm text-secondary placeholder:text-text/40 bg-transparent outline-none"
            aria-label="Search"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-text/40 hover:text-text/70 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-text/40 hover:text-text/70 transition-colors ml-1"
            aria-label="Close search"
          >
            <kbd className="text-xs bg-surface px-1.5 py-0.5 rounded font-mono">Esc</kbd>
          </button>
        </div>

        {/* Results */}
        <div id={listboxId} role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="py-10 text-center text-sm text-text/50">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-text/40 uppercase tracking-wider">
                {query ? 'Results' : 'Quick Actions'}
              </p>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  id={`result-${result.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    index === activeIndex ? 'bg-background' : 'hover:bg-background/50'
                  )}
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                      typeBg[result.type]
                    )}
                  >
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-secondary block truncate">
                      {result.label}
                    </span>
                    {result.description && (
                      <span className="text-xs text-text/50">{result.description}</span>
                    )}
                  </div>
                  <span className="text-xs text-text/30 flex-shrink-0">{typeLabel[result.type]}</span>
                  {index === activeIndex && (
                    <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-surface bg-background flex items-center gap-4 text-xs text-text/40">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft className="w-3 h-3" /> Select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="font-mono">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="font-mono">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
