import React from 'react';

export type InputType = 'text' | 'email' | 'password' | 'date';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          block w-full px-3 py-2
          min-h-[44px]
          border rounded-md shadow-sm
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-offset-0
          focus-visible:ring-2 focus-visible:ring-offset-0
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
          transition-colors duration-150
          sm:text-sm
          ${
            error
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }
          ${className}
        `}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        aria-required={props.required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
