import { z } from 'zod';

// Zod schema for runtime validation
export const ProductRatingSchema = z.object({
  rate: z.number().min(0).max(5),
  count: z.number().min(0),
});

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category: z.string().min(1),
  image: z.string().url(),
  rating: ProductRatingSchema,
});

export const CategorySchema = z.string().min(1);

export const ProductsArraySchema = z.array(ProductSchema);
export const CategoriesArraySchema = z.array(CategorySchema);

// TypeScript types derived from schemas
export type ProductRating = z.infer<typeof ProductRatingSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;

// Extended types for frontend use
export interface ProductWithQuantity extends Product {
  quantity?: number;
}

export interface ProductFilters {
  category: string;
  priceMin: number;
  priceMax: number;
  sort: 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'rating-desc' | null;
}

// API response types
export interface FakeStoreApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Price formatting utilities
export interface PriceFormatter {
  currency: 'USD' | 'TRY' | 'EUR';
  locale: string;
}

// Product search and filter utilities
export interface ProductSearchParams {
  category?: string;
  min?: number;
  max?: number;
  sort?: string;
  q?: string; // search query
}

// Cart integration types
export interface CartProduct {
  product: Product;
  quantity: number;
  addedAt: Date;
}

// Error types for API handling
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Product availability states
export type ProductAvailability = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface ProductWithAvailability extends Product {
  availability: ProductAvailability;
  stockQuantity?: number;
}