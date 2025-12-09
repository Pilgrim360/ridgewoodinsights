import { getSupabaseClient } from '@/lib/supabase/client';
import { validateImageUpload } from './validators';
import { AdminErrorHandler } from './error-handler';

/**
 * Image upload and storage utilities for admin CMS
 * Handles uploads to Supabase Storage (blog-images bucket)
 */

const BUCKET_NAME = 'blog-images';

/**
 * Upload an image to Supabase Storage
 * Organizes uploads by user ID: /userId/fileName
 */
export async function uploadImage(
  file: File,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
  // Validate image
  const validationError = validateImageUpload(file);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    const supabase = getSupabaseClient();

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const storagePath = `${userId}/${fileName}`;

    // Upload file
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

    if (onProgress) {
      onProgress(100);
    }

    return {
      url: publicUrl,
      path: storagePath,
    };
  } catch (error) {
    const parsedError = AdminErrorHandler.parse(error);
    throw new Error(parsedError.message);
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(storagePath: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    const parsedError = AdminErrorHandler.parse(error);
    throw new Error(parsedError.message);
  }
}

/**
 * Get public URL for an uploaded image
 */
export function getImageUrl(storagePath: string): string {
  const supabase = getSupabaseClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

  return publicUrl;
}
