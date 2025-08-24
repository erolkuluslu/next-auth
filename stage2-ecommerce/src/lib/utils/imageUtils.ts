/**
 * Image utilities for handling product images with fallbacks
 * Solves 404 errors from FakeStore API images
 */

import { Product } from '@/types/product';

// Generate a consistent color based on text (for consistent placeholders)
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

// Category-based placeholder images using Unsplash with fallback
export const categoryImageMap: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=400&h=400&fit=crop&crop=center',
  ],
  jewelery: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&crop=center',
  ],
  "men's clothing": [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop&crop=center',
  ],
  "women's clothing": [
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1485968579580-b6d72834e3ab?w=400&h=400&fit=crop&crop=center',
  ],
};

// Generate placeholder image URL based on category and product ID
export function getCategoryPlaceholder(product: Product): string {
  // Ensure product has required properties
  if (!product || !product.category || !product.id) {
    return generateColorPlaceholder(product || { id: 1, title: 'Product', category: 'electronics' } as Product);
  }
  
  const categoryImages = categoryImageMap[product.category] || categoryImageMap.electronics;
  // Use product ID to consistently select the same image for the same product
  const imageIndex = (product.id - 1) % categoryImages.length;
  return categoryImages[imageIndex];
}

// Generate a simple colored placeholder as ultimate fallback
export function generateColorPlaceholder(product: Product): string {
  // Provide safe defaults for missing product data
  const title = product?.title || 'Product';
  const category = product?.category || 'general';
  
  const color = stringToColor(title + category);
  const firstLetter = title.charAt(0).toUpperCase();
  
  // Create a data URL for a simple colored square with the first letter
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${color}"/>
      <text x="200" y="220" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="120" font-weight="bold">${firstLetter}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Image validation utility
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Get optimized image URL with fallback chain
export function getProductImageUrl(product: Product): string {
  // First try: Original FakeStore API image
  // If it fails, the Image component will handle the fallback
  if (!product || !product.image) {
    return getCategoryPlaceholder(product);
  }
  return product.image;
}

// Get fallback image URL for when original fails
export function getProductImageFallback(product: Product): string {
  // Try category-based Unsplash image first
  try {
    return getCategoryPlaceholder(product);
  } catch {
    // Ultimate fallback: generated colored placeholder
    return generateColorPlaceholder(product);
  }
}

// Enhanced image props for Next.js Image component
export function getImageProps(product: Product) {
  return {
    src: getProductImageUrl(product),
    alt: product.title,
    placeholder: 'blur' as const,
    blurDataURL: generateColorPlaceholder(product),
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
    priority: false,
  };
}

// Transform FakeStore API image URL to potentially more reliable sources
export function transformImageUrl(originalUrl: string, product: Product): string {
  // Check if originalUrl is valid
  if (!originalUrl || typeof originalUrl !== 'string') {
    // Use fallback system for invalid URLs
    return getCategoryPlaceholder(product);
  }
  
  // If the original URL is from FakeStore API and contains common patterns
  if (originalUrl.includes('fakestoreapi.com')) {
    // Replace with our fallback system
    return getCategoryPlaceholder(product);
  }
  
  // For other URLs, try to optimize them
  if (originalUrl.includes('unsplash.com')) {
    // Add optimization parameters to Unsplash URLs
    const url = new URL(originalUrl);
    url.searchParams.set('w', '400');
    url.searchParams.set('h', '400');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('crop', 'center');
    return url.toString();
  }
  
  return originalUrl;
}

// React hook for handling image loading states
export function useImageFallback(product: Product) {
  return {
    primary: getProductImageUrl(product),
    fallback: getProductImageFallback(product),
    ultimate: generateColorPlaceholder(product),
  };
}

/**
 * Enhanced image component props with multiple fallback levels
 */
export interface EnhancedImageProps {
  product: Product;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

/**
 * Configuration for image optimization
 */
export const imageConfig = {
  domains: [
    'fakestoreapi.com',
    'images.unsplash.com',
    'unsplash.com',
  ],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp'],
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

/**
 * Utility to check if an image URL is likely to work
 */
export function isReliableImageUrl(url: string): boolean {
  // Unsplash images are generally reliable
  if (url.includes('unsplash.com')) return true;
  
  // Data URLs are reliable
  if (url.startsWith('data:')) return true;
  
  // FakeStore API images have been unreliable
  if (url.includes('fakestoreapi.com')) return false;
  
  // Default: assume it might work
  return true;
}
