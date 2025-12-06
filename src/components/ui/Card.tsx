import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'outlined';
  as?: 'div' | 'article';
}

const variantClasses = {
  default: 'bg-white shadow-sm',
  bordered: 'bg-white border border-surface',
  outlined: 'bg-transparent border border-surface',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', as: Tag = 'div', className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn('rounded-lg p-6 text-text', variantClasses[variant], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Card.displayName = 'Card';
