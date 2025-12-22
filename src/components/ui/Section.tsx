import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  bg?: 'default' | 'muted' | 'white';
  as?: 'section' | 'div';
}

const bgClasses = {
  default: 'bg-background',
  muted: 'bg-background border-y border-surface',
  white: 'bg-white',
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section(
    {
      bg = 'default',
      as: Tag = 'section',
      className,
      children,
      ...props
    }: SectionProps,
    ref
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tagRef = ref as any;
    return (
      <Tag
        ref={tagRef}
        className={cn('py-16 md:py-24', bgClasses[bg], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
