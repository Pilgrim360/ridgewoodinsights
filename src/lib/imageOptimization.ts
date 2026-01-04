/**
 * Image Optimization Helpers for Ridgewood Insights
 * 
 * Provides utilities for optimizing images from various sources:
 * - Unsplash URLs with standard query parameters
 * - Supabase Storage transformations
 * - Local asset optimization
 */

// ============================================================================
// Unsplash Image Helpers
// ============================================================================

/**
 * Unsplash URL parameters for consistent optimization
 */
export const UNSPLASH_PARAMS = {
  quality: 80,
  auto: 'format' as const, // Automatically serves WebP to supported browsers
  fit: 'crop' as const,
};

/**
 * Build an optimized Unsplash image URL
 * 
 * @param unsplashId - The Unsplash photo ID (e.g., "photo-1554224155-6726b3ff858f")
 * @param options - Optional override parameters
 * @returns Optimized URL with query parameters
 * 
 * @example
 * // Basic usage with defaults
 * getUnsplashUrl("photo-1554224155-6726b3ff858f")
 * // Returns: https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop
 * 
 * @example
 * // Custom width for thumbnails
 * getUnsplashUrl("photo-1554224155-6726b3ff858f", { width: 600 })
 * // Returns: https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80&auto=format&fit=crop
 */
export function getUnsplashUrl(
  unsplashId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    autoFormat?: boolean;
    fit?: 'crop' | 'min' | 'max' | 'thumb' | 'square';
    focalPoint?: string; // e.g., "face", "center"
  } = {}
): string {
  // Clean the ID (remove any existing query params or path prefix)
  const cleanId = unsplashId.includes('?') 
    ? unsplashId.split('?')[0] 
    : unsplashId;

  const baseUrl = `https://images.unsplash.com/${cleanId}`;
  
  const params = new URLSearchParams();
  
  // Width - required for proper optimization
  if (options.width) {
    params.set('w', options.width.toString());
  }
  
  // Height (optional, use with fit=crop for specific crops)
  if (options.height) {
    params.set('h', options.height.toString());
  }
  
  // Quality (default: 80 for good balance of quality/size)
  params.set('q', (options.quality ?? UNSPLASH_PARAMS.quality).toString());
  
  // Auto format - serves WebP/AVIF to supported browsers
  params.set('auto', options.autoFormat !== false ? UNSPLASH_PARAMS.auto : 'false');
  
  // Fit mode for crop/resize behavior
  params.set('fit', options.fit ?? UNSPLASH_PARAMS.fit);
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Get responsive Unsplash URLs for different viewport sizes
 * 
 * @param unsplashId - The Unsplash photo ID
 * @returns Object with URLs for different breakpoints
 */
export function getResponsiveUnsplashUrls(unsplashId: string): {
  mobile: string;
  tablet: string;
  desktop: string;
  large: string;
} {
  return {
    mobile: getUnsplashUrl(unsplashId, { width: 640 }),
    tablet: getUnsplashUrl(unsplashId, { width: 1024 }),
    desktop: getUnsplashUrl(unsplashId, { width: 1600 }),
    large: getUnsplashUrl(unsplashId, { width: 2400 }),
  };
}

// ============================================================================
// Supabase Storage Image Helpers
// ============================================================================

/**
 * Build a Supabase Storage URL with transformation parameters
 * 
 * @param storageUrl - Full Supabase storage URL
 * @param options - Transformation options
 * @returns Transformed URL for optimized delivery
 * 
 * @example
 * getSupabaseImageUrl(
 *   "https://nnnfcbmzygubyhufxwln.supabase.co/storage/v1/object/public/blog-images/photo.jpg",
 *   { width: 800, height: 600 }
 * )
 */
export function getSupabaseImageUrl(
  storageUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    resize?: 'cover' | 'contain' | 'fill' | 'down' | 'force';
  } = {}
): string {
  // If already has transform params, append to them
  const hasParams = storageUrl.includes('?');
  const baseUrl = hasParams ? storageUrl.split('?')[0] : storageUrl;
  const existingParams = hasParams ? new URLSearchParams(storageUrl.split('?')[1]) : new URLSearchParams();

  const params = new URLSearchParams(existingParams);

  if (options.width) {
    params.set('width', options.width.toString());
  }
  if (options.height) {
    params.set('height', options.height.toString());
  }
  if (options.quality) {
    params.set('quality', options.quality.toString());
  }
  if (options.resize) {
    params.set('resize', options.resize);
  }

  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

/**
 * Get thumbnail URL for Supabase images (300x300px)
 */
export function getSupabaseThumbnailUrl(storageUrl: string): string {
  return getSupabaseImageUrl(storageUrl, {
    width: 300,
    height: 300,
    resize: 'cover',
    quality: 75,
  });
}

/**
 * Get card-sized URL for Supabase images (600x400px)
 */
export function getSupabaseCardUrl(storageUrl: string): string {
  return getSupabaseImageUrl(storageUrl, {
    width: 600,
    height: 400,
    resize: 'cover',
    quality: 80,
  });
}

// ============================================================================
// Local Asset Helpers
// ============================================================================

/**
 * Get WebP version of a local image asset
 * Replaces file extension with .webp
 * 
 * @param assetPath - Original asset path (e.g., "/images/team/john-smith.jpg")
 * @returns WebP path (e.g., "/images/team/john-smith.webp")
 * 
 * @example
 * getWebpPath("/images/photo.jpg") // Returns: "/images/photo.webp"
 */
export function getWebpPath(assetPath: string): string {
  const extension = assetPath.split('.').pop();
  if (!extension) return assetPath;
  
  return assetPath.replace(`.${extension}`, '.webp');
}

/**
 * Generate blur placeholder data URL (tiny, low-quality)
 * Used for Next.js Image placeholder="blur"
 * 
 * @returns Base64 encoded tiny image as data URL
 */
export function getBlurDataUrl(): string {
  // Returns a static tiny placeholder image
  // For production, generate actual blurred thumbnails dynamically
  return `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`;
}

// ============================================================================
// Responsive Sizes Helper
// ============================================================================

/**
 * Generate sizes attribute for Next.js Image component
 * Based on common breakpoint patterns
 * 
 * @param sizes - Map of breakpoint to viewport width coverage
 * @returns Sizes string for Image component
 * 
 * @example
 * getResponsiveSizes({
 *   mobile: '100vw',
 *   tablet: '50vw',
 *   desktop: '33vw',
 * })
 * // Returns: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 */
export function getResponsiveSizes(sizes: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  large?: string;
}): string {
  const parts: string[] = [];
  
  if (sizes.mobile) {
    parts.push(`(max-width: 768px) ${sizes.mobile}`);
  }
  if (sizes.tablet) {
    parts.push(`(max-width: 1200px) ${sizes.tablet}`);
  }
  if (sizes.desktop) {
    parts.push(sizes.desktop);
  }
  if (sizes.large && parts.length > 0) {
    parts[parts.length - 1] = sizes.large;
  }
  
  return parts.length > 0 ? parts.join(', ') : '100vw';
}

// ============================================================================
// Standard Size Constants
// ============================================================================

/**
 * Standard image size presets for consistent optimization
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 600, height: 400 },
  cardLarge: { width: 800, height: 533 },
  hero: { width: 1920, height: 1080 },
  heroMobile: { width: 1280, height: 720 },
  content: { width: 1200, height: 800 },
  avatar: { width: 96, height: 96 },
  avatarLarge: { width: 200, height: 200 },
} as const;

// ============================================================================
// Image Optimization Best Practices
// ============================================================================

/**
 * Guidelines for image uploads and optimization
 * Reference this when adding new images to the site
 */
export const IMAGE_GUIDELINES = {
  maxFileSize: {
    thumbnail: 30 * 1024, // 30KB
    card: 60 * 1024,      // 60KB
    hero: 120 * 1024,     // 120KB
    content: 250 * 1024,  // 250KB
  },
  maxDimensions: {
    thumbnail: 300,
    card: 800,
    hero: 1920,
    content: 1600,
  },
  formats: {
    preferred: 'webp',
    fallback: 'jpeg',
    icons: 'svg',
  },
  dpi: {
    web: 72,
    print: 300,
  },
  quality: {
    high: 90,
    standard: 80,
    thumbnail: 70,
  },
};
