import { ApiError } from '@/types/product';

/**
 * Create a standardized API error
 */
export function createApiError(
  message: string,
  status: number = 500,
  code?: string
): ApiError {
  return {
    message,
    status,
    code,
  };
}

/**
 * Handle API errors and convert to user-friendly messages
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Check if it's already an API error
    if ('status' in error && typeof error.status === 'number') {
      return error as ApiError;
    }

    // Network or fetch errors
    if (error.message.includes('fetch')) {
      return createApiError(
        'Network error. Please check your internet connection.',
        503,
        'NETWORK_ERROR'
      );
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return createApiError(
        'Request timed out. Please try again.',
        408,
        'TIMEOUT'
      );
    }

    // Generic error
    return createApiError(error.message, 500, 'UNKNOWN_ERROR');
  }

  // Fallback for non-Error objects
  return createApiError(
    'An unexpected error occurred.',
    500,
    'UNKNOWN_ERROR'
  );
}

/**
 * Retry operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Check if error is retryable (not 4xx client errors)
 */
export function isRetryableError(error: ApiError): boolean {
  return error.status >= 500 || error.status === 408 || error.status === 429;
}

/**
 * Format price with currency
 */
export function formatPrice(
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    // Fallback if locale/currency is invalid
    return `$${price.toFixed(2)}`;
  }
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Create URL with search parameters
 */
export function createUrlWithParams(
  basePath: string,
  params: Record<string, string | number | undefined | null>
): string {
  const url = new URL(basePath, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.pathname + url.search;
}

/**
 * Parse URL search parameters into an object
 */
export function parseUrlParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Validate and sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 100); // Limit length
}

/**
 * Check if running on client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(
  json: string,
  fallback: T
): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Generate cache key for client-side caching
 */
export function generateCacheKey(
  prefix: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${prefix}:${sortedParams}`;
}