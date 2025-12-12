'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { getMediaItems, searchMedia, MediaItem } from '@/lib/admin/media';
import { formatFileSize } from '@/lib/admin/dates';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface MediaBrowserProps {
  onSelect?: (media: MediaItem) => void;
  selectedMedia?: string[];
}

export function MediaBrowser({ onSelect, selectedMedia = [] }: MediaBrowserProps) {
  const { user } = useAdminAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadMedia() {
      try {
        setIsLoading(true);
        if (user) {
          const items = await getMediaItems(user.id);
          setMediaItems(items);
        }
      } catch (error) {
        console.error('Failed to load media:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMedia();
  }, [user]);

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

  const handleSelect = (item: MediaItem) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Text>Loading media...</Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading as={3}>Media Library</Heading>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {mediaItems.length === 0 ? (
        <div className="text-center py-8">
          <Text>No media items found</Text>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {mediaItems.map((item) => (
            <Card
              key={item.path}
              className={`relative cursor-pointer hover:shadow-md transition-shadow ${
                selectedMedia.includes(item.path) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelect(item)}
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
                      {formatFileSize(item.size)}
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
    </div>
  );
}