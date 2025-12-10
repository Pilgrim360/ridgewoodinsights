'use client';

import { useEffect, useState } from 'react';
import { EditorState } from '@/hooks/usePostEditor';
import { ImageUpload } from './ImageUpload';
import { getCategories } from '@/lib/admin/categories';

import { CategoryData } from '@/types/admin';

interface EditorSidebarProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(
    field: K,
    value: EditorState[K] | null
  ) => void;
  disabled?: boolean;
}

export function EditorSidebar({
  state,
  updateField,
  disabled,
}: EditorSidebarProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        const cats = Array.isArray(data) ? data : [];
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-2">
          Status
        </label>
        <select
          value={state.status}
          onChange={(e) =>
            updateField('status', e.target.value as 'draft' | 'published' | 'scheduled')
          }
          disabled={disabled}
          className="w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background disabled:text-text/50"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Scheduled Date - only show if status is scheduled */}
      {state.status === 'scheduled' && (
        <div>
          <label htmlFor="scheduled-date" className="block text-sm font-medium text-secondary mb-2">
            Schedule Date
          </label>
          <input
            id="scheduled-date"
            type="datetime-local"
            value={state.published_at || ''}
            onChange={(e) => updateField('published_at', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background disabled:text-text/50"
          />
          <p className="text-xs text-text/60 mt-1">
            When this post should be published
          </p>
        </div>
      )}

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-secondary mb-2">
          Slug
        </label>
        <input
          id="slug"
          type="text"
          value={state.slug}
          onChange={(e) => updateField('slug', e.target.value)}
          disabled={disabled}
          placeholder="post-slug"
          className="w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background disabled:text-text/50"
        />
        <p className="text-xs text-text/60 mt-1">
          Used in the post URL
        </p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-secondary mb-2">
          Category
        </label>
        <select
          id="category"
          value={state.category_id || ''}
          onChange={(e) =>
            updateField('category_id', e.target.value || null)
          }
          disabled={disabled || loadingCategories}
          className="w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background disabled:text-text/50"
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
        <label htmlFor="excerpt" className="block text-sm font-medium text-secondary mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={state.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          disabled={disabled}
          placeholder="Brief summary for preview lists..."
          rows={3}
          className="w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background disabled:text-text/50 resize-none"
        />
        <p className="text-xs text-text/60 mt-1">
          {state.excerpt.length}/200 characters
        </p>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-3">
          Featured Image
        </label>
        {state.cover_image && (
          <div className="mb-3 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.cover_image}
              alt="Featured image preview"
              className="w-full h-32 object-cover rounded-lg border border-surface"
            />
            <button
              type="button"
              onClick={() => updateField('cover_image', null)}
              disabled={disabled}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}
        <ImageUpload
          onImageUpload={(url) => updateField('cover_image', url)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
