'use client';

import { Select } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { selectSortBy } from '@/lib/store/selectors';
import { setSortBy, SortOption } from '@/lib/store/slices/filtersSlice';

export function SortSelect() {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setSortBy(value as SortOption));
  };

  const options = [
    { value: 'newest', label: 'En Yeni' },
    { value: 'name-asc', label: 'İsim (A-Z)' },
    { value: 'name-desc', label: 'İsim (Z-A)' },
    { value: 'price-asc', label: 'Fiyat (Düşük-Yüksek)' },
    { value: 'price-desc', label: 'Fiyat (Yüksek-Düşük)' },
    { value: 'rating-desc', label: 'En Yüksek Puan' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sıralama:
      </label>
      <Select
        value={sortBy}
        onChange={handleSortChange}
        options={options}
        className="min-w-[180px]"
      />
    </div>
  );
}

export default SortSelect;