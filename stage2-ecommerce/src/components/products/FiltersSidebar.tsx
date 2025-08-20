'use client';

import { Button } from '@/components/ui';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { useAppDispatch } from '@/lib/store';
import { resetFilters } from '@/lib/store/slices/filtersSlice';

interface FiltersSidebarProps {
  className?: string;
  onClose?: () => void;
}

export function FiltersSidebar({ className, onClose }: FiltersSidebarProps) {
  const dispatch = useAppDispatch();

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 h-fit ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Filtreler
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Temizle
          </Button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-8">
        {/* Category Filter */}
        <div className="border-b border-gray-200 pb-6">
          <CategoryFilter />
        </div>

        {/* Price Range Filter */}
        <div className="border-b border-gray-200 pb-6">
          <PriceRangeFilter />
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>Filtreler otomatik uygulanır</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>Fiyatlar KDV dahildir</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersSidebar;