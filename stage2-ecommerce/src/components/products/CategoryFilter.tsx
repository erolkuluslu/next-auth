'use client';

import { Select } from '@/components/ui';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { selectCategories, selectCategory } from '@/lib/store/selectors';
import { setCategory } from '@/lib/store/slices/filtersSlice';

export function CategoryFilter() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const selectedCategory = useAppSelector(selectCategory);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setCategory(value === 'all' ? null : value));
  };

  const options = [
    { value: 'all', label: 'Tüm Kategoriler' },
    ...categories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
    })),
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Kategori
      </label>
      <Select
        value={selectedCategory || 'all'}
        onChange={handleCategoryChange}
        options={options}
        placeholder="Kategori seçin"
      />
    </div>
  );
}

export default CategoryFilter;