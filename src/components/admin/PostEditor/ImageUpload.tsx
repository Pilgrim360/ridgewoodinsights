'use client';

import { useRef, useState } from 'react';
import { uploadPostImage } from '@/lib/admin/storage';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageUpload, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 5;

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large (max ${MAX_SIZE_MB}MB)`;
    }
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return 'Invalid format. Use JPEG, PNG, or WebP';
    }
    return null;
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);
    setProgress(0);

    try {
      // Simulate progress for UX (actual upload is fast)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 30;
        });
      }, 100);

      const url = await uploadPostImage(file);

      clearInterval(progressInterval);
      setProgress(100);
      onImageUpload(url);

      // Reset after short delay
      setTimeout(() => {
        setProgress(0);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || isLoading}
        className="hidden"
        aria-label="Upload image"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isLoading}
        className={cn(
          'w-full px-4 py-2 rounded-lg border-2 border-dashed',
          'transition-colors text-sm font-medium',
          disabled || isLoading
            ? 'border-surface bg-background text-text/50 cursor-not-allowed'
            : 'border-surface hover:border-primary bg-white text-secondary'
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Uploading...
          </div>
        ) : (
          'Choose Image'
        )}
      </button>

      {progress > 0 && progress < 100 && (
        <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {progress === 100 && !error && (
        <p className="text-sm text-green-600">Upload complete</p>
      )}
    </div>
  );
}
