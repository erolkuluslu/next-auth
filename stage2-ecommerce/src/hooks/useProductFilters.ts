'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useQueryState, parseAsString, parseAsFloat, parseAsInteger } from 'nuqs';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectFilters } from '@/lib/store/selectors';
import { updateFilters, SortOption } from '@/lib/store/slices/filtersSlice';

export function useProductFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  
  // Track initialization and prevent loops
  const isInitializedRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // URL State management
  const [categoryParam, setCategoryParam] = useQueryState('category', parseAsString);
  const [searchParam, setSearchParam] = useQueryState('search', parseAsString);
  const [sortParam, setSortParam] = useQueryState('sort', parseAsString.withDefault('newest'));
  const [minPriceParam, setMinPriceParam] = useQueryState('min_price', parseAsFloat);
  const [maxPriceParam, setMaxPriceParam] = useQueryState('max_price', parseAsFloat);
  const [minRatingParam, setMinRatingParam] = useQueryState('min_rating', parseAsInteger);

  // Single source of truth: URL params control Redux store
  useEffect(() => {
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce updates to prevent rapid-fire dispatches
    updateTimeoutRef.current = setTimeout(() => {
      try {
        const urlFilters = {
          category: categoryParam,
          searchQuery: searchParam || '',
          sortBy: (sortParam as SortOption) || 'newest',
          priceRange: {
            min: minPriceParam || 0,
            max: maxPriceParam || 1000,
          },
          minRating: minRatingParam || 0,
        };

        // Only update if different from current filters or on first load
        const hasChanges = !isInitializedRef.current ||
          urlFilters.category !== filters.category ||
          urlFilters.searchQuery !== filters.searchQuery ||
          urlFilters.sortBy !== filters.sortBy ||
          urlFilters.priceRange.min !== filters.priceRange.min ||
          urlFilters.priceRange.max !== filters.priceRange.max ||
          urlFilters.minRating !== filters.minRating;

        if (hasChanges) {
          dispatch(updateFilters(urlFilters));
          isInitializedRef.current = true;
        }
      } catch (error) {
        console.error('Error updating filters:', error);
      }
    }, 100);

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam, minRatingParam, dispatch]);

  // Remove the second useEffect that was causing the loop

  // Helper functions
  const updateCategory = useCallback((category: string | null) => {
    setCategoryParam(category);
  }, [setCategoryParam]);

  const updateSearch = useCallback((search: string) => {
    setSearchParam(search || null);
  }, [setSearchParam]);

  const updateSort = useCallback((sort: SortOption) => {
    setSortParam(sort);
  }, [setSortParam]);

  const updatePriceRange = useCallback((min: number, max: number) => {
    setMinPriceParam(min || null);
    setMaxPriceParam(max || null);
  }, [setMinPriceParam, setMaxPriceParam]);

  const updateMinRating = useCallback((rating: number) => {
    setMinRatingParam(rating || null);
  }, [setMinRatingParam]);

  const clearAllFilters = useCallback(() => {
    setCategoryParam(null);
    setSearchParam(null);
    setSortParam('newest');
    setMinPriceParam(null);
    setMaxPriceParam(null);
    setMinRatingParam(null);
  }, [setCategoryParam, setSearchParam, setSortParam, setMinPriceParam, setMaxPriceParam, setMinRatingParam]);

  return {
    filters,
    updateCategory,
    updateSearch,
    updateSort,
    updatePriceRange,
    updateMinRating,
    clearAllFilters,
    // URL params for reading
    urlParams: {
      category: categoryParam,
      search: searchParam,
      sort: sortParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      minRating: minRatingParam,
    },
  };
}

export default useProductFilters;