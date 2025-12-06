import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div';
  muted?: boolean;
  size?: 'sm' | 'base' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Tag = 'p', muted = false, size = 'base', className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          'leading-relaxed',
          sizeClasses[size],
          muted ? 'text-text/70' : 'text-text',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Text.displayName = 'Text';
