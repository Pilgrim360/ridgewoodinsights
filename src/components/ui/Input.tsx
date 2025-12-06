import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={hasError}
        className={cn(
          'w-full rounded-md border bg-white text-text placeholder:text-slate-400',
          'px-3 py-2 text-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError ? 'border-red-500' : 'border-surface',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
