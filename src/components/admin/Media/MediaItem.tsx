'use client';

import React from 'react';
import Image from 'next/image';
import { Image as ImageIcon, FileText, File } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/admin/dates';
import { MediaItem as MediaItemType } from '@/lib/admin/media';
import { cn } from '@/lib/utils';

interface MediaItemProps {
  item: MediaItemType;
  isSelected?: boolean;
  onSelect?: (path: string) => void;
  onDelete?: (path: string) => void;
  showActions?: boolean;
}

function MediaTypeIcon({ type }: { type: string }) {
  if (type === 'image') return <ImageIcon className="w-8 h-8 text-primary/60" />;
  if (type === 'document') return <FileText className="w-8 h-8 text-blue-500/60" />;
  return <File className="w-8 h-8 text-text/40" />;
}

export function MediaItem({
  item,
  isSelected = false,
  onSelect,
  onDelete,
  showActions = false,
}: MediaItemProps) {
  const handleSelect = () => {
    onSelect?.(item.path);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item.path);
  };

  return (
    <Card
      className={cn(
        'relative cursor-pointer hover:shadow-md transition-shadow p-0',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={handleSelect}
    >
      <div className="aspect-square bg-surface/50 flex items-center justify-center overflow-hidden rounded-t-xl relative">
        {item.type === 'image' ? (
          <Image
            src={item.url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <MediaTypeIcon type={item.type} />
        )}
      </div>
      <div className="p-2">
        <div className="flex justify-between items-start gap-1">
          <div className="min-w-0 flex-1 truncate">
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

      {showActions && (
        <div className="absolute top-2 right-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-7 w-7 p-0"
            aria-label="Delete media item"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </Button>
        </div>
      )}
    </Card>
  );
}
