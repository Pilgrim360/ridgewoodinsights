/**
 * PostRow Component
 * Single row in the posts table with edit/delete actions
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PostData, CategoryData } from '@/types/admin';
import { formatDate } from '@/lib/admin/dates';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

export interface PostRowProps {
  post: PostData;
  categories: CategoryData[];
  onDelete: (postId: string) => Promise<void>;
  isDeleting?: boolean;
}

const STATUS_BADGE_STYLES = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
};

export function PostRow({
  post,
  categories,
  onDelete,
  isDeleting = false,
}: PostRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const categoryName = categories.find((c) => c.id === post.category_id)?.name || 'Uncategorized';

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
      <tr className="border-b border-surface hover:bg-background/50 transition-colors">
        {/* Title */}
        <td className="px-4 py-3 text-sm">
          <Link
            href={`/admin/posts/${post.id}`}
            className="font-medium text-secondary hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </td>

        {/* Status Badge */}
        <td className="px-4 py-3 text-sm">
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-medium',
              STATUS_BADGE_STYLES[post.status]
            )}
          >
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
        </td>

        {/* Category */}
        <td className="px-4 py-3 text-sm text-text">{categoryName}</td>

        {/* Date */}
        <td className="px-4 py-3 text-sm text-text">
          {post.published_at ? formatDate(post.published_at) : formatDate(post.updated_at || post.created_at || '')}
        </td>

        {/* Actions Menu */}
        <td className="px-4 py-3 text-right relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'inline-flex items-center justify-center p-1 rounded-md',
              'text-text hover:bg-surface transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={isDeleting || isDeleteLoading}
            aria-label="Post actions menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
                role="presentation"
              />

              {/* Menu items */}
              <div
                className={cn(
                  'absolute right-0 mt-1 w-40 rounded-lg',
                  'bg-white border border-surface shadow-lg',
                  'z-20 py-1'
                )}
                role="menu"
              >
                <Link
                  href={`/admin/posts/${post.id}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm',
                    'text-secondary hover:bg-background',
                    'transition-colors'
                  )}
                  role="menuitem"
                >
                  <Edit2 size={16} />
                  Edit
                </Link>

                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting || isDeleteLoading}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2 text-sm',
                    'text-red-600 hover:bg-red-50',
                    'transition-colors text-left',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  role="menuitem"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </>
          )}
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <tr>
          <td colSpan={5}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                <h3 className="text-lg font-bold text-secondary mb-2">Delete Post?</h3>
                <p className="text-text text-sm mb-4">
                  Are you sure you want to delete &ldquo;<strong>{post.title}</strong>&rdquo;? This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleteLoading}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      'border border-surface text-secondary',
                      'hover:bg-background transition-colors',
                      'disabled:opacity-50'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleteLoading}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      'bg-red-600 text-white',
                      'hover:bg-red-700 transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    {isDeleteLoading ? 'Deleting...' : 'Delete'}
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
