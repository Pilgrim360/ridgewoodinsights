import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'outlined' | 'elevated' | 'flat';
    as?: 'div' | 'article';
    asChild?: boolean;
    interactive?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
    default: 'bg-white shadow-md border border-surface/30',
    bordered: 'bg-white border-2 border-surface hover:border-primary/30 transition-colors',
    outlined: 'bg-white/50 backdrop-blur-sm border border-surface/50',
    elevated: 'bg-white shadow-lg shadow-black/8',
    flat: 'bg-surface/20 border border-transparent',
};

const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'default',
            as: Tag = 'div',
            asChild = false,
            interactive = false,
            padding = 'md',
            className,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : Tag;
        return (
            <Comp
                ref={ref}
                className={cn(
                    'rounded-xl text-text overflow-hidden transition-all duration-200',
                    paddingClasses[padding],
                    variantClasses[variant],
                    interactive && 'cursor-pointer hover:shadow-lg hover:-translate-y-1',
                    className
                )}
                {...props}
            >
                {children}
            </Comp>
        );
    }
);

Card.displayName = 'Card';
