// Common types for Stage 2 E-commerce application

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
  roles: string[];
}

export interface Session {
  user: User;
  accessToken?: string;
  idToken?: string;
  role: string;
  roles: string[];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'title' | 'rating';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  locale: string;
  sidebarOpen: boolean;
}

export interface ReduxState {
  cart: Cart;
  ui: UIState;
  products: {
    items: Product[];
    categories: Category[];
    loading: boolean;
    error: string | null;
  };
}

// Utility types
export type Locale = 'tr' | 'en';
export type Theme = 'light' | 'dark';
export type SortOrder = 'asc' | 'desc';
export type ProductSortField = 'price' | 'title' | 'rating' | 'category';

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
