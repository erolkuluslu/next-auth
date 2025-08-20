import { revalidateTag } from 'next/cache';
import { getStage2EnvironmentConfig } from '@/config/environment';
import { 
  Product, 
  Category, 
  ProductSchema, 
  CategorySchema,
  ProductsArraySchema,
  CategoriesArraySchema,
  ApiError
} from '@/types/product';

const env = getStage2EnvironmentConfig();

// API configuration
const API_CONFIG = {
  baseUrl: env.api.fakeStoreApiUrl,
  timeout: env.api.timeout,
  retries: env.api.retries,
} as const;

// Custom error class for API errors
export class FakeStoreApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'FakeStoreApiError';
  }
}

// Exponential backoff retry utility
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = API_CONFIG.retries,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on client errors (4xx)
      if (error instanceof FakeStoreApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000); // Cap at 10 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
        console.warn(`API request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      }
    }
  }

  throw lastError!;
}

// Base fetch function with timeout and error handling
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = API_CONFIG.timeout
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new FakeStoreApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FakeStoreApiError(
        `Request timeout after ${timeoutMs}ms`,
        408,
        'TIMEOUT'
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Enhanced fetch function with ISR and cache tags
async function fetchApi<T>(
  endpoint: string,
  validator: (data: unknown) => T,
  cacheOptions: {
    revalidate?: number;
    tags?: string[];
  } = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  return withRetry(async () => {
    const response = await fetchWithTimeout(url, {
      next: {
        revalidate: cacheOptions.revalidate || 3600, // 1 hour default
        tags: cacheOptions.tags || ['fakestore'],
      },
    });

    const data = await response.json();
    
    try {
      return validator(data);
    } catch (validationError) {
      console.error('API response validation failed:', validationError);
      throw new FakeStoreApiError(
        'Invalid API response format',
        500,
        'VALIDATION_ERROR'
      );
    }
  });
}

/**
 * Get all products with ISR caching
 */
export async function getProducts(): Promise<Product[]> {
  try {
    return await fetchApi(
      '/products',
      (data) => ProductsArraySchema.parse(data),
      {
        revalidate: 3600, // 1 hour
        tags: ['products', 'fakestore'],
      }
    );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    // Return empty array as fallback to prevent page crashes
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    throw error;
  }
}

/**
 * Get a single product by ID with ISR caching
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    return await fetchApi(
      `/products/${id}`,
      (data) => ProductSchema.parse(data),
      {
        revalidate: 3600, // 1 hour
        tags: ['products', `product-${id}`, 'fakestore'],
      }
    );
  } catch (error) {
    if (error instanceof FakeStoreApiError && error.status === 404) {
      return null; // Product not found
    }
    
    console.error(`Failed to fetch product ${id}:`, error);
    
    // Return null in production to show not-found page
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    
    throw error;
  }
}

/**
 * Get all product categories with ISR caching
 */
export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchApi(
      '/products/categories',
      (data) => CategoriesArraySchema.parse(data),
      {
        revalidate: 7200, // 2 hours (categories change less frequently)
        tags: ['categories', 'fakestore'],
      }
    );
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    
    // Return default categories as fallback
    if (process.env.NODE_ENV === 'production') {
      return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    }
    
    throw error;
  }
}

/**
 * Get products by category with ISR caching
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    return await fetchApi(
      `/products/category/${encodeURIComponent(category)}`,
      (data) => ProductsArraySchema.parse(data),
      {
        revalidate: 3600, // 1 hour
        tags: ['products', `category-${category}`, 'fakestore'],
      }
    );
  } catch (error) {
    console.error(`Failed to fetch products for category ${category}:`, error);
    
    // Return empty array as fallback
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    throw error;
  }
}

/**
 * Get limited number of products (for featured products)
 */
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  try {
    return await fetchApi(
      `/products?limit=${limit}`,
      (data) => ProductsArraySchema.parse(data),
      {
        revalidate: 1800, // 30 minutes (featured products can be more dynamic)
        tags: ['products', 'featured', 'fakestore'],
      }
    );
  } catch (error) {
    console.error(`Failed to fetch featured products:`, error);
    
    // Fallback to getting all products and slicing
    if (process.env.NODE_ENV === 'production') {
      try {
        const allProducts = await getProducts();
        return allProducts.slice(0, limit);
      } catch {
        return [];
      }
    }
    
    throw error;
  }
}

/**
 * Cache invalidation utilities for manual revalidation
 */
export const cacheInvalidation = {
  /**
   * Invalidate all product-related caches
   */
  invalidateProducts: async () => {
    if (typeof revalidateTag !== 'undefined') {
      revalidateTag('products');
    }
  },

  /**
   * Invalidate specific product cache
   */
  invalidateProduct: async (id: number) => {
    if (typeof revalidateTag !== 'undefined') {
      revalidateTag(`product-${id}`);
    }
  },

  /**
   * Invalidate category cache
   */
  invalidateCategories: async () => {
    if (typeof revalidateTag !== 'undefined') {
      revalidateTag('categories');
    }
  },

  /**
   * Invalidate all FakeStore API caches
   */
  invalidateAll: async () => {
    if (typeof revalidateTag !== 'undefined') {
      revalidateTag('fakestore');
    }
  },
};

/**
 * Utility functions for client-side data manipulation
 */
export const productUtils = {
  /**
   * Sort products by various criteria
   */
  sortProducts: (products: Product[], sortBy: string): Product[] => {
    switch (sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'title-asc':
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...products].sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-desc':
        return [...products].sort((a, b) => b.rating.rate - a.rating.rate);
      default:
        return products;
    }
  },

  /**
   * Filter products by price range
   */
  filterByPrice: (products: Product[], min: number, max: number): Product[] => {
    return products.filter(product => product.price >= min && product.price <= max);
  },

  /**
   * Filter products by category
   */
  filterByCategory: (products: Product[], category: string): Product[] => {
    if (category === 'all' || !category) return products;
    return products.filter(product => product.category === category);
  },

  /**
   * Search products by title or description
   */
  searchProducts: (products: Product[], query: string): Product[] => {
    if (!query.trim()) return products;
    const searchTerm = query.toLowerCase();
    return products.filter(
      product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Get price range from products array
   */
  getPriceRange: (products: Product[]): { min: number; max: number } => {
    if (products.length === 0) return { min: 0, max: 1000 };
    
    const prices = products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  },
};