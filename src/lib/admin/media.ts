import { supabase } from './supabase';

export interface MediaItem {
  name: string;
  path: string;
  url: string;
  created_at: string;
  size: number;
  type: 'image' | 'document' | 'other';
  used_in_posts?: number;
}

export async function getMediaItems(userId: string): Promise<MediaItem[]> {
  const { data, error } = await supabase.storage
    .from('blog-images')
    .list(`${userId}/`, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((item: any) => {
    const size = (item.metadata as { size?: number })?.size || 0;
    return {
      name: item.name,
      path: `${userId}/${item.name}`,
      url: getImageUrl(`${userId}/${item.name}`),
      created_at: item.created_at || new Date().toISOString(),
      size,
      type: getMediaType(item.name),
      used_in_posts: 0 // TODO: Implement usage tracking
    };
  });
}

export async function uploadMedia(file: File, userId: string): Promise<MediaItem> {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  return {
    name: file.name,
    path: filePath,
    url: getImageUrl(filePath),
    created_at: new Date().toISOString(),
    size: file.size,
    type: getMediaType(file.name),
    used_in_posts: 0
  };
}

export async function deleteMedia(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('blog-images')
    .remove([path]);

  if (error) throw error;
}

export function getImageUrl(path: string): string {
  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(path);

  return data.publicUrl;
}

function getMediaType(filename: string): 'image' | 'document' | 'other' {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  const extension = filename.split('.').pop()?.toLowerCase() || '';

  if (imageExtensions.includes(extension)) return 'image';
  if (documentExtensions.includes(extension)) return 'document';
  return 'other';
}

export async function searchMedia(userId: string, searchTerm: string): Promise<MediaItem[]> {
  const allMedia = await getMediaItems(userId);
  return allMedia.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}