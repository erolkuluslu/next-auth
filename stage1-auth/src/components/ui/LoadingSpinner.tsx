// Loading spinner component following SOLID principles

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

// Single Responsibility: Only handles loading spinner rendering
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  const spinnerClasses = [
    'animate-spin rounded-full border-b-2',
    sizeClasses[size],
    colorClasses[color],
    className,
  ].join(' ');

  return <div className={spinnerClasses} aria-label="Loading..." />;
};