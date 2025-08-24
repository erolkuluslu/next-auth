'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types/product';
import { 
  getProductImageUrl, 
  getProductImageFallback, 
  generateColorPlaceholder,
  transformImageUrl 
} from '@/lib/utils/imageUtils';

interface OptimizedImageProps {
  product: Product;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({ 
  product, 
  className = '', 
  priority = false, 
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
  quality = 85,
  placeholder = 'blur',
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState(() => 
    transformImageUrl(getProductImageUrl(product), product)
  );
  const [imageLoading, setImageLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fallbackLevel, setFallbackLevel] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Reset states when product changes
  useEffect(() => {
    setCurrentImageUrl(transformImageUrl(getProductImageUrl(product), product));
    setImageLoading(true);
    setHasError(false);
    setFallbackLevel(0);
  }, [product]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageLoading(false);
    
    if (fallbackLevel === 0) {
      // First fallback: Category-based Unsplash image
      setCurrentImageUrl(getProductImageFallback(product));
      setFallbackLevel(1);
    } else if (fallbackLevel === 1) {
      // Second fallback: Generated colored placeholder
      setCurrentImageUrl(generateColorPlaceholder(product));
      setFallbackLevel(2);
    } else {
      // Final fallback: Show error state
      setHasError(true);
    }
    
    onError?.();
  };

  // Generate low-quality placeholder for blur effect
  const blurDataURL = generateColorPlaceholder(product);

  if (hasError) {
    return (
      <div ref={imgRef} className={`flex items-center justify-center bg-gray-50 text-gray-400 w-full h-full ${className}`}>
        <div className="text-center p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {product.category}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative w-full h-full ${className}`}>
      {isIntersecting ? (
        <Image
          src={currentImageUrl}
          alt={product.title}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`object-contain transition-all duration-500 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={priority}
          loading={loading}
          sizes={sizes}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      ) : (
        // Placeholder while not in viewport
        <div 
          className="w-full h-full bg-gray-50 animate-pulse flex items-center justify-center"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
          }}
        />
      )}
      
      {/* Loading overlay */}
      {imageLoading && isIntersecting && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Performance indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1 left-1 flex gap-1">
          {!isIntersecting && (
            <div className="bg-orange-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">
              LAZY
            </div>
          )}
          {fallbackLevel > 0 && (
            <div className="bg-yellow-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">
              F{fallbackLevel}
            </div>
          )}
          {priority && (
            <div className="bg-green-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">
              P
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
