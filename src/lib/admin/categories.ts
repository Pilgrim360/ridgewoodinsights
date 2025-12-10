/**
 * Admin Categories CRUD & Query Functions
 * Handles all category-related database operations with error handling
 */

import { supabase } from './supabase';
import { CategoryData, CategoryWithPostCount } from '@/types/admin';

/**
 * Get all categories
 */
export async function getCategories(): Promise<CategoryData[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get categories with post counts
 */
export async function getCategoriesWithCount(): Promise<CategoryWithPostCount[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*, posts(count)')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []).map((cat) => ({
      ...cat,
      post_count: (cat as Record<string, unknown>).posts?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error('Error fetching categories with count:', error);
    throw error;
  }
}

/**
 * Get a single category by ID
 */
export async function getCategory(id: string): Promise<CategoryData> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Category not found');
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

/**
 * Create a new category
 */
export async function createCategory(
  category: Omit<CategoryData, 'id' | 'created_at'>
): Promise<CategoryData> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create category');
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  id: string,
  updates: Partial<CategoryData>
): Promise<CategoryData> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Category not found');
    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}
