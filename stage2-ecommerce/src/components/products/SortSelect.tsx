'use client';

import { useTranslations } from 'next-intl';
import { Select } from '@/components/ui';
import { useAppSelector } from '@/lib/store';
import { selectSortBy } from '@/lib/store/selectors';
import { SortOption } from '@/lib/store/slices/filtersSlice';
import { useProductFilters } from '@/hooks/useProductFilters';

export function SortSelect() {
  const t = useTranslations('common.filters.sort');
  const sortBy = useAppSelector(selectSortBy);
  const { updateSort } = useProductFilters();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateSort(value as SortOption);
  };

  const options = [
    { value: 'newest', label: t('newest') },
    { value: 'name-asc', label: t('nameAsc') },
    { value: 'name-desc', label: t('nameDesc') },
    { value: 'price-asc', label: t('priceAsc') },
    { value: 'price-desc', label: t('priceDesc') },
    { value: 'rating-desc', label: t('ratingDesc') },
  ];

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {t('label')}
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