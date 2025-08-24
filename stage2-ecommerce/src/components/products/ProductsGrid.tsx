'use client';

import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { selectSortedProducts, selectProductsLoading, selectProductsError } from '@/lib/store/selectors';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Product } from '@/types/product';

interface ProductsGridProps {
  locale: string;
  className?: string;
}

export function ProductsGrid({ locale, className }: ProductsGridProps) {
  const t = useTranslations('common.products');
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectSortedProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.892-.833-2.662 0L3.152 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            {t('loadError')}
          </h3>
          <p className="text-red-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <main className="products-main">
        <section className={`products-container grid grid-cols-1 md:grid-cols-2 auto-rows-fr items-stretch ${className}`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <article key={index} className="product-item flex">
              <ProductCardSkeleton />
            </article>
          ))}
        </section>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t('notFound')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('noResults')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="products-main">
      <section className={`products-container grid grid-cols-1 md:grid-cols-2 auto-rows-fr items-stretch ${className}`}>
        {products.map((product) => (
          <article key={product.id} className="product-item flex">
            <ProductCard
              product={product}
              locale={locale}
              onAddToCart={handleAddToCart}
              className="w-full"
            />
          </article>
        ))}
      </section>
    </main>
  );
}

export default ProductsGrid;