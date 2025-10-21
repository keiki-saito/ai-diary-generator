import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50
        transition-colors
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
