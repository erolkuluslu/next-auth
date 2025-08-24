'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { selectPriceRange, selectPriceRangeFromProducts } from '@/lib/store/selectors';
import { setPriceRange } from '@/lib/store/slices/filtersSlice';
import { formatPrice } from '@/lib/utils/api';

export function PriceRangeFilter() {
  const t = useTranslations('common.filters');
  const dispatch = useAppDispatch();
  const priceRange = useAppSelector(selectPriceRange);
  const availablePriceRange = useAppSelector(selectPriceRangeFromProducts);
  
  // Local state for input values (controlled by user input)
  const [localMin, setLocalMin] = useState(priceRange.min.toString());
  const [localMax, setLocalMax] = useState(priceRange.max.toString());
  
  // Debounce timers
  const minTimerRef = useRef<NodeJS.Timeout>();
  const maxTimerRef = useRef<NodeJS.Timeout>();

  // Debounced Redux update for minimum value
  const debouncedMinUpdate = useCallback((value: string) => {
    if (minTimerRef.current) {
      clearTimeout(minTimerRef.current);
    }
    
    minTimerRef.current = setTimeout(() => {
      const numValue = parseFloat(value) || 0;
      if (numValue >= 0 && numValue <= priceRange.max && numValue !== priceRange.min) {
        dispatch(setPriceRange({ min: numValue, max: priceRange.max }));
      }
    }, 500);
  }, [dispatch, priceRange.min, priceRange.max]);

  // Debounced Redux update for maximum value
  const debouncedMaxUpdate = useCallback((value: string) => {
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
    }
    
    maxTimerRef.current = setTimeout(() => {
      const numValue = parseFloat(value) || availablePriceRange.max;
      if (numValue >= priceRange.min && numValue !== priceRange.max) {
        dispatch(setPriceRange({ min: priceRange.min, max: numValue }));
      }
    }, 500);
  }, [dispatch, priceRange.min, priceRange.max, availablePriceRange.max]);

  const handleMinChange = useCallback((value: string) => {
    setLocalMin(value);
    debouncedMinUpdate(value);
  }, [debouncedMinUpdate]);

  const handleMaxChange = useCallback((value: string) => {
    setLocalMax(value);
    debouncedMaxUpdate(value);
  }, [debouncedMaxUpdate]);

  const handleReset = useCallback(() => {
    // Clear any pending debounced updates
    if (minTimerRef.current) {
      clearTimeout(minTimerRef.current);
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
    }
    
    // Update both local state and Redux
    setLocalMin(availablePriceRange.min.toString());
    setLocalMax(availablePriceRange.max.toString());
    dispatch(setPriceRange(availablePriceRange));
  }, [dispatch, availablePriceRange]);

  // Sync local state when Redux state changes externally (e.g., reset filters)
  // Only update if the difference is significant to avoid loops
  useEffect(() => {
    const minStr = priceRange.min.toString();
    const maxStr = priceRange.max.toString();
    
    // Only update local state if Redux state differs and we don't have pending updates
    if (!minTimerRef.current && localMin !== minStr) {
      setLocalMin(minStr);
    }
    if (!maxTimerRef.current && localMax !== maxStr) {
      setLocalMax(maxStr);
    }
  }, [priceRange.min, priceRange.max, localMin, localMax]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (minTimerRef.current) {
        clearTimeout(minTimerRef.current);
      }
      if (maxTimerRef.current) {
        clearTimeout(maxTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {t('priceRange')}
        </label>
        <button
          onClick={handleReset}
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          {t('reset')}
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder={t('minPrice')}
            value={localMin}
            onChange={(e) => handleMinChange(e.target.value)}
            className="text-sm"
            min={0}
            max={availablePriceRange.max}
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder={t('maxPrice')}
            value={localMax}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="text-sm"
            min={priceRange.min}
          />
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            {t('selected')}: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
          </div>
          <div>
            {t('available')}: {formatPrice(availablePriceRange.min)} - {formatPrice(availablePriceRange.max)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilter;