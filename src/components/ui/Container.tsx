import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('container', className)} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
