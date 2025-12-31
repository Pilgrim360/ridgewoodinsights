'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, File as FileIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Heading } from '@/components/ui/Heading';
import { MediaItem } from '@/lib/admin/media';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/admin/dates';
import { useUploadMedia } from '@/hooks/queries/useAdminMutations';

interface MediaUploadProps {
  onUploadComplete?: (mediaItems: MediaItem[]) => void;
  multiple?: boolean;
  accept?: string;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
  item?: MediaItem;
}

export function MediaUpload({
  onUploadComplete,
  multiple = true,
  accept = 'image/*,.pdf,.doc,.docx',
}: MediaUploadProps) {
  const { user } = useAdminAuth();
  const uploadMutation = useUploadMedia(user?.id);

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startUpload = useCallback(
    async (newUploads: UploadFile[]) => {
      if (!user) return;

      const results: MediaItem[] = [];

      for (const upload of newUploads) {
        setFiles((prev) =>
          prev.map((f) => (f.id === upload.id ? { ...f, status: 'uploading' } : f))
        );

        try {
          const item = await uploadMutation.mutateAsync(upload.file);
          results.push(item);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === upload.id
                ? { ...f, status: 'complete', progress: 100, item }
                : f
            )
          );
        } catch (err) {
          console.error('Upload error:', err);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === upload.id
                ? { ...f, status: 'error', error: 'Upload failed' }
                : f
            )
          );
        }
      }

      if (results.length > 0 && onUploadComplete) {
        onUploadComplete(results);
      }
    },
    [onUploadComplete, uploadMutation, user]
  );

  const handleFiles = useCallback(
    (newFileList: FileList | null) => {
      if (!newFileList || newFileList.length === 0) return;

      const newUploadFiles: UploadFile[] = Array.from(newFileList).map((file) => ({
        id: `${Date.now()}-${file.name}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'pending',
      }));

      if (!multiple) {
        setFiles([newUploadFiles[0]]);
        void startUpload([newUploadFiles[0]]);
      } else {
        setFiles((prev) => [...prev, ...newUploadFiles]);
        void startUpload(newUploadFiles);
      }
    },
    [multiple, startUpload]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5 scale-[0.99]'
            : 'border-surface bg-background hover:border-primary/50'
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <Heading as={3} className="mb-2">
            Drop files here to upload
          </Heading>
          <Text muted className="mb-6">
            or
          </Text>
          <input
            ref={fileInputRef}
            type="file"
            id="media-upload-input"
            className="hidden"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            variant="primary"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Select Files
          </Button>
          <Text muted className="mt-4 text-xs">
            Maximum upload file size: 25 MB.
          </Text>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <Heading as={4}>Uploads</Heading>
          <div className="divide-y divide-surface rounded-lg border border-surface bg-white">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-surface/30 flex items-center justify-center">
                  {file.file.type.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(file.file)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileIcon className="h-5 w-5 text-text/40" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Text className="text-sm font-medium truncate">{file.file.name}</Text>
                    <div className="flex items-center gap-2">
                      <Text muted className="text-xs">
                        {formatFileSize(file.file.size)}
                      </Text>
                      {file.status === 'complete' && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="relative h-1.5 w-full rounded-full bg-surface overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        file.status === 'error' ? 'bg-red-500' : 'bg-primary'
                      )}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-text/40 hover:text-text"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
