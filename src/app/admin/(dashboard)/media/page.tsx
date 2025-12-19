'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { getMediaItems, uploadMedia, deleteMedia, searchMedia } from '@/lib/admin/media';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { formatFileSize, formatDate } from '@/lib/admin/dates';
import { ErrorBoundary } from '@/components/admin/ErrorBoundary';
import { AdminError } from '@/types/admin';

export default function MediaPage() {
  const { user } = useAdminAuth();
  const router = useRouter();
  const [mediaItems, setMediaItems] = useState<Array<{
    path: string;
    name: string;
    type: string;
    size: number;
    url: string;
    created_at: string;
  }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: handleDelete } = useAdminMutation(
    async () => {
      // This will be called for each selected item
      if (selectedMedia.length === 0) return;

      // Delete all selected items
      for (const path of selectedMedia) {
        await deleteMedia(path);
      }
      return selectedMedia;
    },
    {
      onSuccess: () => {
        setMediaItems(mediaItems.filter(item => !selectedMedia.includes(item.path)));
        setSelectedMedia([]);
      },
      onError: (error: AdminError) => {
        console.error('Delete failed:', error);
      }
    }
  );

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    async function loadMedia() {
      try {
        if (user) {
          const items = await getMediaItems(user.id);
          setMediaItems(items);
        }
      } catch (error) {
        console.error('Failed to load media:', error);
      }
    }

    loadMedia();
  }, [user, router]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!user) return;

    if (term.trim() === '') {
      const items = await getMediaItems(user.id);
      setMediaItems(items);
    } else {
      const results = await searchMedia(user.id, term);
      setMediaItems(results);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);

        const uploadedItem = await uploadMedia(file, user.id);
        setMediaItems(prev => [uploadedItem, ...prev]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteSelected = () => {
    handleDelete();
    setShowDeleteConfirm(false);
  };

  const toggleSelect = (path: string) => {
    setSelectedMedia(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Heading as={1}>Media Library</Heading>
          <div className="flex gap-2">
            <Input
              type="file"
              id="media-upload"
              className="hidden"
              onChange={handleFileUpload}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              disabled={isUploading}
            />
            <label htmlFor="media-upload">
              <Button variant="primary" disabled={isUploading}>
                {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Media'}
              </Button>
            </label>
            {selectedMedia.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Selected ({selectedMedia.length})
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <Text>No media items found</Text>
            <Text muted className="mt-2">
              Upload your first media file to get started
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item) => (
              <Card
                key={item.path}
                className={`relative cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedMedia.includes(item.path) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleSelect(item.path)}
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-4xl">{getMediaTypeIcon(item.type)}</div>
                  )}
                </div>
                <div className="p-2">
                  <div className="flex justify-between items-start">
                    <div className="truncate text-sm">
                      <Text className="font-medium truncate">{item.name}</Text>
                      <Text muted className="text-xs">
                        {formatFileSize(item.size)} • {formatDate(item.created_at)}
                      </Text>
                    </div>
                    <Badge variant={item.type === 'image' ? 'info' : 'neutral'}>
                      {item.type}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-sm">
              <Heading as={3} className="mb-4">Delete Media</Heading>
              <Text className="mb-4">
                Are you sure you want to delete {selectedMedia.length} media item(s)?
              </Text>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDeleteSelected}
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