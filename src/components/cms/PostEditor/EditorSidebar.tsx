'use client';

import { useMemo, useState } from 'react';
import { Image as ImageIcon, X, Clock, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { MediaModal } from '../Media/MediaModal';
import { EditorState } from '@/hooks/usePostEditor';
import { useCategories } from '@/hooks/queries/useCategoriesQueries';
import { cn } from '@/lib/utils';

interface EditorSidebarProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(
    field: K,
    value: EditorState[K] | null
  ) => void;
  disabled?: boolean;
}

function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function countWords(content: string): number {
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

const fieldClass = cn(
  'w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white text-text',
  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
  'disabled:bg-background disabled:text-text/50',
  'transition-colors'
);

export function EditorSidebar({ state, updateField, disabled }: EditorSidebarProps) {
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data ?? [];
  const loadingCategories = categoriesQuery.isLoading || categoriesQuery.isFetching;

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const wordCount = useMemo(() => countWords(state.content), [state.content]);
  const readingTime = useMemo(() => estimateReadingTime(state.content), [state.content]);

  return (
    <div className="space-y-5">
      {/* Writing Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-background p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-text/50 mb-1">
            <BookOpen className="w-3 h-3" />
            <span className="text-xs">Words</span>
          </div>
          <span className="text-lg font-bold text-secondary">{wordCount.toLocaleString()}</span>
        </div>
        <div className="rounded-lg bg-background p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-text/50 mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-xs">Read time</span>
          </div>
          <span className="text-lg font-bold text-secondary">{readingTime} min</span>
        </div>
      </div>

      <div className="border-t border-surface" />

      {/* Status */}
      <div>
        <label className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5">
          Status
        </label>
        <select
          value={state.status}
          onChange={(e) =>
            updateField('status', e.target.value as 'draft' | 'published' | 'scheduled')
          }
          disabled={disabled}
          className={fieldClass}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Scheduled Date */}
      {state.status === 'scheduled' && (
        <div>
          <label
            htmlFor="scheduled-date"
            className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5"
          >
            Schedule Date
          </label>
          <input
            id="scheduled-date"
            type="datetime-local"
            value={state.published_at ?? ''}
            onChange={(e) => updateField('published_at', e.target.value)}
            disabled={disabled}
            className={fieldClass}
          />
          <p className="text-xs text-text/50 mt-1">When this post should be published</p>
        </div>
      )}

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5"
        >
          URL Slug
        </label>
        <input
          id="slug"
          type="text"
          value={state.slug}
          onChange={(e) => updateField('slug', e.target.value)}
          disabled={disabled}
          placeholder="post-url-slug"
          className={fieldClass}
        />
        <p className="text-xs text-text/50 mt-1">Used in the post URL</p>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5"
        >
          Category
        </label>
        <select
          id="category"
          value={state.category_id ?? ''}
          onChange={(e) => updateField('category_id', e.target.value || null)}
          disabled={disabled || loadingCategories}
          className={fieldClass}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Excerpt */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5"
        >
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={state.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          disabled={disabled}
          placeholder="Brief summary for preview lists…"
          rows={3}
          className={cn(fieldClass, 'resize-none')}
        />
        <p className={cn('text-xs mt-1', state.excerpt.length > 200 ? 'text-red-500' : 'text-text/50')}>
          {state.excerpt.length}/200 characters
        </p>
      </div>

      {/* Disclaimer */}
      <div>
        <label
          className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5"
        >
          Disclaimer
        </label>
        <select
          value={state.disclaimer_type ?? 'none'}
          onChange={(e) =>
            updateField('disclaimer_type', e.target.value as 'none' | 'general' | 'legal')
          }
          disabled={disabled}
          className={fieldClass}
        >
          <option value="none">None</option>
          <option value="general">General Disclaimer</option>
          <option value="legal">Legal Disclaimer</option>
        </select>
        <p className="text-xs text-text/50 mt-1">Appends legal text to post footer</p>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-xs font-semibold text-secondary uppercase tracking-wide mb-1.5">
          Featured Image
        </label>
        {state.cover_image ? (
          <div className="relative mb-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.cover_image}
              alt="Featured image preview"
              className="w-full h-28 object-cover rounded-lg border border-surface"
            />
            <button
              type="button"
              onClick={() => updateField('cover_image', null)}
              disabled={disabled}
              className={cn(
                'absolute top-2 right-2 w-6 h-6 rounded-full',
                'bg-black/60 hover:bg-black/80 text-white',
                'flex items-center justify-center',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'disabled:opacity-50'
              )}
              title="Remove image"
              aria-label="Remove featured image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          fullWidth
          disabled={disabled}
          onClick={() => setIsMediaModalOpen(true)}
          icon={<ImageIcon className="h-4 w-4" />}
        >
          {state.cover_image ? 'Change Image' : 'Select Image'}
        </Button>

        <MediaModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onInsert={(config) => updateField('cover_image', config.url)}
          title="Select Featured Image"
        />
      </div>
    </div>
  );
}
