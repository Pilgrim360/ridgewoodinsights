'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, X, Image as ImageIcon, FileText, File, Search } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import { MediaItem } from '@/lib/admin/media';
import { useMediaLibrary } from '@/hooks/queries/useMediaQueries';
import { useDeleteMedia, useUploadMedia } from '@/hooks/queries/useAdminMutations';

function MediaTypeIcon({ type }: { type: string }) {
  const cls = 'w-8 h-8';
  if (type === 'image') return <ImageIcon className={cn(cls, 'text-primary/60')} />;
  if (type === 'document') return <FileText className={cn(cls, 'text-blue-500/60')} />;
  return <File className={cn(cls, 'text-text/40')} />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MediaPage() {
  const { user } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const mediaQuery = useMediaLibrary({ userId: user?.id, search: searchTerm });
  const uploadMutation = useUploadMedia(user?.id);
  const deleteMutation = useDeleteMedia(user?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaItems = mediaQuery.data ?? [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMutation.mutateAsync(file);
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMedia.length === 0) return;
    try {
      for (const path of selectedMedia) {
        await deleteMutation.mutateAsync(path);
      }
      setSelectedMedia([]);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const toggleSelect = (path: string) => {
    setSelectedMedia((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-secondary">Media Library</h1>
        <div className="flex items-center gap-2">
          {selectedMedia.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedMedia.length})
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            multiple
            accept="image/*,.pdf,.doc,.docx"
            disabled={isUploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
        <input
          type="text"
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface bg-white text-secondary placeholder:text-text/40 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Content */}
      {mediaQuery.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary" />
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="rounded-lg border border-surface bg-white flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
            <ImageIcon className="w-5 h-5 text-text/40" />
          </div>
          <p className="font-medium text-secondary">No media found</p>
          <p className="text-sm text-text/60 mt-1">
            {searchTerm ? 'Try a different search term' : 'Upload your first file'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item: MediaItem) => (
            <div
              key={item.path}
              onClick={() => toggleSelect(item.path)}
              className={cn(
                'bg-white rounded-lg border border-surface overflow-hidden cursor-pointer hover:shadow-sm transition-shadow',
                selectedMedia.includes(item.path) && 'ring-2 ring-primary border-primary'
              )}
            >
              <div className="aspect-square bg-surface/50 flex items-center justify-center relative">
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <MediaTypeIcon type={item.type} />
                )}
                {selectedMedia.includes(item.path) && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="font-medium text-secondary text-xs truncate">{item.name}</p>
                <p className="text-xs text-text/50 mt-0.5">
                  {formatFileSize(item.size)} · {formatDate(item.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4">
            <h3 className="font-semibold text-secondary">Delete Media</h3>
            <p className="text-sm text-text/60 mt-1 mb-4">
              Delete {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''}? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-sm font-medium text-secondary hover:bg-surface rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDeleteSelected()}
                disabled={deleteMutation.isPending}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
