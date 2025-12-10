'use client';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { formatFileSize, formatDate } from '@/lib/admin/dates';
import { Button } from '@/components/ui/Button';

interface MediaItemProps {
  item: any;
  isSelected?: boolean;
  onSelect?: (path: string) => void;
  onDelete?: (path: string) => void;
  showActions?: boolean;
}

export function MediaItem({ item, isSelected = false, onSelect, onDelete, showActions = false }: MediaItemProps) {
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(item.path);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.path);
    }
  };

  return (
    <Card
      className={`relative cursor-pointer hover:shadow-md transition-shadow ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleSelect}
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

      {showActions && (
        <div className="absolute top-2 right-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}
    </Card>
  );
}