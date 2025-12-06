import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type DividerProps = React.HTMLAttributes<HTMLHRElement>;

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn('border-t border-surface my-8', className)}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
