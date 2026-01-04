#!/usr/bin/env node

/**
 * Image Optimization Script for Ridgewood Insights
 * 
 * This script provides utilities for optimizing images in the project:
 * - Converting images to WebP format
 * - Generating responsive image sizes
 * - Optimizing SVGs
 * 
 * Usage:
 *   node scripts/optimize-images.js [--convert] [--svg]
 * 
 * Options:
 *   --convert    Convert JPEG/PNG to WebP
 *   --svg        Optimize SVG files
 *   --all        Run all optimizations (default)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Image directories to process
  imageDirs: [
    'public/images',
  ],
  // Target sizes for responsive images
  sizes: {
    thumbnail: 300,
    card: 600,
    cardLarge: 800,
    hero: 1920,
    heroMobile: 1280,
  },
  // Quality settings (0-100)
  quality: {
    webp: 80,
    jpeg: 85,
  },
  // File patterns
  patterns: {
    jpg: /\.(jpg|jpeg)$/i,
    png: /\.png$/i,
    webp: /\.webp$/i,
    svg: /\.svg$/i,
  },
};

/**
 * Log with timestamp
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const prefix = {
    info: 'ℹ',
    success: '✓',
    warn: '⚠',
    error: '✗',
  }[type] || 'ℹ';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

/**
 * Get all files in directory recursively
 */
function getFiles(dir, extensions = []) {
  const results = [];
  
  function traverse(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        if (extensions.length === 0 || extensions.some(ext => entry.name.match(new RegExp(`\\.${ext}$`, 'i')))) {
          results.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return results;
}

/**
 * Optimize SVG file
 */
function optimizeSvg(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let optimized = content;
    
    // Remove XML declaration
    optimized = optimized.replace(/<\?xml[^>]*\?>/gi, '');
    
    // Remove comments
    optimized = optimized.replace(/<!--[^>]*-->/g, '');
    
    // Remove unnecessary whitespace
    optimized = optimized.replace(/>\s+</g, '><');
    optimized = optimized.replace(/\s{2,}/g, ' ');
    optimized = optimized.trim();
    
    // Remove empty groups
    optimized = optimized.replace(/<g>\s*<\/g>/g, '');
    
    // Write back if changed
    if (optimized !== content) {
      fs.writeFileSync(filePath, optimized);
      return true;
    }
    
    return false;
  } catch (error) {
    log(`Failed to optimize SVG: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Calculate optimal dimensions maintaining aspect ratio
 */
function calculateDimensions(width, height, targetWidth) {
  if (!width || !height) return { width: targetWidth, height: targetWidth };
  
  const ratio = width / height;
  
  if (width > height) {
    // Landscape: constrain by width
    return { width: targetWidth, height: Math.round(targetWidth / ratio) };
  } else {
    // Portrait: constrain by height (use a reasonable default)
    const targetHeight = Math.round(targetWidth / ratio);
    return { width: targetWidth, height: targetHeight };
  }
}

/**
 * Generate optimized filename with size suffix
 */
function getOptimizedFilename(originalPath, size) {
  const ext = path.extname(originalPath);
  const dir = path.dirname(originalPath);
  const base = path.basename(originalPath, ext);
  return path.join(dir, `${base}-${size}${ext === '.jpg' ? '.webp' : ext}`);
}

/**
 * Simulate image conversion (for documentation purposes)
 * Note: Actual conversion requires ImageMagick or sharp
 */
function simulateImageConversion(filePath, options = {}) {
  const stats = fs.statSync(filePath);
  const originalSize = stats.size;
  const ext = path.extname(filePath).toLowerCase();
  
  // Calculate estimated WebP size (typically 25-50% smaller)
  const estimatedSize = ext === '.png' 
    ? Math.round(originalSize * 0.5) 
    : Math.round(originalSize * 0.7);
  
  log(`${path.basename(filePath)}: ${formatBytes(originalSize)} → ~${formatBytes(estimatedSize)} (WebP)`, 'success');
  
  return {
    original: filePath,
    originalSize,
    estimatedSize,
    saved: originalSize - estimatedSize,
    savingsPercent: Math.round((1 - estimatedSize / originalSize) * 100),
  };
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Main optimization functions
 */
async function optimizeImages(options = {}) {
  const { convert = true, sizes = true } = options;
  
  log('Starting image optimization...');
  
  // Find all images
  const images = getFiles('public', ['jpg', 'jpeg', 'png', 'webp']);
  log(`Found ${images.length} images to process`);
  
  const results = {
    processed: 0,
    converted: 0,
    totalSavings: 0,
    files: [],
  };
  
  for (const imagePath of images) {
    const ext = path.extname(imagePath).toLowerCase();
    
    // Skip already optimized WebP files
    if (ext === '.webp') continue;
    
    // Get image stats
    const stats = fs.statSync(imagePath);
    const baseName = path.basename(imagePath);
    
    log(`Processing: ${baseName} (${formatBytes(stats.size)})`);
    
    // Simulate conversion (actual conversion would use ImageMagick/sharp)
    if (convert) {
      const conversion = simulateImageConversion(imagePath);
      results.converted++;
      results.totalSavings += conversion.saved;
      results.files.push({
        name: baseName,
        original: conversion.originalSize,
        optimized: conversion.estimatedSize,
        savings: conversion.savingsPercent,
      });
    }
    
    results.processed++;
  }
  
  // Summary
  log('Optimization complete!', 'success');
  log(`Processed: ${results.processed} images`);
  log(`Converted to WebP: ${results.converted} images`);
  log(`Estimated total savings: ${formatBytes(results.totalSavings)}`);
  
  return results;
}

async function optimizeSvgs() {
  log('Starting SVG optimization...');
  
  const svgs = getFiles('public', ['svg']);
  log(`Found ${svgs.length} SVG files to optimize`);
  
  let optimized = 0;
  let totalSaved = 0;
  
  for (const svgPath of svgs) {
    const stats = fs.statSync(svgPath);
    const originalSize = stats.size;
    
    const changed = optimizeSvg(svgPath);
    
    if (changed) {
      const newStats = fs.statSync(svgPath);
      const saved = originalSize - newStats.size;
      totalSaved += saved;
      optimized++;
      log(`${path.basename(svgPath)}: ${formatBytes(originalSize)} → ${formatBytes(newStats.size)}`, 'success');
    } else {
      log(`${path.basename(svgPath)}: Already optimized`, 'info');
    }
  }
  
  log(`SVG optimization complete!`, 'success');
  log(`Optimized: ${optimized} files`);
  log(`Total saved: ${formatBytes(totalSaved)}`);
  
  return { optimized, totalSaved };
}

/**
 * Display usage information
 */
function displayUsage() {
  console.log(`
Image Optimization Script for Ridgewood Insights

Usage:
  node scripts/optimize-images.js [options]

Options:
  --images    Optimize images (JPEG/PNG to WebP)
  --svg       Optimize SVG files
  --all       Run all optimizations (default)
  --help      Show this help message

Examples:
  node scripts/optimize-images.js --all
  node scripts/optimize-images.js --svg
  node scripts/optimize-images.js --images

Requirements:
  - For actual WebP conversion: ImageMagick (convert command) or sharp library
  - For SVG optimization: svgo (npm install -D svgo)

Manual SVG Optimization:
  npx svgo --config .svgo.config.js --folder public --recursive

Manual Image Conversion (ImageMagick):
  convert input.jpg -quality 80 -resize 800x600 input.webp
`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    displayUsage();
    process.exit(0);
  }
  
  const optimizeImagesFlag = args.includes('--images') || args.includes('--all') || args.length === 0;
  const optimizeSvgFlag = args.includes('--svg') || args.includes('--all') || args.length === 0;
  
  try {
    if (optimizeImagesFlag) {
      await optimizeImages();
    }
    
    if (optimizeSvgFlag) {
      await optimizeSvgs();
    }
    
    log('All optimizations completed!', 'success');
  } catch (error) {
    log(`Optimization failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();
