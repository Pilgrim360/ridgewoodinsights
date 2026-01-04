# Image Optimization Guidelines for Ridgewood Insights

This document provides comprehensive guidelines for optimizing images across the Ridgewood Insights website to improve Core Web Vitals (LCP, CLS) and overall performance.

## Overview

Image optimization is critical for:
- **LCP (Largest Contentful Paint):** Faster loading of hero images and main content
- **CLS (Cumulative Layout Shift):** Proper sizing to prevent layout shifts
- **Page Weight:** Reduced bandwidth and faster page loads
- **SEO:** Better performance scores from search engines

## Target Performance Metrics

| Image Type | Max File Size | Format(s) | Dimensions | Loading Strategy |
|------------|---------------|-----------|------------|------------------|
| Hero/LCP | 80-120KB | WebP + JPEG | 1920x1080 | Priority / Eager |
| Card Thumbnails | 40-60KB | WebP + JPEG | 600x400 | Lazy |
| Blog Post Featured | 150-250KB | WebP + JPEG | 1200x800 | Lazy (below fold) |
| Team Member Photos | 15-25KB | WebP | 200x200 | Lazy |
| Logos | 10-30KB | SVG preferred | Varies | Eager |
| Admin Thumbnails | 15-30KB | WebP + JPEG | 300x300 | Lazy |
| Admin Modal Preview | 80-150KB | WebP + JPEG | 800x600 | On-demand |

## Image Sources & Optimization Strategy

### 1. Unsplash Images (External)

All Unsplash images should use URL parameters for optimization.

#### URL Pattern
```
https://images.uns.com/photo-XXXXXX?w=XXXX&q=80&auto=format&fit=crop
```

#### Parameters Explained
- `w=XXXX` - Width in pixels (e.g., 800, 1200, 1600)
- `q=80` - Quality 1-100 (80 is optimal balance)
- `auto=format` - Automatically serves WebP/AVIF to supported browsers
- `fit=crop` - Crops to exact dimensions without distortion

#### Standard Unsplash Sizes
```typescript
// In src/lib/imageOptimization.ts
const UNSPLASH_SIZES = {
  thumbnail: { width: 300, height: 300 },
  card: { width: 800, height: 533 },      // 3:2 aspect ratio
  cardLarge: { width: 1200, height: 800 }, // 3:2 aspect ratio
  hero: { width: 1920, height: 1080 },     // 16:9 aspect ratio
  heroMobile: { width: 1280, height: 720 }, // 16:9 aspect ratio
};
```

#### Example Usage
```tsx
import { getUnsplashUrl } from '@/lib/imageOptimization';

// For card thumbnails (600x400)
const cardImage = getUnsplashUrl('photo-1554224155-6726b3ff858f', { width: 600 });

// For hero images (1920x1080)
const heroImage = getUnsplashUrl('photo-1554224155-6726b3ff858f', { width: 1920 });

// For responsive images
const responsiveUrls = getResponsiveUnsplashUrls('photo-1554224155-6726b3ff858f');
// Returns: { mobile, tablet, desktop, large }
```

### 2. Supabase Storage Images

For images uploaded via the admin media library:

#### Upload Requirements
- **Max dimensions:** 1600x1200px
- **Max file size:** 500KB (compress larger files before upload)
- **Preferred format:** JPEG or PNG (WebP will be auto-served)
- **DPI:** 72 (web standard, not 300)

#### Transformation Endpoints
Supabase Storage supports on-the-fly transformations:

```typescript
// Get thumbnail (300x300)
const thumbnail = getSupabaseThumbnailUrl(originalUrl);

// Get card-sized image (600x400)
const cardUrl = getSupabaseCardUrl(originalUrl);

// Custom size
const customUrl = getSupabaseImageUrl(originalUrl, { 
  width: 800, 
  height: 600, 
  resize: 'cover' 
});
```

### 3. Local Assets (/public)

For images stored in the repository:

#### File Naming Convention
```
original-name.jpg          // Original (keep for fallback)
original-name.webp         // WebP version (primary)
original-name-2x.webp      // Retina version (2x density)
```

#### Compression Guidelines
- **JPEG:** Quality 75-85%, subsampling enabled
- **PNG:** Use pngquant for color reduction
- **SVG:** Minimize with SVGO, remove metadata

#### Command Examples
```bash
# Convert JPEG to WebP with ImageMagick
convert source.jpg -quality 80 -resize 800x600 source.webp

# Convert with ffmpeg
ffmpeg -i source.jpg -q:v 80 -vf scale=800:-1 source.webp

# Optimize SVG with SVGO
npx svgo --folder public --recursive

# Bulk convert with ImageMagick
for f in public/images/*.jpg; do
  convert "$f" -quality 80 -resize 800x600 "${f%.jpg}.webp"
done
```

## Next.js Image Component Best Practices

### 1. Use `sizes` Attribute Correctly

Always specify the `sizes` attribute for responsive images:

```tsx
import Image from 'next/image';

// Card image - different sizes at different breakpoints
<Image
  src={image}
  alt="Description"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Featured image - larger at all breakpoints
<Image
  src={image}
  alt="Description"
  fill
  priority // Eager load for LCP
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Team member avatar - fixed size
<Image
  src={image}
  alt="Team member"
  width={96}
  height={96}
  sizes="96px"
/>
```

### 2. Priority Loading for LCP Images

Add `priority` prop to images that appear above the fold:

```tsx
// Hero image (LCP element)
<Image
  src="/hero-background.webp"
  alt="Business accounting services"
  fill
  priority // Eager load - critical for LCP
  sizes="100vw"
  className="object-cover"
/>

// Featured insight (above fold)
<Image
  src={insight.image}
  alt={insight.title}
  fill
  priority // Eager load
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 3. Use Placeholder Blur

Add blur placeholder for better perceived performance:

```tsx
import { getBlurDataUrl } from '@/lib/imageOptimization';

<Image
  src={image}
  alt="Description"
  fill
  placeholder="blur"
  blurDataURL={getBlurDataUrl(800, 600)}
/>
```

### 4. Aspect Ratio Containers

Prevent CLS by reserving space:

```tsx
// Using aspect-ratio utility
<div className="aspect-[16/10] relative">
  <Image
    src={image}
    alt="Description"
    fill
    className="object-cover"
  />
</div>

// Or specify dimensions for known sizes
<Image
  src={image}
  alt="Description"
  width={600}
  height={400}
  className="object-cover"
/>
```

## Hero Section Optimization

The hero section is the most critical for LCP. Optimization strategy:

```tsx
// 1. Use video for visual interest (already optimized via CDN)
<video
  autoPlay
  muted
  loop
  playsInline
  poster="/hero-poster.webp" // Fallback image
  className="..."
>
  <source src="https://cdn.pixabay.com/video/..." type="video/mp4" />
</video>

// 2. Add poster image for immediate display
// Create compressed WebP poster: 1920x1080, ~50KB

// 3. If using static background image:
<Image
  src="/hero-background.webp"
  alt="Business accounting"
  fill
  priority // CRITICAL for LCP
  sizes="100vw"
  className="object-cover"
/>
```

## Admin Media Library Optimization

### Upload Guidelines
1. Compress images before upload using TinyPNG, Squoosh, or ImageOptim
2. Max dimension: 1600px width
3. Max file size: 500KB
4. Format: JPEG for photos, PNG for graphics with transparency

### Thumbnail Generation
The media library should:
1. Generate 300x300px thumbnails on upload (or on-demand)
2. Cache thumbnails in browser (`Cache-Control` headers)
3. Lazy load thumbnails in gallery view

### On-Demand High-Res Preview
1. Load full-res only when user clicks to view
2. Use modal with 800x600px preview
3. Allow download of original if needed

## Caching Strategy (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Existing remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'nnnfcbmzygubyhufxwln.supabase.co',
      },
    ],
    // Minimum cache lifetime (seconds)
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    // Allowed formats
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers for local assets
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## SVGO Configuration for SVGs

Create `.svgo.config.js`:

```javascript
module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // Keep viewBox for scaling
        },
      },
    },
    'removeDimensions', // Remove width/height attributes
    'sortAttrs', // Sort attributes alphabetically
    {
      name: 'removeAttrs',
      params: {
        attrs: '(data-.*|id|class)', // Keep necessary attributes
      },
    },
  ],
};
```

Run SVGO:
```bash
npx svgo --config .svgo.config.js --folder public --recursive
```

## Performance Checklist

- [ ] Hero/LCP images use `priority` prop
- [ ] All images have `sizes` attribute
- [ ] Unsplash URLs include `w=`, `q=`, `auto=format`
- [ ] Supabase images use transformations
- [ ] Local images have WebP versions
- [ ] Images have appropriate aspect ratio containers
- [ ] Placeholder blur data URLs are set
- [ ] Video elements have poster images
- [ ] next.config.js has caching headers
- [ ] SVG files are optimized with SVGO

## Tools Reference

| Tool | Purpose | Usage |
|------|---------|-------|
| Squoosh.app | Web-based compression | https://squoosh.app |
| TinyPNG | PNG/JPEG compression | https://tinypng.com |
| SVGO | SVG optimization | `npx svgo --folder public --recursive` |
| ImageMagick | CLI image processing | `convert input.jpg -quality 80 output.webp` |
| @squoosh/lib-cli | Node.js image optimization | `npx @squoosh/lib-cli resize --to webp --quality 80` |
| Lighthouse | Performance auditing | Chrome DevTools > Lighthouse |

## Monitoring & Testing

1. **Lighthouse Audit:** Run in Chrome DevTools to check LCP score
2. **WebPageTest:** Detailed performance analysis
3. **Bundle Analyzer:** Check image bundle sizes
4. **DevTools Network Tab:** Verify image file sizes and load order

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-04 | Initial guidelines |

## References

- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Unsplash Image Parameters](https://unsplash.com/documentation#get-a-photo)
- [WebP Guide](https://developers.google.com/speed/webp)
- [Core Web Vitals](https://web.dev/vitals/)
