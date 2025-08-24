'use client';

import { useEffect, useState, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Container, Button, ErrorBoundary } from '@/components/ui';
import { SearchFilter } from '@/components/products/SearchFilter';
import { SortSelect } from '@/components/products/SortSelect';
import { FiltersSidebar } from '@/components/products/FiltersSidebar';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setProducts, setCategories } from '@/lib/store/slices/productsSlice';
import { selectSortedProducts, selectProductsLoading } from '@/lib/store/selectors';
import { useProductFilters } from '@/hooks/useProductFilters';
import { Product } from '@/types/product';

interface ProductsPageClientProps {
  locale: string;
  initialProducts: Product[];
  initialCategories: string[];
}

function ProductsPageContent({ locale, initialProducts, initialCategories }: ProductsPageClientProps) {
  const t = useTranslations('common.filters');
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectSortedProducts);
  const loading = useAppSelector(selectProductsLoading);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const isTurkish = locale === 'tr';
  
  // Initialize URL state management
  const { filters } = useProductFilters();

  // Initialize store with server-side data
  useEffect(() => {
    dispatch(setProducts(initialProducts));
    dispatch(setCategories(initialCategories));
  }, [dispatch, initialProducts, initialCategories]);

  const productCount = products.length;

  return (
    <div className="products-page min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="products-page__breadcrumb flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href={`/${locale}`} className="hover:text-gray-900">
            {isTurkish ? 'Ana Sayfa' : 'Home'}
          </a>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900">
            {isTurkish ? 'Ürünler' : 'Products'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isTurkish ? 'Tüm Ürünler' : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {isTurkish 
              ? 'Geniş ürün yelpazemizi keşfedin ve en uygun fiyatlarla alışveriş yapın.'
              : 'Discover our wide range of products and shop at the best prices.'
            }
          </p>
        </div>

        {/* Search and Sort Controls */}
        <ErrorBoundary fallback={
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600">Unable to load search and filter controls. Please refresh the page.</p>
          </div>
        }>
          <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <SearchFilter />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between lg:justify-end space-x-4">
              {/* Product Count */}
              <div className="text-sm text-gray-600">
                {loading ? (
                  <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <span>
                    {productCount} {t('foundProducts')}
                  </span>
                )}
              </div>

              {/* Sort */}
              <SortSelect />

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" 
                  />
                </svg>
                {t('title')}
              </Button>
            </div>
          </div>
        </ErrorBoundary>

        {/* Main Content */}
        <main className="products-page__main">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="products-page__sidebar hidden lg:block">
              <ErrorBoundary fallback={
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-600">Filters temporarily unavailable</p>
                </div>
              }>
                <FiltersSidebar />
              </ErrorBoundary>
            </aside>

            {/* Products Grid */}
            <section className="products-page__content lg:col-span-3">
              <ErrorBoundary fallback={
                <div className="p-8 text-center">
                  <p className="text-gray-600">Unable to load products. Please try refreshing the page.</p>
                </div>
              }>
                <ProductsGrid locale={locale} />
              </ErrorBoundary>
            </section>
          </div>
        </main>

        {/* Mobile Filters Modal */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setFiltersOpen(false)}
            />
            
            {/* Modal */}
            <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl">
              <div className="p-6 h-full overflow-y-auto">
                <FiltersSidebar onClose={() => setFiltersOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export function ProductsPageClient(props: ProductsPageClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {props.locale === 'tr' ? 'Ürünler yükleniyor...' : 'Loading products...'}
          </p>
        </div>
      </div>
    }>
      <ProductsPageContent {...props} />
    </Suspense>
  );
}

export default ProductsPageClient;