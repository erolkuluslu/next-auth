// UI component types and interfaces

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  isActive?: boolean;
  requiresAuth?: boolean;
  allowedRoles?: string[];
}

export interface UserProfileData {
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
  isActive?: boolean;
}

export interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}