import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    asChild?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white shadow-md hover:bg-[#004d4f] hover:shadow-lg active:shadow-sm active:bg-[#004347] disabled:bg-primary disabled:opacity-60 transition-all duration-200',
    secondary:
        'bg-secondary text-white shadow-md hover:bg-[#1f2937] hover:shadow-lg active:shadow-sm active:bg-[#0f1419] disabled:bg-secondary disabled:opacity-60 transition-all duration-200',
    outline:
        'border-2 border-white text-white bg-primary/5 hover:bg-white hover:border-white hover:text-primary active:bg-[#004347] disabled:border-surface disabled:text-surface disabled:opacity-60 transition-all duration-200',
    ghost:
        'text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10 disabled:text-surface disabled:opacity-60 transition-all duration-200',
    destructive:
        'bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg active:shadow-sm active:bg-red-800 disabled:bg-red-600 disabled:opacity-60 transition-all duration-200',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs font-semibold rounded',
    md: 'h-10 px-4 text-sm font-semibold rounded-md',
    lg: 'h-12 px-6 text-base font-semibold rounded-lg',
    xl: 'h-14 px-8 text-lg font-semibold rounded-lg',
};

const loadingSpinnerClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
};

const LoadingSpinner = ({ size }: { size: ButtonSize }) => (
    <svg
        className={cn('animate-spin', loadingSpinnerClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            isLoading = false,
            disabled,
            className,
            children,
            asChild = false,
            icon,
            iconPosition = 'left',
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button';
        const isDisabled = disabled || isLoading;

        // Slot component can only accept className and style on Fragment children
        // For asChild, we don't pass disabled/aria props to avoid Fragment prop error
        const buttonProps = asChild
            ? {
                className: cn(
                    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth && 'w-full',
                    className
                ),
            }
            : {
                disabled: isDisabled,
                'aria-busy': isLoading,
                'aria-disabled': isDisabled,
                className: cn(
                    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    'disabled:cursor-not-allowed',
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth && 'w-full',
                    className
                ),
            };

        // When using asChild, don't render content (let the slotted child handle it)
        // Only apply styling. When not asChild, render full button with content
        const content = asChild ? null : (
            <>
                {isLoading ? (
                    <>
                        <LoadingSpinner size={size} />
                        <span>{children}</span>
                    </>
                ) : (
                    <>
                        {icon && iconPosition === 'left' && (
                            <span className="flex items-center justify-center">{icon}</span>
                        )}
                        {children && <span>{children}</span>}
                        {icon && iconPosition === 'right' && (
                            <span className="flex items-center justify-center">{icon}</span>
                        )}
                    </>
                )}
            </>
        );

        return (
            <Comp ref={ref} {...buttonProps} {...props}>
                {content}
            </Comp>
        );
    }
);

Button.displayName = 'Button';
