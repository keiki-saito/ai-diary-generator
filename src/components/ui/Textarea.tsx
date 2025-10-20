import React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export default function Textarea({
  label,
  error,
  helperText,
  showCharCount = false,
  maxLength,
  id,
  className = '',
  disabled,
  value,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const charCount =
    typeof value === 'string' ? value.length : typeof value === 'number' ? 0 : 0;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          block w-full px-3 py-2
          border rounded-md shadow-sm
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-offset-0
          focus-visible:ring-2 focus-visible:ring-offset-0
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
          transition-colors duration-150
          resize-y
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
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        aria-required={props.required}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      <div className="mt-1 flex justify-between items-center">
        <div className="flex-1">
          {error && (
            <p className="text-sm text-red-600" id={`${textareaId}-error`}>
              {error}
            </p>
          )}
          {!error && helperText && (
            <p className="text-sm text-gray-500" id={`${textareaId}-helper`}>
              {helperText}
            </p>
          )}
        </div>
        {showCharCount && (
          <p className="text-sm text-gray-500 ml-2">
            {charCount}
            {maxLength && `/${maxLength}`}
          </p>
        )}
      </div>
    </div>
  );
}
