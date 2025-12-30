'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Tag, Trash2, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { MediaItem } from '@/lib/admin/media';
import { formatFileSize, formatDate } from '@/lib/admin/dates';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import { ImageConfig } from './MediaModal';
import { useMediaLibrary } from '@/hooks/queries/useMediaQueries';
import { useDeleteMedia } from '@/hooks/queries/useAdminMutations';

interface MediaBrowserProps {
  onSelect?: (media: MediaItem) => void;
  selectedMedia?: string[];
  onInsert?: (config: ImageConfig) => void;
  isModal?: boolean;
}

export function MediaBrowser({
  onSelect,
  selectedMedia = [],
  onInsert,
  isModal,
}: MediaBrowserProps) {
  const { user } = useAdminAuth();

  const mediaQuery = useMediaLibrary({ userId: user?.id });
  const deleteMutation = useDeleteMedia(user?.id);

  const mediaItems = mediaQuery.data ?? [];
  const isLoading = mediaQuery.isLoading || mediaQuery.isFetching;

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'document' | 'other'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  const [config, setConfig] = useState<Omit<ImageConfig, 'url'>>({
    alt: '',
    title: '',
    alignment: 'center',
    size: 'full',
    link: '',
  });

  const selectedItem = useMemo(
    () => mediaItems.find((item) => selectedMedia.includes(item.path)) || null,
    [mediaItems, selectedMedia]
  );

  useEffect(() => {
    if (selectedItem) {
      setConfig((prev) => ({
        ...prev,
        title: selectedItem.name.split('-').slice(1).join('-') || selectedItem.name,
        alt: prev.alt || '',
      }));
    }
  }, [selectedItem]);

  const filteredAndSortedItems = useMemo(() => {
    let items = [...mediaItems];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(term));
    }

    if (typeFilter !== 'all') {
      items = items.filter((item) => item.type === typeFilter);
    }

    items.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return items;
  }, [mediaItems, searchTerm, typeFilter, sortBy]);

  const handleDelete = async (path: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteMutation.mutateAsync(path);
    } catch {
      // errors are handled by the global admin toast system
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-primary/60" />;
      case 'document':
        return <Tag className="h-8 w-8 text-blue-500/60" />;
      default:
        return <Tag className="h-8 w-8 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden relative min-h-0">
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-background">
        <div className="flex flex-wrap items-center gap-4 border-b border-surface p-4 bg-white">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text/40" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as 'all' | 'image' | 'document' | 'other')
            }
            className="w-40"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
            className="w-40"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">A-Z</option>
          </Select>
          <Button variant="outline" size="sm" onClick={() => void mediaQuery.refetch()}>
            Refresh
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredAndSortedItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ImageIcon className="h-12 w-12 text-text/20 mb-2" />
              <Text muted>No media items found</Text>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredAndSortedItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => onSelect?.(item)}
                  className={cn(
                    'group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all',
                    selectedMedia.includes(item.path)
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent bg-white hover:border-surface'
                  )}
                >
                  {item.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface/30">
                      {getMediaTypeIcon(item.type)}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 translate-y-full transition-transform group-hover:translate-y-0">
                    <Text className="truncate text-[10px] text-white text-center">
                      {item.name.split('-').slice(1).join('-') || item.name}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="w-80 flex-none border-l border-surface bg-white flex flex-col min-h-0 h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
            <div>
              <Heading as={4} className="mb-4">
                Attachment Details
              </Heading>
              <div className="flex gap-4 mb-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-surface bg-background">
                  {selectedItem.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedItem.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      {getMediaTypeIcon(selectedItem.type)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Text className="font-medium truncate text-sm" title={selectedItem.name}>
                    {selectedItem.name.split('-').slice(1).join('-') || selectedItem.name}
                  </Text>
                  <Text muted className="text-xs uppercase">
                    {selectedItem.type}
                  </Text>
                  <Text muted className="text-xs">
                    {formatDate(selectedItem.created_at)}
                  </Text>
                  <Text muted className="text-xs">
                    {formatFileSize(selectedItem.size)}
                  </Text>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(selectedItem.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => void handleDelete(selectedItem.path)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <hr className="border-surface" />

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text/60 uppercase mb-1">
                  Alt Text
                </label>
                <Input
                  value={config.alt}
                  onChange={(e) => setConfig((prev) => ({ ...prev, alt: e.target.value }))}
                  placeholder="Describe this image..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text/60 uppercase mb-1">
                  Title
                </label>
                <Input
                  value={config.title}
                  onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              {selectedItem.type === 'image' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-text/60 uppercase mb-1">
                      Alignment
                    </label>
                    <Select
                      value={config.alignment}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          alignment: e.target.value as 'left' | 'center' | 'right' | 'full',
                        }))
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="full">Full Width</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text/60 uppercase mb-1">
                      Size
                    </label>
                    <Select
                      value={config.size}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          size: e.target.value as 'thumbnail' | 'medium' | 'large' | 'full',
                        }))
                      }
                    >
                      <option value="thumbnail">Thumbnail (150px)</option>
                      <option value="medium">Medium (300px)</option>
                      <option value="large">Large (1024px)</option>
                      <option value="full">Full Size</option>
                    </Select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-semibold text-text/60 uppercase mb-1">
                  Link To
                </label>
                <Input
                  value={config.link}
                  onChange={(e) => setConfig((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          {isModal && (
            <div className="p-6 border-t border-surface bg-white">
              <Button className="w-full" onClick={() => onInsert?.({ ...config, url: selectedItem.url })}>
                Insert into Post
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
