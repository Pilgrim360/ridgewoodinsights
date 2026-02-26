'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostData, CategoryData } from '@/types/admin';
import { formatDate } from '@/lib/admin/dates';

export interface PostRowProps {
  post: PostData;
  categories: CategoryData[];
  onDelete: (postId: string) => Promise<void>;
  isDeleting?: boolean;
  isSelected?: boolean;
  onSelectChange?: (postId: string) => void;
}

const STATUS_STYLES: Record<PostData['status'], string> = {
  draft: 'bg-surface text-secondary',
  published: 'bg-green-100 text-green-700',
  scheduled: 'bg-primary/10 text-primary',
};

const STATUS_LABELS: Record<PostData['status'], string> = {
  draft: 'Draft',
  published: 'Published',
  scheduled: 'Scheduled',
};

export function PostRow({
  post,
  categories,
  onDelete,
  isDeleting = false,
  isSelected = false,
  onSelectChange,
}: PostRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const menuRef = useRef<HTMLTableCellElement>(null);

  const categoryName = categories.find((c) => c.id === post.category_id)?.name ?? 'Uncategorized';

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMenuOpen]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleteLoading(true);
      await onDelete(post.id!);
    } finally {
      setIsDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <tr
        className={cn(
          'border-b border-surface hover:bg-background/50 transition-colors',
          isSelected && 'bg-primary/5'
        )}
      >
        <td className="px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectChange?.(post.id!)}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-surface text-primary focus:ring-primary accent-primary"
          />
        </td>

        <td className="px-4 py-3 text-sm">
          <Link
            href={`/admin/posts/${post.id}`}
            className="font-medium text-secondary hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </td>

        <td className="px-4 py-3 text-sm">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              STATUS_STYLES[post.status]
            )}
          >
            {STATUS_LABELS[post.status]}
          </span>
        </td>

        <td className="px-4 py-3 text-sm text-text">{categoryName}</td>

        <td className="px-4 py-3 text-sm text-text/70">
          {post.published_at
            ? formatDate(post.published_at)
            : formatDate(post.updated_at ?? post.created_at ?? '')}
        </td>

        <td className="px-4 py-3 text-right relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'inline-flex items-center justify-center w-8 h-8 rounded-lg',
              'text-text/50 hover:bg-surface hover:text-secondary transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={isDeleting || isDeleteLoading}
            aria-label="Post actions"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div
              className={cn(
                'absolute right-0 mt-1 w-40 rounded-xl',
                'bg-white border border-surface shadow-lg',
                'z-20 py-1 overflow-hidden'
              )}
              role="menu"
            >
              <Link
                href={`/admin/posts/${post.id}`}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2.5 text-sm',
                  'text-secondary hover:bg-background transition-colors'
                )}
                role="menuitem"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting || isDeleteLoading}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left',
                  'text-red-600 hover:bg-red-50 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                role="menuitem"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>

      {showDeleteConfirm && (
        <tr>
          <td colSpan={6}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                <h3 className="text-base font-semibold text-secondary mb-2">Delete Post?</h3>
                <p className="text-text text-sm mb-6">
                  Are you sure you want to delete{' '}
                  <strong className="text-secondary">&ldquo;{post.title}&rdquo;</strong>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleteLoading}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      'border border-surface text-secondary',
                      'hover:bg-background transition-colors disabled:opacity-50'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleteLoading}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      'bg-red-600 text-white hover:bg-red-700 transition-colors',
                      'disabled:opacity-60 disabled:cursor-not-allowed',
                      'flex items-center gap-2'
                    )}
                  >
                    {isDeleteLoading && (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    )}
                    {isDeleteLoading ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
