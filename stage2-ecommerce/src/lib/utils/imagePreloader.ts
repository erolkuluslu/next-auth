/**
 * Image preloader utility for critical performance optimization
 * Preloads critical images to improve perceived performance and Lighthouse scores
 */

import { Product } from '@/types/product';
import { transformImageUrl, isReliableImageUrl } from './imageUtils';

interface PreloadOptions {
  priority?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  as?: 'image' | 'fetch';
}

class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadedImages = new Set<string>();
  private preloadQueue: Array<{ url: string; options: PreloadOptions }> = [];
  private isProcessing = false;

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  /**
   * Preload a single image URL
   */
  async preloadImage(url: string, options: PreloadOptions = {}): Promise<boolean> {
    if (this.preloadedImages.has(url) || !this.isValidUrl(url)) {
      return true;
    }

    try {
      // Use link preload for critical images
      if (options.priority && typeof document !== 'undefined') {
        this.createLinkPreload(url, options);
      }

      // Fallback to Image object preloading
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          this.preloadedImages.add(url);
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${url}`);
          reject(new Error(`Failed to preload: ${url}`));
        };

        if (options.crossOrigin) {
          img.crossOrigin = options.crossOrigin;
        }

        img.src = url;
      });

      return true;
    } catch (error) {
      console.warn('Image preload failed:', error);
      return false;
    }
  }

  /**
   * Preload product images with intelligent prioritization
   */
  async preloadProductImages(
    products: Product[], 
    maxPreload: number = 4,
    priorityIndices: number[] = [0, 1]
  ): Promise<void> {
    const preloadPromises: Promise<boolean>[] = [];

    for (let i = 0; i < Math.min(products.length, maxPreload); i++) {
      const product = products[i];
      const isPriority = priorityIndices.includes(i);
      const imageUrl = transformImageUrl(product.image, product);
      
      // Only preload reliable URLs to avoid 404s
      if (isReliableImageUrl(imageUrl)) {
        preloadPromises.push(
          this.preloadImage(imageUrl, {
            priority: isPriority,
            crossOrigin: 'anonymous',
          })
        );
      }
    }

    // Execute preloads in parallel but don't block the main thread
    if (preloadPromises.length > 0) {
      this.processPreloadQueue();
      await Promise.allSettled(preloadPromises);
    }
  }

  /**
   * Preload featured product images for homepage
   */
  async preloadFeaturedImages(products: Product[]): Promise<void> {
    return this.preloadProductImages(products, 4, [0, 1, 2, 3]);
  }

  /**
   * Preload hero and critical above-the-fold images
   */
  async preloadCriticalImages(): Promise<void> {
    // For now, we don't have specific hero images to preload
    // This method is ready for future hero image implementation
    const criticalImageUrls: string[] = [];

    if (criticalImageUrls.length > 0) {
      const preloadPromises = criticalImageUrls.map(url =>
        this.preloadImage(url, { priority: true })
      );
      await Promise.allSettled(preloadPromises);
    }
  }

  /**
   * Create link preload elements for critical images
   */
  private createLinkPreload(url: string, options: PreloadOptions): void {
    if (typeof document === 'undefined') return;

    // Check if already preloaded via link element
    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = options.as || 'image';
    link.href = url;
    
    if (options.crossOrigin) {
      link.crossOrigin = options.crossOrigin;
    }

    // Add high priority for critical images
    if (options.priority) {
      link.setAttribute('fetchpriority', 'high');
    }

    document.head.appendChild(link);
  }

  /**
   * Process preload queue with throttling
   */
  private async processPreloadQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) return;

    this.isProcessing = true;

    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, 3); // Process 3 at a time
      
      await Promise.allSettled(
        batch.map(({ url, options }) => this.preloadImage(url, options))
      );

      // Small delay to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    this.isProcessing = false;
  }

  /**
   * Check if URL is valid for preloading
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get preload statistics for debugging
   */
  getStats(): { preloaded: number; queue: number } {
    return {
      preloaded: this.preloadedImages.size,
      queue: this.preloadQueue.length,
    };
  }

  /**
   * Clear all preloaded images (useful for cleanup)
   */
  clear(): void {
    this.preloadedImages.clear();
    this.preloadQueue = [];
  }
}

// Singleton instance
export const imagePreloader = ImagePreloader.getInstance();

// Convenience functions
export const preloadProductImages = (products: Product[], maxPreload?: number) =>
  imagePreloader.preloadProductImages(products, maxPreload);

export const preloadFeaturedImages = (products: Product[]) =>
  imagePreloader.preloadFeaturedImages(products);

export const preloadCriticalImages = () =>
  imagePreloader.preloadCriticalImages();

/**
 * Hook for React components to trigger preloading
 */
export function useImagePreloader() {
  return {
    preloadProducts: preloadProductImages,
    preloadFeatured: preloadFeaturedImages,
    preloadCritical: preloadCriticalImages,
    getStats: () => imagePreloader.getStats(),
  };
}

/**
 * Prefetch images for better navigation performance
 */
export function prefetchProductImage(product: Product): void {
  if (typeof window === 'undefined') return;

  const imageUrl = transformImageUrl(product.image, product);
  
  // Use native prefetch if available
  if ('prefetch' in document.createElement('link')) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = imageUrl;
    document.head.appendChild(link);
  } else {
    // Fallback to preloading
    imagePreloader.preloadImage(imageUrl, { priority: false });
  }
}

/**
 * Performance monitoring for image loading
 */
export class ImagePerformanceMonitor {
  private static loadTimes = new Map<string, number>();
  
  static startTiming(url: string): void {
    this.loadTimes.set(url, performance.now());
  }
  
  static endTiming(url: string): number | null {
    const startTime = this.loadTimes.get(url);
    if (startTime) {
      const loadTime = performance.now() - startTime;
      this.loadTimes.delete(url);
      
      // Log slow loading images in development
      if (process.env.NODE_ENV === 'development' && loadTime > 2000) {
        console.warn(`Slow image load: ${url} took ${loadTime.toFixed(2)}ms`);
      }
      
      return loadTime;
    }
    return null;
  }
  
  static getAverageLoadTime(): number {
    const times = Array.from(this.loadTimes.values());
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
}
