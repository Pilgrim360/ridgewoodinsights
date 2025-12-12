'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { uploadMedia, MediaItem } from '@/lib/admin/media';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface MediaUploadProps {
  onUploadComplete?: (mediaItems: MediaItem[]) => void | undefined;
  multiple?: boolean;
  accept?: string;
}

export function MediaUpload({ onUploadComplete, multiple = true, accept = 'image/*,.pdf,.doc,.docx' }: MediaUploadProps) {
  const { user } = useAdminAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const uploadedItems = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);

        const uploadedItem = await uploadMedia(file, user.id);
        uploadedItems.push(uploadedItem);
      }

      if (onUploadComplete) {
        onUploadComplete(uploadedItems);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        id="media-upload"
        className="hidden"
        onChange={handleFileUpload}
        multiple={multiple}
        accept={accept}
        disabled={isUploading}
      />
      <label htmlFor="media-upload">
        <Button variant="primary" disabled={isUploading} className="w-full">
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Media'}
        </Button>
      </label>

      {error && (
        <Text className="text-red-500 text-sm">
          {error}
        </Text>
      )}

      <Text muted className="text-xs text-center">
        {multiple ? 'Select multiple files' : 'Select a single file'}
      </Text>
    </div>
  );
}