'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { 
  getProductImageUrl, 
  getProductImageFallback, 
  generateColorPlaceholder,
  transformImageUrl 
} from '@/lib/utils/imageUtils';

interface ProductImageProps {
  product: Product;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export function ProductImage({ 
  product, 
  className = '', 
  priority = false, 
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
}: ProductImageProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState(() => 
    transformImageUrl(getProductImageUrl(product), product)
  );
  const [imageLoading, setImageLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fallbackLevel, setFallbackLevel] = useState(0);

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
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        {/* Loading overlay */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={currentImageUrl}
        alt={product.title}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`object-contain transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={priority}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={generateColorPlaceholder(product)}
      />
      
      {/* Loading overlay */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
      
      {/* Fallback indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && fallbackLevel > 0 && (
        <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded text-[10px]">
          F{fallbackLevel}
        </div>
      )}
    </div>
  );
}

export default ProductImage;
