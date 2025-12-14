import { createClient } from '@/lib/supabase/server';
import type { Insight } from '@/constants';

// Helper to calculate read time from HTML content
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  // Strip HTML tags
  const text = content.replace(/<[^>]*>?/gm, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getPublishedPosts(limit?: number): Promise<Insight[]> {
  const supabase = await createClient();

  // Select posts with category and author info
  // Assumes foreign key relationships exist: posts.category_id -> categories.id, posts.author_id -> profiles.id
  let query = supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content_html,
      published_at,
      cover_image,
      categories (
        name
      ),
      profiles (
        email
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  // Map database response to the Insight interface
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    date: post.published_at || new Date().toISOString(),
    readTime: calculateReadTime(post.content_html || ''),
    // Handle joined data safely with fallbacks
    category: post.categories?.name || 'Uncategorized',
    // Generate a display name from email since full name isn't in profiles yet
    author: post.profiles?.email?.split('@')[0] || 'Ridgewood Team',
    image: post.cover_image || undefined,
    // Construct link using the slug
    link: `/insights/${post.slug}`,
  }));
}

export async function getPostBySlug(slug: string): Promise<(Insight & { content: string }) | null> {
  const supabase = await createClient();
  
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content_html,
      published_at,
      cover_image,
      categories ( name ),
      profiles ( email )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !post) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = post as any;

  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || '',
    date: p.published_at || new Date().toISOString(),
    readTime: calculateReadTime(p.content_html || ''),
    category: p.categories?.name || 'Uncategorized',
    author: p.profiles?.email?.split('@')[0] || 'Ridgewood Team',
    image: p.cover_image || undefined,
    link: `/insights/${p.slug}`,
    content: p.content_html || '',
  };
}