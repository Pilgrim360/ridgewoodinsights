import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'outlined';
  as?: 'div' | 'article';
  asChild?: boolean;
}

const variantClasses = {
  default: 'bg-white shadow-sm',
  bordered: 'bg-white border border-surface',
  outlined: 'bg-transparent border border-surface',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', as: Tag = 'div', asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : Tag;
    return (
      <Comp
        ref={ref}
        className={cn('rounded-lg p-6 text-text', variantClasses[variant], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Card.displayName = 'Card';
