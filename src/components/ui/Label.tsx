import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-secondary mb-1', className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';
