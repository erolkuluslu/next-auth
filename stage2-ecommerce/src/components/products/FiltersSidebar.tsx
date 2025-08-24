'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { useProductFilters } from '@/hooks/useProductFilters';

interface FiltersSidebarProps {
  className?: string;
  onClose?: () => void;
}

export function FiltersSidebar({ className, onClose }: FiltersSidebarProps) {
  const t = useTranslations('common.filters');
  const { clearAllFilters } = useProductFilters();

  const handleResetFilters = () => {
    clearAllFilters();
  };

  return (
    <div className={`bg-white border-l border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 uppercase tracking-wide text-sm">
            {t('title')}
          </h3>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetFilters}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-150"
            >
              {t('clear')}
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                aria-label="Close filters"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-gray-100">
        {/* Category Filter */}
        <div className="p-6">
          <CategoryFilter />
        </div>

        {/* Price Range Filter */}
        <div className="p-6">
          <PriceRangeFilter />
        </div>

        {/* Additional Info */}
        <div className="px-6 py-4 bg-gray-50 text-xs text-gray-600">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <svg className="w-3 h-3 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="leading-tight">{t('autoApply')}</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-3 h-3 text-secondary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
                />
              </svg>
              <span className="leading-tight">{t('priceIncludesTax')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersSidebar;