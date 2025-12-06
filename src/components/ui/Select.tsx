import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError = false, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={hasError}
        className={cn(
          'w-full rounded-md border bg-white text-text',
          'px-3 py-2 text-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError ? 'border-red-500' : 'border-surface',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
