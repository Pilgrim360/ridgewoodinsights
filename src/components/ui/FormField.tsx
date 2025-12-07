import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactElement;
  className?: string;
  required?: boolean;
}

export function FormField({ id, label, error, hint, children, className, required }: FormFieldProps) {
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const childWithProps = isValidElement(children)
    ? cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        hasError: !!error,
      } as React.HTMLAttributes<HTMLElement> & { hasError?: boolean })
    : children;

  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {childWithProps}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-text/70">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
