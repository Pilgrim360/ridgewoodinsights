/**
 * DeleteModal Component
 * Confirmation dialog for deleting posts
 * Built on top of the generic ConfirmDialogProps pattern
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DeleteModalProps {
  isOpen: boolean;
  postTitle: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteModal({
  isOpen,
  postTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4 w-full">
        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className={cn(
            'absolute top-4 right-4 p-1 rounded-md',
            'text-text hover:bg-surface transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h3 id="delete-modal-title" className="text-lg font-bold text-secondary mb-2">
          Delete Post?
        </h3>

        {/* Description */}
        <p id="delete-modal-description" className="text-text text-sm mb-6">
          Are you sure you want to delete &ldquo;<strong>{postTitle}</strong>&rdquo;? This action
          cannot be undone.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'border border-surface text-secondary',
              'hover:bg-background transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'bg-red-600 text-white',
              'hover:bg-red-700 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'inline-flex items-center gap-2'
            )}
            aria-busy={isLoading}
          >
            {isLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
