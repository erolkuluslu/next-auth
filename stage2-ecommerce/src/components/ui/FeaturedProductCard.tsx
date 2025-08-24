'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { formatPrice } from '@/lib/utils/api';

interface FeaturedProductCardProps {
  product: Product;
  locale: string;
  onAddToCart?: (product: Product) => void;
  loading?: boolean;
  className?: string;
  priority?: boolean;
  index?: number;
  featured?: 'bestseller' | 'new' | 'limited' | 'popular';
}

export function FeaturedProductCard({ 
  product, 
  locale,
  onAddToCart, 
  loading = false,
  className = '',
  priority = false,
  index = 0,
  featured = 'popular'
}: FeaturedProductCardProps) {
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

  const getFeaturedBadge = (type: string) => {
    const badges = {
      bestseller: { text: 'Best Seller', color: 'bg-gradient-to-r from-green-500 to-green-600 text-white' },
      new: { text: 'New Arrival', color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' },
      limited: { text: 'Limited Edition', color: 'bg-gradient-to-r from-red-500 to-red-600 text-white' },
      popular: { text: 'Popular Choice', color: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' },
    };
    return badges[type as keyof typeof badges] || badges.popular;
  };

  const featuredBadge = getFeaturedBadge(featured);

  if (loading) {
    return (
      <div className={`animate-pulse w-80 flex-shrink-0 ${className}`}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="aspect-[4/5] bg-gray-200" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-6 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group w-80 sm:w-80 md:w-80 lg:w-80 featured-card-mobile flex-shrink-0 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 overflow-hidden touch-manipulation ${className}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Large Featured Product Image */}
      <div className="relative">
        <Link href={`/${locale}/products/${product.id}`} className="block">
          <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <OptimizedImage
              product={product}
              fill
              className="p-8 group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
              quality={priority ? 95 : 90}
              loading={priority ? "eager" : "lazy"}
              placeholder="blur"
              priority={priority}
            />
            
            {/* Featured Badge - Premium Position */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full shadow-lg ${featuredBadge.color}`}>
                {featuredBadge.text}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Enhanced Product Details */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Rating - Prominent */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {getRatingStars(product.rating.rate)}
          </div>
          <span className="text-sm font-bold text-amber-600">
            {product.rating.rate}
          </span>
          <span className="text-sm text-gray-500">
            ({product.rating.count} reviews)
          </span>
        </div>

        {/* Title - Featured Size */}
        <Link href={`/${locale}/products/${product.id}`}>
          <h3 className="font-bold text-xl text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Price - Large and Prominent */}
        <div className="mb-6">
          <div className="text-3xl font-extrabold text-gray-900">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Large Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!onAddToCart}
          className="w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white py-4 px-6 font-bold text-lg hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3 rounded-xl group/btn"
        >
          <svg className="w-6 h-6 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5A1 1 0 006 20h12a1 1 0 001-1v0a1 1 0 00-1-1H6m0 0L5 8H3" 
            />
          </svg>
          <span>{t('addToCart')}</span>
        </button>
      </div>
    </div>
  );
}

export default FeaturedProductCard;