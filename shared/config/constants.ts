// =============================================================================
// SHARED CONSTANTS AND CONFIGURATION
// =============================================================================

// Application Constants
export const APP_NAME = 'Next.js Interview Case Study';
export const APP_DESCRIPTION = 'Progressive 3-stage frontend development interview case';
export const APP_VERSION = '1.0.0';

// Stage Identifiers
export const STAGES = {
  AUTH: 'stage1-auth',
  ECOMMERCE: 'stage2-ecommerce',
  MICROFRONTEND: 'stage3-microfrontend',
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/auth/signin',
  SIGNOUT: '/auth/signout',
  SIGNUP: '/auth/signup',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  PRODUCTS: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNOUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
    CALLBACK: '/api/auth/callback',
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: '/api/products/[id]',
    CATEGORIES: '/api/categories',
    SEARCH: '/api/products/search',
  },
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart/add',
    UPDATE: '/api/cart/update',
    REMOVE: '/api/cart/remove',
    CLEAR: '/api/cart/clear',
  },
} as const;

// External API URLs
export const EXTERNAL_APIS = {
  FAKE_STORE: 'https://fakestoreapi.com',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Supported Locales
export const LOCALES = {
  EN: 'en',
  TR: 'tr',
} as const;

export const LOCALE_CONFIGS = {
  [LOCALES.EN]: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    rtl: false,
  },
  [LOCALES.TR]: {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷',
    rtl: false,
  },
} as const;

// Theme Constants
export const THEME = {
  COLORS: {
    PRIMARY: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    GRAY: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
  },
  FONTS: {
    SANS: ['Inter', 'system-ui', 'sans-serif'],
    MONO: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
} as const;

// Component Size Variants
export const COMPONENT_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

// Component Variants
export const COMPONENT_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DESTRUCTIVE: 'destructive',
} as const;

// Performance Constants
export const PERFORMANCE = {
  CACHE_TTL: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
  DEBOUNCE_DELAY: {
    SEARCH: 300,
    RESIZE: 150,
    SCROLL: 100,
  },
  THROTTLE_DELAY: {
    SCROLL: 16, // ~60fps
    RESIZE: 100,
  },
  ISR_REVALIDATE: {
    PRODUCTS: 3600, // 1 hour
    CATEGORIES: 86400, // 24 hours
    STATIC_PAGES: 604800, // 1 week
  },
} as const;

// Validation Constants
export const VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 254,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Cookie Settings
export const COOKIES = {
  SESSION: {
    NAME: 'session-token',
    MAX_AGE: 30 * 24 * 60 * 60, // 30 days
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'lax' as const,
  },
  LOCALE: {
    NAME: 'locale',
    MAX_AGE: 365 * 24 * 60 * 60, // 1 year
    HTTP_ONLY: false,
    SECURE: false,
    SAME_SITE: 'lax' as const,
  },
  CART: {
    NAME: 'cart-token',
    MAX_AGE: 7 * 24 * 60 * 60, // 7 days
    HTTP_ONLY: false,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'lax' as const,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You must be signed in to access this resource.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait before trying again.',
  SERVER: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SIGNIN: 'Successfully signed in!',
  SIGNOUT: 'Successfully signed out!',
  SIGNUP: 'Account created successfully!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  CART_ADD: 'Item added to cart!',
  CART_REMOVE: 'Item removed from cart!',
  CART_UPDATE: 'Cart updated!',
  ORDER_PLACED: 'Order placed successfully!',
} as const;

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Feature Flags (for progressive enhancement)
export const FEATURES = {
  AUTH0_INTEGRATION: true,
  ROLE_BASED_ACCESS: true,
  MULTILINGUAL_SUPPORT: true,
  CART_PERSISTENCE: true,
  REAL_TIME_UPDATES: false,
  PWA_FEATURES: false,
  ANALYTICS: false,
  ERROR_TRACKING: false,
} as const;

// Development Constants
export const DEV = {
  MOCK_DELAY: 500, // Simulate network delay in development
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  SHOW_GRID: false,
  SHOW_BREAKPOINTS: false,
  PERFORMANCE_LOGS: process.env.NODE_ENV === 'development',
} as const;

// SEO Constants
export const SEO = {
  DEFAULT_TITLE: APP_NAME,
  DEFAULT_DESCRIPTION: APP_DESCRIPTION,
  TITLE_TEMPLATE: '%s | ' + APP_NAME,
  OPEN_GRAPH: {
    TYPE: 'website',
    LOCALE: 'en_US',
    SITE_NAME: APP_NAME,
  },
  TWITTER: {
    CARD: 'summary_large_image' as const,
    CREATOR: '@nextjs',
    SITE: '@nextjs',
  },
} as const;

// Micro Frontend Constants (Stage 3)
export const MICRO_FRONTEND = {
  FEDERATION: {
    HOME_APP: {
      NAME: 'homeApp',
      URL: 'http://localhost:3001',
      EXPOSED_MODULES: {
        ProductList: './ProductList',
        ProductDetail: './ProductDetail',
      },
    },
    CART_APP: {
      NAME: 'cartApp',
      URL: 'http://localhost:3002',
      EXPOSED_MODULES: {
        Cart: './Cart',
        CartButton: './CartButton',
      },
    },
    SHELL_APP: {
      NAME: 'shellApp',
      URL: 'http://localhost:3000',
      EXPOSED_MODULES: {},
    },
  },
  SHARED_MODULES: [
    'react',
    'react-dom',
    'next/router',
    'tailwindcss',
  ],
} as const;