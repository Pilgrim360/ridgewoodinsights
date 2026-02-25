'use client';

import { Image as ImageIcon, FileText, File } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { formatFileSize, formatDate } from '@/lib/admin/dates';
import { MediaItem } from '@/lib/admin/media';
import { cn } from '@/lib/utils';

interface MediaGridProps {
  items: MediaItem[];
  selectedItems?: string[];
  onItemClick?: (item: MediaItem) => void;
  onItemSelect?: (path: string) => void;
}

function MediaTypeIcon({ type }: { type: string }) {
  const iconClass = 'w-8 h-8';
  switch (type) {
    case 'image':
      return <ImageIcon className={cn(iconClass, 'text-primary/60')} />;
    case 'document':
      return <FileText className={cn(iconClass, 'text-blue-500/60')} />;
    default:
      return <File className={cn(iconClass, 'text-text/40')} />;
  }
}

export function MediaGrid({
  items,
  selectedItems = [],
  onItemClick,
  onItemSelect,
}: MediaGridProps) {
  const handleClick = (item: MediaItem) => {
    if (onItemClick) onItemClick(item);
    if (onItemSelect) onItemSelect(item.path);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
          <ImageIcon className="w-5 h-5 text-text/40" />
        </div>
        <Text className="font-medium text-secondary">No media items found</Text>
        <Text muted className="text-xs mt-1">Upload your first file to get started</Text>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <Card
          key={item.path}
          padding="sm"
          className={cn(
            'cursor-pointer hover:shadow-md transition-all duration-200 p-0',
            selectedItems.includes(item.path) && 'ring-2 ring-primary'
          )}
          onClick={() => handleClick(item)}
        >
          <div className="aspect-square bg-surface/50 flex items-center justify-center overflow-hidden rounded-t-xl">
            {item.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <MediaTypeIcon type={item.type} />
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
  );
}
