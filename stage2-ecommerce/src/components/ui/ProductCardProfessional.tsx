'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { formatPrice } from '@/lib/utils/api';

interface ProductCardProfessionalProps {
  product: Product;
  locale: string;
  onAddToCart?: (product: Product) => void;
  loading?: boolean;
  className?: string;
  priority?: boolean;
  index?: number;
}

export function ProductCardProfessional({ 
  product, 
  locale,
  onAddToCart, 
  loading = false,
  className = '',
  priority = false,
  index = 0
}: ProductCardProfessionalProps) {
  const t = useTranslations('common.products');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-amber-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-star-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-star-${product.id})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="card-modern">
          <div className="aspect-[4/5] bg-gray-200 rounded-t-2xl" />
          <div className="p-6 space-y-4">
            <div className="h-3 bg-gray-200 rounded w-20" />
            <div className="h-5 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group card-modern h-full transition-all duration-300 hover:scale-[1.02] animate-fade-in-up touch-manipulation product-card-light ${className}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Enhanced Product Image - Clean Design */}
      <div className="relative">
        <Link href={`/${locale}/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gray-50 border-b border-gray-100">
            <div className="absolute inset-6 flex items-center justify-center">
              <OptimizedImage
                product={product}
                fill
                className="group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                quality={priority ? 95 : 85}
                loading={priority ? "eager" : "lazy"}
                placeholder="blur"
                priority={priority}
              />
            </div>
          </div>
        </Link>
        
        {/* Category Badge - Positioned in Content Area */}
        <div className="absolute top-4 left-4">
          <span className="badge-modern badge-category backdrop-blur-sm bg-white/95 shadow-sm border border-white/20">
            {product.category}
          </span>
        </div>
      </div>

      {/* Enhanced Product Details - Simplified */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Rating - Clean Layout with Proper Spacing */}
        <div className="flex items-center justify-start gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {getRatingStars(product.rating.rate)}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {product.rating.rate}
          </span>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            ({product.rating.count} reviews)
          </span>
        </div>

        {/* Title - Enhanced Typography */}
        <Link href={`/${locale}/products/${product.id}`}>
          <h3 className="heading-primary text-lg mb-4 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200 leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Price and Button - Clear Hierarchy */}
        <div className="mt-auto">
          <div className="text-2xl font-bold text-gray-900 mb-4">
            {formatPrice(product.price)}
          </div>

          {/* Simplified Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!onAddToCart}
            className="button-modern button-primary w-full py-3.5 px-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            <svg className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5A1 1 0 006 20h12a1 1 0 001-1v0a1 1 0 00-1-1H6m0 0L5 8H3" />
            </svg>
            <span>{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCardProfessional;
