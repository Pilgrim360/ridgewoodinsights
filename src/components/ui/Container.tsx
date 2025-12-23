import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'lg' | 'xl' | '2xl' | 'wide' | 'full';
}

const maxWidthClasses = {
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-screen-2xl',
  wide: 'max-w-[1400px]',
  full: 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'xl', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('container', maxWidthClasses[maxWidth], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
