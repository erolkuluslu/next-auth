import { Container } from '@/components/ui';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export function FeaturedProductsSkeleton() {
  return (
    <section className="py-12 bg-gray-50">
      <Container>
        {/* Section Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-9 bg-gray-200 animate-pulse rounded mx-auto mb-4 w-80" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded mx-auto w-96" />
            <div className="h-4 bg-gray-200 animate-pulse rounded mx-auto w-80" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center">
          <div className="h-12 bg-gray-200 animate-pulse rounded mx-auto w-48" />
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProductsSkeleton;