'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, X, Image as ImageIcon, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { formatFileSize, formatDate } from '@/lib/admin/dates';
import { ErrorBoundary } from '@/components/admin/ErrorBoundary';
import { useMediaLibrary } from '@/hooks/queries/useMediaQueries';
import { useDeleteMedia, useUploadMedia } from '@/hooks/queries/useAdminMutations';
import { cn } from '@/lib/utils';
import { MediaItem } from '@/lib/admin/media';

function MediaTypeIcon({ type }: { type: string }) {
  const cls = 'w-8 h-8';
  if (type === 'image') return <ImageIcon className={cn(cls, 'text-primary/60')} />;
  if (type === 'document') return <FileText className={cn(cls, 'text-blue-500/60')} />;
  return <File className={cn(cls, 'text-text/40')} />;
}

export default function MediaPage() {
  const { user } = useAdminAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        await uploadMutation.mutateAsync(files[i]);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Heading as={1} className="text-2xl">Media Library</Heading>
            <Text muted className="text-sm mt-0.5">
              Manage images and files for your posts
            </Text>
          </div>
          <div className="flex items-center gap-2">
            {selectedMedia.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete ({selectedMedia.length})
              </Button>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              id="media-upload"
              className="hidden"
              onChange={handleFileUpload}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              disabled={isUploading}
            />
            <Button
              variant="primary"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? `Uploading ${uploadProgress}%` : 'Upload'}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-sm">
          <Input
            type="text"
            placeholder="Search media files…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Content */}
        {mediaQuery.isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary" />
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="rounded-xl border border-surface bg-white flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-text/40" />
            </div>
            <Text className="font-medium text-secondary mb-1">No media found</Text>
            <Text muted className="text-sm">
              {searchTerm ? 'Try a different search term.' : 'Upload your first file to get started.'}
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item: MediaItem) => (
              <Card
                key={item.path}
                padding="sm"
                className={cn(
                  'cursor-pointer hover:shadow-md transition-all duration-200 p-0',
                  selectedMedia.includes(item.path) && 'ring-2 ring-primary'
                )}
                onClick={() => toggleSelect(item.path)}
              >
                <div className="aspect-square bg-surface/50 flex items-center justify-center overflow-hidden relative rounded-t-xl">
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
                  <div className="flex justify-between items-start gap-1">
                    <div className="min-w-0 flex-1">
                      <Text className="font-medium truncate text-xs">{item.name}</Text>
                      <Text muted className="text-xs mt-0.5">
                        {formatFileSize(item.size)} · {formatDate(item.created_at)}
                      </Text>
                    </div>
                    <Badge variant={item.type === 'image' ? 'info' : 'neutral'} className="flex-shrink-0">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full">
              <Heading as={3} className="text-lg mb-2">Delete Media</Heading>
              <Text className="mb-6 text-sm">
                Are you sure you want to delete {selectedMedia.length} item
                {selectedMedia.length !== 1 ? 's' : ''}? This action cannot be undone.
              </Text>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => void handleDeleteSelected()}
                  isLoading={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
