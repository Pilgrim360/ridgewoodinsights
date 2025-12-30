'use client';

import { useEffect, useState } from 'react';
import { CategoryData } from '@/types/admin';
import { titleToSlug, isValidSlug } from '@/lib/admin/slugify';

interface CategoryModalProps {
  isOpen: boolean;
  category: CategoryData | null;
  existingSlugs: string[];
  isSaving?: boolean;
  onSave: (category: Omit<CategoryData, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function CategoryModal({
  isOpen,
  category,
  existingSlugs,
  isSaving = false,
  onSave,
  onCancel,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Exclude current category's slug from duplicates check
  const slugsToCheck = category?.id
    ? existingSlugs.filter((s) => s !== category.slug)
    : existingSlugs;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setSlug(category.slug);
      } else {
        setName('');
        setSlug('');
      }
      setErrors({});
    }
  }, [category, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    // Auto-generate slug if user hasn't modified it yet
    const currentSlugIsAuto = slug === titleToSlug(name);
    if (!slug || currentSlugIsAuto) {
      setSlug(titleToSlug(newName));
    }

    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value.toLowerCase();
    setSlug(newSlug);

    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    }

    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!isValidSlug(slug)) {
      newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
    } else if (slugsToCheck.includes(slug)) {
      newErrors.slug = 'This slug already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        name: name.trim(),
        slug: slug.trim(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-secondary">
          {category ? 'Edit Category' : 'New Category'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
              Category Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={isSaving}
              placeholder="e.g., Tax Planning"
              maxLength={50}
              className="w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1" role="alert">
                {errors.name}
              </p>
            )}
            <p className="text-xs text-text/60 mt-1">{name.length}/50 characters</p>
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-secondary mb-2">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={handleSlugChange}
              disabled={isSaving}
              placeholder="e.g., tax-planning"
              className="w-full px-3 py-2 border border-surface rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1" role="alert">
                {errors.slug}
              </p>
            )}
            <p className="text-xs text-text/60 mt-1">
              Used in the category URL. Auto-generated from name.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border border-surface text-secondary hover:bg-surface transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
