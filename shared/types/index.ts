// =============================================================================
// SHARED TYPE DEFINITIONS
// =============================================================================

// Stage 1: Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user';

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expires: Date;
}

export interface AuthConfig {
  providers: AuthProvider[];
  session: SessionConfig;
  callbacks: AuthCallbacks;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: string;
  clientId: string;
  clientSecret: string;
  domain?: string;
}

export interface SessionConfig {
  strategy: 'jwt' | 'database';
  maxAge: number;
  updateAge: number;
}

export interface AuthCallbacks {
  jwt?: (params: any) => Promise<any>;
  session?: (params: any) => Promise<any>;
  redirect?: (params: any) => Promise<string>;
}

// Stage 2: E-commerce Types
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface ProductRating {
  rate: number;
  count: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'rating';
}

// Stage 3: Micro Frontend Types
export interface MicroFrontendConfig {
  name: string;
  url: string;
  port: number;
  exposedModules: ExposedModule[];
}

export interface ExposedModule {
  name: string;
  component: string;
  props?: Record<string, any>;
}

export interface ModuleFederationConfig {
  name: string;
  remotes: Record<string, string>;
  exposes: Record<string, string>;
  shared: Record<string, any>;
}

// Shared API Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Shared UI Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Internationalization Types
export interface Locale {
  code: string;
  name: string;
  flag?: string;
  rtl?: boolean;
}

export interface TranslationKeys {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    create: string;
  };
  auth: {
    signIn: string;
    signOut: string;
    signUp: string;
    email: string;
    password: string;
    forgotPassword: string;
  };
  ecommerce: {
    addToCart: string;
    removeFromCart: string;
    checkout: string;
    product: string;
    products: string;
    category: string;
    categories: string;
    price: string;
    total: string;
  };
}

// Performance and SEO Types
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
}

export interface OpenGraphConfig {
  title: string;
  description: string;
  image: string;
  type: string;
  url: string;
}

export interface TwitterConfig {
  card: 'summary' | 'summary_large_image';
  creator?: string;
  site?: string;
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

// Environment and Configuration Types
export interface EnvironmentConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  apiUrl: string;
  frontendUrl: string;
  auth: AuthEnvironmentConfig;
  database?: DatabaseConfig;
  redis?: RedisConfig;
}

export interface AuthEnvironmentConfig {
  nextAuthUrl: string;
  nextAuthSecret: string;
  auth0ClientId: string;
  auth0ClientSecret: string;
  auth0Domain: string;
  jwtSecret: string;
}

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisConfig {
  url: string;
  host: string;
  port: number;
  password?: string;
  database: number;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;