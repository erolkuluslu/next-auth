import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'rounded' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
}

function Skeleton({
  className,
  variant = 'default',
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted',
        {
          'animate-pulse': animation === 'pulse',
          'animate-wave': animation === 'wave',
          'rounded-md': variant === 'rounded',
          'rounded-full': variant === 'circular',
        },
        className
      )}
      {...props}
    />
  );
}

// Pre-built skeleton components for common use cases
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" />
      
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-4 w-3/4" />
        
        {/* Category skeleton */}
        <Skeleton className="h-3 w-1/2" />
        
        {/* Price skeleton */}
        <Skeleton className="h-5 w-1/3" />
        
        {/* Rating skeleton */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="circular" className="h-4 w-4" />
          ))}
          <Skeleton className="h-3 w-8 ml-2" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image skeleton */}
      <div>
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      
      {/* Info skeleton */}
      <div className="space-y-6">
        {/* Title */}
        <Skeleton className="h-8 w-3/4" />
        
        {/* Category */}
        <Skeleton className="h-4 w-1/3" />
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="circular" className="h-5 w-5" />
          ))}
          <Skeleton className="h-4 w-16 ml-2" />
        </div>
        
        {/* Price */}
        <Skeleton className="h-10 w-1/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Add to cart button */}
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}

function ProductListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

function CategoryFilterSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

function PriceRangeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-4 w-4 mt-3" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export {
  Skeleton,
  ProductCardSkeleton,
  ProductDetailSkeleton,
  ProductListSkeleton,
  CategoryFilterSkeleton,
  PriceRangeSkeleton,
};