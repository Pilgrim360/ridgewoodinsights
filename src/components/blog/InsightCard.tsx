import Image from 'next/image';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { cn } from '@/lib/utils';
import { type Insight } from '../../constants';

export type InsightCardLayout = 'grid' | 'carousel' | 'list' | 'featured';

export interface InsightCardProps {
  insight: Insight;
  layout?: InsightCardLayout;
}

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const CategoryBadge = ({ category }: { category: string }) => (
  <Badge variant="info" className="self-start w-fit bg-primary/10 text-primary">
    {category}
  </Badge>
);

const DateReadTimeLine = ({ insight }: { insight: Insight }) => {
  const date = formatDate(insight.date);
  const readTime = insight.readTime;

  if (!date && !readTime) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text/70">
      {date ? <span>{date}</span> : null}
      {date && readTime ? <span aria-hidden>•</span> : null}
      {readTime ? <span>{readTime}</span> : null}
    </div>
  );
};

const AuthorLine = ({ insight, size = 'sm' }: { insight: Insight; size?: 'sm' | 'md' }) => (
  <div className={cn('flex items-center justify-between gap-4', size === 'md' ? 'pt-6' : 'pt-4')}>
    <Text as="span" size="sm" muted className="truncate">
      By <span className="text-secondary/80 font-medium">{insight.author}</span>
    </Text>
    <span
      className={cn(
        'inline-flex items-center gap-1 text-sm font-semibold text-primary',
        'transition-all duration-200 motion-reduce:transition-none'
      )}
    >
      Read <span aria-hidden>→</span>
    </span>
  </div>
);

const GradientOverlay = () => (
  <div className="absolute inset-0 bg-gradient-to-t from-secondary/25 via-secondary/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
);

export const InsightCard = ({ insight, layout = 'grid' }: InsightCardProps) => {
  const isFeatured = layout === 'featured';
  const isList = layout === 'list';

  const cardVariant: React.ComponentProps<typeof Card>['variant'] = isFeatured ? 'elevated' : 'outlined';
  const aspectRatio = isList ? 'aspect-[16/10] md:aspect-auto md:min-h-[220px]' : 'aspect-[16/10]';
  const imageSizes = isFeatured
    ? '(max-width: 768px) 100vw, 50vw'
    : isList
      ? '(max-width: 768px) 100vw, 320px'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  const headingSize = isFeatured ? 'text-3xl md:text-4xl' : isList ? 'text-2xl' : 'text-xl md:text-[1.35rem]';
  const paddingClass = isFeatured ? 'p-8 md:p-10' : isList ? 'p-6 md:p-8' : 'p-6';
  const showReadArrow = !isList;

  return (
    <Card
      variant={cardVariant}
      padding="sm"
      interactive
      className={cn(
        'group p-0 overflow-hidden',
        'transition-all duration-300 motion-reduce:transition-none',
        'focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2',
        isFeatured && 'shadow-xl'
      )}
      asChild
    >
      <Link href={insight.link} aria-label={insight.title} className="block h-full">
        {isFeatured ? (
          // Featured Layout: Large hero-style card with image left (50%), content right
          <div className="grid md:grid-cols-12 h-full">
            <div className={cn('relative overflow-hidden bg-surface/30', aspectRatio, 'md:col-span-5 md:min-h-[320px]')}>
              {insight.image ? (
                <Image
                  src={insight.image}
                  alt={insight.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.03]"
                  sizes={imageSizes}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-white" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/35 via-secondary/0 to-transparent" />
            </div>

            <div className={cn('flex flex-col gap-4', paddingClass, 'md:col-span-7')}>
              <CategoryBadge category={insight.category} />
              <Heading as={isFeatured ? 2 : 3} className={cn(headingSize, 'leading-tight')}>
                {insight.title}
              </Heading>
              <DateReadTimeLine insight={insight} />
              <Text className="text-text/90 leading-relaxed line-clamp-4">{insight.excerpt}</Text>
              <AuthorLine insight={insight} size="md" />
            </div>
          </div>
        ) : isList ? (
          // List Layout: Horizontal with image left (260px) on desktop, stacked on mobile
          <div className="grid md:grid-cols-[260px_1fr] h-full">
            <div className={cn('relative overflow-hidden bg-surface/30', aspectRatio)}>
              {insight.image ? (
                <Image
                  src={insight.image}
                  alt={insight.title}
                  fill
                  className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                  sizes={imageSizes}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-white" />
              )}
              <GradientOverlay />
            </div>

            <div className={cn('flex flex-col justify-center gap-3', paddingClass)}>
              <CategoryBadge category={insight.category} />
              <Heading
                as={3}
                className={cn(
                  headingSize,
                  'transition-colors duration-200 motion-reduce:transition-none',
                  'group-hover:text-primary'
                )}
              >
                {insight.title}
              </Heading>
              <DateReadTimeLine insight={insight} />
              <Text className="text-text/90 leading-relaxed line-clamp-3">{insight.excerpt}</Text>
              <AuthorLine insight={insight} size="md" />
            </div>
          </div>
        ) : (
          // Grid / Carousel Layout: Vertical card with image on top, content below
          <div className="flex h-full flex-col">
            <div className={cn('relative overflow-hidden bg-surface/30', aspectRatio)}>
              {insight.image ? (
                <Image
                  src={insight.image}
                  alt={insight.title}
                  fill
                  className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                  sizes={imageSizes}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-white" />
              )}
              <GradientOverlay />
            </div>

            <div className={cn('flex flex-col gap-3', paddingClass)}>
              <CategoryBadge category={insight.category} />
              <Heading
                as={3}
                className={cn(
                  headingSize,
                  'leading-snug',
                  'transition-colors duration-200 motion-reduce:transition-none',
                  'group-hover:text-primary line-clamp-2'
                )}
              >
                {insight.title}
              </Heading>
              <DateReadTimeLine insight={insight} />
              <Text className="text-text/90 leading-relaxed line-clamp-3">{insight.excerpt}</Text>
              {showReadArrow && (
                <div className="mt-2 border-t border-surface/60">
                  <AuthorLine insight={insight} size="sm" />
                </div>
              )}
            </div>
          </div>
        )}
      </Link>
    </Card>
  );
};
