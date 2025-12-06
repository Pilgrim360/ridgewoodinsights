import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError = false, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={hasError}
        className={cn(
          'w-full rounded-md border bg-white text-text placeholder:text-slate-400',
          'px-3 py-2 text-base min-h-[120px] resize-y',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError ? 'border-red-500' : 'border-surface',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
