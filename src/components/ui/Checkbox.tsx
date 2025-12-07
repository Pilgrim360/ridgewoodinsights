import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> {
  label?: string;
  children?: React.ReactNode;
  hasError?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, children, className, id, hasError, ...props }, ref) => {
    return (
      <div className="flex items-start gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={cn(
            'h-4 w-4 mt-1 rounded border-surface text-primary',
            'focus:ring-2 focus:ring-primary focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-red-500',
            className
          )}
          {...props}
        />
        {(label || children) && (
          <label htmlFor={id} className="text-sm text-text cursor-pointer select-none">
            {label || children}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
