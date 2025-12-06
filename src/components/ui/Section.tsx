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

export function Section({
  bg = 'default',
  as: Tag = 'section',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn('py-16 md:py-24', bgClasses[bg], className)} {...props}>
      {children}
    </Tag>
  );
}
