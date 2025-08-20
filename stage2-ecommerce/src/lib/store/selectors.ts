import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Product } from '@/types/product';
import { SortOption } from './slices/filtersSlice';

// Products selectors
export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectCategories = (state: RootState) => state.products.categories;
export const selectCurrentCategory = (state: RootState) => state.products.currentCategory;

// Filters selectors
export const selectFilters = (state: RootState) => state.filters;
export const selectCategory = (state: RootState) => state.filters.category;
export const selectPriceRange = (state: RootState) => state.filters.priceRange;
export const selectMinRating = (state: RootState) => state.filters.minRating;
export const selectSortBy = (state: RootState) => state.filters.sortBy;
export const selectSearchQuery = (state: RootState) => state.filters.searchQuery;
export const selectInStock = (state: RootState) => state.filters.inStock;

// Cart selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemCount = (state: RootState) => state.cart.itemCount;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

// Complex selectors using createSelector for memoization
export const selectFilteredProducts = createSelector(
  [selectProducts, selectFilters],
  (products, filters) => {
    let filtered = [...products];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating.rate >= filters.minRating);
    }

    return filtered;
  }
);

export const selectSortedProducts = createSelector(
  [selectFilteredProducts, selectSortBy],
  (products, sortBy) => {
    const sorted = [...products];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }
);

// Get product count by category
export const selectProductCountByCategory = createSelector(
  [selectProducts],
  (products) => {
    const counts: Record<string, number> = {};
    products.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }
);

// Get price range from all products
export const selectPriceRangeFromProducts = createSelector(
  [selectProducts],
  (products) => {
    if (products.length === 0) {
      return { min: 0, max: 1000 };
    }

    const prices = products.map(product => product.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }
);

// Check if a product is in cart
export const selectIsProductInCart = createSelector(
  [selectCartItems, (state: RootState, productId: number) => productId],
  (cartItems, productId) => {
    return cartItems.some(item => item.product.id === productId);
  }
);

// Get cart item for a specific product
export const selectCartItemByProductId = createSelector(
  [selectCartItems, (state: RootState, productId: number) => productId],
  (cartItems, productId) => {
    return cartItems.find(item => item.product.id === productId);
  }
);