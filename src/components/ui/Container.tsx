import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'lg' | 'xl' | '2xl' | 'full' | 'full-bleed';
}

const maxWidthClasses: Record<NonNullable<ContainerProps['maxWidth']>, string> = {
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-6xl',
  full: 'max-w-full',
  'full-bleed': 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'lg', className, children, ...props }, ref) => {
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
