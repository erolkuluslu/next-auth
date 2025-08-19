// Application constants following SOLID principles

import { UserRole } from '@/types/auth';

// Single Responsibility: Each constant group has a clear purpose

export const AUTH_ROUTES = {
  SIGN_IN: '/auth/signin',
  SIGN_OUT: '/auth/signout',
  ERROR: '/auth/error',
} as const;

export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN: '/admin',
  SETTINGS: '/settings',
} as const;

export const API_ROUTES = {
  AUTH: '/api/auth',
  USER: '/api/user',
  ADMIN: '/api/admin',
} as const;

export const USER_ROLES: Record<string, UserRole> = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const DEFAULT_REDIRECTS = {
  AFTER_SIGN_IN: '/dashboard',
  AFTER_SIGN_OUT: '/',
  UNAUTHORIZED: '/unauthorized',
} as const;

export const SESSION_CONFIG = {
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  UPDATE_AGE: 24 * 60 * 60, // 24 hours
} as const;

export const ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: 'You must be signed in to access this resource.',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to access this resource.',
  INVALID_CREDENTIALS: 'Invalid credentials provided.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

export const UI_CONFIG = {
  LOADING_DELAY: 200, // ms
  TOAST_DURATION: 5000, // ms
  ANIMATION_DURATION: 300, // ms
} as const;