'use client';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { formatFileSize, formatDate } from '@/lib/admin/dates';
import { MediaItem } from '@/lib/admin/media';

interface MediaGridProps {
  items: MediaItem[];
  selectedItems?: string[];
  onItemClick?: (item: MediaItem) => void | undefined;
  onItemSelect?: (path: string) => void | undefined;
}

export function MediaGrid({
  items,
  selectedItems = [],
  onItemClick,
  onItemSelect
}: MediaGridProps) {
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const handleClick = (item: MediaItem): void => {
    if (onItemClick) {
      onItemClick(item);
    }
    if (onItemSelect) {
      onItemSelect(item.path);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <Text>No media items found</Text>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <Card
          key={item.path}
          className={`relative cursor-pointer hover:shadow-md transition-shadow ${
            selectedItems.includes(item.path) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleClick(item)}
        >
          <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-3xl">{getMediaTypeIcon(item.type)}</div>
            )}
          </div>
          <div className="p-2">
            <div className="flex justify-between items-start">
              <div className="truncate text-xs">
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
  );
}