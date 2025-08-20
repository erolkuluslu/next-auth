'use client';

import { useCallback, useEffect } from 'react';
import { useQueryState, parseAsString, parseAsFloat, parseAsInteger } from 'nuqs';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectFilters } from '@/lib/store/selectors';
import { updateFilters, SortOption } from '@/lib/store/slices/filtersSlice';

export function useProductFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  // URL State management
  const [categoryParam, setCategoryParam] = useQueryState('category', parseAsString);
  const [searchParam, setSearchParam] = useQueryState('search', parseAsString);
  const [sortParam, setSortParam] = useQueryState('sort', parseAsString.withDefault('newest'));
  const [minPriceParam, setMinPriceParam] = useQueryState('min_price', parseAsFloat);
  const [maxPriceParam, setMaxPriceParam] = useQueryState('max_price', parseAsFloat);
  const [minRatingParam, setMinRatingParam] = useQueryState('min_rating', parseAsInteger);

  // Sync URL params to Redux store on mount and when URL changes
  useEffect(() => {
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

    // Only update if different from current filters
    const hasChanges = 
      urlFilters.category !== filters.category ||
      urlFilters.searchQuery !== filters.searchQuery ||
      urlFilters.sortBy !== filters.sortBy ||
      urlFilters.priceRange.min !== filters.priceRange.min ||
      urlFilters.priceRange.max !== filters.priceRange.max ||
      urlFilters.minRating !== filters.minRating;

    if (hasChanges) {
      dispatch(updateFilters(urlFilters));
    }
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam, minRatingParam, dispatch]);

  // Sync Redux store to URL params when filters change
  useEffect(() => {
    if (filters.category !== categoryParam) {
      setCategoryParam(filters.category);
    }
    if (filters.searchQuery !== searchParam) {
      setSearchParam(filters.searchQuery || null);
    }
    if (filters.sortBy !== sortParam) {
      setSortParam(filters.sortBy);
    }
    if (filters.priceRange.min !== minPriceParam) {
      setMinPriceParam(filters.priceRange.min || null);
    }
    if (filters.priceRange.max !== maxPriceParam) {
      setMaxPriceParam(filters.priceRange.max || null);
    }
    if (filters.minRating !== minRatingParam) {
      setMinRatingParam(filters.minRating || null);
    }
  }, [filters]);

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