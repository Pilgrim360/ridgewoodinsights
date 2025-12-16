import { createClient } from '@/lib/supabase/server';
import type { Insight } from '@/constants';

// Helper to calculate read time from HTML content
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>?/gm, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPostToInsight(post: any): Insight {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    date: post.published_at || new Date().toISOString(),
    readTime: calculateReadTime(post.content_html || ''),
    category: post.categories?.name || 'Uncategorized',
    author: post.profiles?.email?.split('@')[0] || 'Ridgewood Team',
    image: post.cover_image || undefined,
    link: `/insights/${post.slug}`,
  };
}

export interface PublishedPostsPageParams {
  offset?: number;
  limit?: number;
}

export async function getPublishedPostsPage({
  offset = 0,
  limit = 12,
}: PublishedPostsPageParams = {}): Promise<{ insights: Insight[]; total: number }> {
  const supabase = await createClient();

  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.min(Math.max(1, limit), 50);

  const { data: posts, error, count } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content_html,
      published_at,
      cover_image,
      categories ( name ),
      profiles ( email )
    `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(safeOffset, safeOffset + safeLimit - 1);

  if (error) {
    console.error('Error fetching posts:', error);
    return { insights: [], total: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insights = (posts ?? []).map((post: any) => mapPostToInsight(post));

  return {
    insights,
    total: count ?? insights.length,
  };
}

export async function getPublishedPosts(limit?: number): Promise<Insight[]> {
  const supabase = await createClient();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (posts ?? []).map((post: any) => mapPostToInsight(post));
}

export async function getPostBySlug(
  slug: string
): Promise<(Insight & { content: string }) | null> {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content_html,
      published_at,
      cover_image,
      categories ( name ),
      profiles ( email )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !post) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = post as any;

  return {
    ...mapPostToInsight(p),
    content: p.content_html || '',
  };
}
