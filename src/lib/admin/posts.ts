/**
 * Admin Posts CRUD & Query Functions
 * Handles all post-related database operations with error handling
 */

import { supabase } from './supabase';
import { DashboardStats, PostData, PostFilters, PaginatedResult, RecentActivity } from '@/types/admin';

/**
 * Get dashboard statistics (post counts and page views)
 */
export async function getPostStats(): Promise<DashboardStats> {
  try {
    // Get all posts to count by status
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, status', { count: 'exact' });

    if (error) throw error;

    // Count by status
    const published_count = posts?.filter((p) => p.status === 'published').length || 0;
    const draft_count = posts?.filter((p) => p.status === 'draft').length || 0;
    const scheduled_count = posts?.filter((p) => p.status === 'scheduled').length || 0;
    const total_posts = posts?.length || 0;

    // For now, return placeholder for page views (can integrate analytics later)
    const total_page_views = 0;

    return {
      total_posts,
      published_count,
      draft_count,
      scheduled_count,
      total_page_views,
    };
  } catch (error) {
    console.error('Error fetching post stats:', error);
    throw error;
  }
}

/**
 * Get recent activity (recently published and draft posts)
 * @param limit - Maximum number of activities to return (default: 10)
 */
export async function getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, status, updated_at, created_at')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (!data) return [];

    // Map to RecentActivity format
    return data.map((post) => ({
      id: post.id,
      type:
        post.status === 'published'
          ? 'post_published'
          : post.status === 'draft'
            ? 'post_drafted'
            : 'post_updated',
      post_title: post.title,
      post_id: post.id,
      created_at: post.updated_at || post.created_at,
    }));
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}

/**
 * Get a single post by ID
 */
export async function getPost(id: string): Promise<PostData> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Post not found');
    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

/**
 * Get posts with filters and pagination
 */
export async function getPosts(
  filters: PostFilters = {}
): Promise<PaginatedResult<PostData>> {
  try {
    const {
      search = '',
      status = 'all',
      category_id,
      page = 1,
      per_page = 10,
    } = filters;

    let query = supabase.from('posts').select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    // Get total count before pagination
    const countResult = await query;
    const count = countResult.count || 0;

    // Apply pagination
    const offset = (page - 1) * per_page;
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .ilike('title', `%${search}%`)
      .eq(status !== 'all' ? 'status' : 'status', status !== 'all' ? status : undefined)
      .eq(category_id ? 'category_id' : 'id', category_id || undefined)
      .order('updated_at', { ascending: false })
      .range(offset, offset + per_page - 1);

    if (error) throw error;

    const total_pages = Math.ceil((count || 0) / per_page);

    return {
      data: data || [],
      meta: {
        total: count || 0,
        page,
        per_page,
        total_pages,
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

/**
 * Create a new post
 */
export async function createPost(
  post: Omit<PostData, 'id' | 'created_at' | 'updated_at'>
): Promise<PostData> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create post');
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: string,
  updates: Partial<PostData>
): Promise<PostData> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Post not found');
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

/**
 * Publish a post (set status and published_at)
 */
export async function publishPost(id: string, published_at?: string): Promise<PostData> {
  const now = published_at || new Date().toISOString();

  return updatePost(id, {
    status: 'published',
    published_at: now,
  });
}

/**
 * Save post as draft
 */
export async function saveDraft(id: string, updates: Partial<PostData>): Promise<PostData> {
  return updatePost(id, {
    ...updates,
    status: 'draft',
  });
}
