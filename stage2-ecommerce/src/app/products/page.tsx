'use client';

import { useEffect, useState, Suspense } from 'react';
import { Container, Button } from '@/components/ui';
import { SearchFilter } from '@/components/products/SearchFilter';
import { SortSelect } from '@/components/products/SortSelect';
import { FiltersSidebar } from '@/components/products/FiltersSidebar';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchProducts, fetchCategories } from '@/lib/store/slices/productsSlice';
import { selectSortedProducts, selectProductsLoading } from '@/lib/store/selectors';
import { useProductFilters } from '@/hooks/useProductFilters';

function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectSortedProducts);
  const loading = useAppSelector(selectProductsLoading);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Initialize URL state management
  const { filters } = useProductFilters();

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const productCount = products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tüm Ürünler
          </h1>
          <p className="text-gray-600">
            Geniş ürün yelpazemizi keşfedin ve en uygun fiyatlarla alışveriş yapın.
          </p>
        </div>

        {/* Search and Sort Controls */}
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
                <span>{productCount} ürün bulundu</span>
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
              Filtreler
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <FiltersSidebar />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductsGrid />
          </div>
        </div>

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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}