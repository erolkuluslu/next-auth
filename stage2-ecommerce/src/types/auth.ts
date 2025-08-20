// NextAuth.js type extensions for Stage 2 E-commerce
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend default NextAuth types to include roles and additional user data
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    idToken?: string;
    role?: string;
    roles?: string[];
    user: {
      id: string;
      role?: string;
      roles?: string[];
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: string;
    roles?: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    role?: string;
    roles?: string[];
    sub?: string;
  }
}

// RBAC Types (adapted from Stage 1)
export type Role = 'admin' | 'moderator' | 'user' | 'viewer';

export interface RolePermissions {
  [key: string]: boolean;
}

export interface UserRole {
  role: Role;
  permissions: RolePermissions;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: Role;
  roles: Role[];
  permissions: RolePermissions;
}

// Auth configuration interfaces
export interface AuthConfig {
  callbacks: AuthCallbacks;
  pages: AuthPages;
  session: AuthSession;
}

export interface AuthCallbacks {
  jwt: (params: any) => Promise<any>;
  session: (params: any) => Promise<any>;
  signIn: (params: any) => Promise<boolean>;
  redirect: (params: any) => Promise<string>;
}

export interface AuthPages {
  signIn: string;
  signOut: string;
  error: string;
}

export interface AuthSession {
  strategy: 'jwt' | 'database';
  maxAge: number;
  updateAge: number;
}

// E-commerce specific user context
export interface EcommerceUserContext {
  cartId?: string;
  wishlistId?: string;
  preferredLocale: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethods?: PaymentMethod[];
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

// Auth error types
export interface AuthError {
  type: string;
  message: string;
  code?: string;
}

// Role-based access control
export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 4,
  moderator: 3,
  user: 2,
  viewer: 1,
};

export const DEFAULT_PERMISSIONS: Record<Role, RolePermissions> = {
  admin: {
    'products.create': true,
    'products.read': true,
    'products.update': true,
    'products.delete': true,
    'orders.create': true,
    'orders.read': true,
    'orders.update': true,
    'orders.delete': true,
    'users.create': true,
    'users.read': true,
    'users.update': true,
    'users.delete': true,
    'analytics.read': true,
    'settings.update': true,
  },
  moderator: {
    'products.create': true,
    'products.read': true,
    'products.update': true,
    'products.delete': false,
    'orders.create': false,
    'orders.read': true,
    'orders.update': true,
    'orders.delete': false,
    'users.create': false,
    'users.read': true,
    'users.update': false,
    'users.delete': false,
    'analytics.read': true,
    'settings.update': false,
  },
  user: {
    'products.create': false,
    'products.read': true,
    'products.update': false,
    'products.delete': false,
    'orders.create': true,
    'orders.read': true,
    'orders.update': false,
    'orders.delete': false,
    'users.create': false,
    'users.read': false,
    'users.update': false,
    'users.delete': false,
    'analytics.read': false,
    'settings.update': false,
  },
  viewer: {
    'products.create': false,
    'products.read': true,
    'products.update': false,
    'products.delete': false,
    'orders.create': false,
    'orders.read': false,
    'orders.update': false,
    'orders.delete': false,
    'users.create': false,
    'users.read': false,
    'users.update': false,
    'users.delete': false,
    'analytics.read': false,
    'settings.update': false,
  },
};