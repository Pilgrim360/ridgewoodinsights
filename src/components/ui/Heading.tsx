import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
}

const sizeClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-medium',
  6: 'text-base md:text-lg font-medium',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 2, className, children, ...props }, ref) => {
    const Tag = `h${as}` as const;

    return (
      <Tag
        ref={ref}
        className={cn('text-secondary tracking-tight', sizeClasses[as], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';
