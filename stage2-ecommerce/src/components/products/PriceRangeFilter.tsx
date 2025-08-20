'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { selectPriceRange, selectPriceRangeFromProducts } from '@/lib/store/selectors';
import { setPriceRange } from '@/lib/store/slices/filtersSlice';
import { formatPrice } from '@/lib/utils/api';

export function PriceRangeFilter() {
  const dispatch = useAppDispatch();
  const priceRange = useAppSelector(selectPriceRange);
  const availablePriceRange = useAppSelector(selectPriceRangeFromProducts);
  const [localMin, setLocalMin] = useState(priceRange.min.toString());
  const [localMax, setLocalMax] = useState(priceRange.max.toString());

  useEffect(() => {
    setLocalMin(priceRange.min.toString());
    setLocalMax(priceRange.max.toString());
  }, [priceRange]);

  const handleMinChange = (value: string) => {
    setLocalMin(value);
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= priceRange.max) {
      dispatch(setPriceRange({ min: numValue, max: priceRange.max }));
    }
  };

  const handleMaxChange = (value: string) => {
    setLocalMax(value);
    const numValue = parseFloat(value) || availablePriceRange.max;
    if (numValue >= priceRange.min) {
      dispatch(setPriceRange({ min: priceRange.min, max: numValue }));
    }
  };

  const handleReset = () => {
    dispatch(setPriceRange(availablePriceRange));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Fiyat Aralığı
        </label>
        <button
          onClick={handleReset}
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          Sıfırla
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => handleMinChange(e.target.value)}
            className="text-sm"
            min={0}
            max={availablePriceRange.max}
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="text-sm"
            min={priceRange.min}
          />
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            Seçili: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
          </div>
          <div>
            Mevcut: {formatPrice(availablePriceRange.min)} - {formatPrice(availablePriceRange.max)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceRangeFilter;