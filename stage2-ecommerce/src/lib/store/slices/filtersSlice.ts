import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';

export interface PriceRange {
  min: number;
  max: number;
}

export interface FiltersState {
  category: string | null;
  priceRange: PriceRange;
  minRating: number;
  sortBy: SortOption;
  searchQuery: string;
  inStock: boolean;
}

const initialState: FiltersState = {
  category: null,
  priceRange: { min: 0, max: 1000 },
  minRating: 0,
  sortBy: 'newest',
  searchQuery: '',
  inStock: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.category = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.priceRange = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setInStock: (state, action: PayloadAction<boolean>) => {
      state.inStock = action.payload;
    },
    resetFilters: (state) => {
      state.category = null;
      state.priceRange = { min: 0, max: 1000 };
      state.minRating = 0;
      state.sortBy = 'newest';
      state.searchQuery = '';
      state.inStock = false;
    },
    updateFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setCategory,
  setPriceRange,
  setMinRating,
  setSortBy,
  setSearchQuery,
  setInStock,
  resetFilters,
  updateFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;