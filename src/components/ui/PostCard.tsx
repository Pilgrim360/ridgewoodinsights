
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';
import { Card } from './Card';
import { Heading } from './Heading';
import { Text } from './Text';
import type { Insight } from '@/constants';


interface PostCardProps {
  post: Insight;
  className?: string;
  variant?: 'default' | 'featured';
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export function PostCard({ post, className, variant = 'default' }: PostCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <Card
      as="article"
      className={cn(
        'group relative flex h-full transform flex-col overflow-hidden rounded-xl border border-surface bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg',
        isFeatured ? 'md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-8' : '',
        className,
      )}
    >
        <div className={cn('relative w-full', isFeatured ? 'h-full' : 'aspect-[16/9]')}>
            {post.image ? (
            <Link href={post.link} tabIndex={-1} className="block h-full w-full">
                <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                />
            </Link>
            ) : (
            <div className="flex h-full items-center justify-center bg-surface">
                <Text className="text-text/50">No Image</Text>
            </div>
            )}
        </div>


      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 text-xs">
            <Badge variant="neutral">{post.category}</Badge>
            <time dateTime={post.date} className="text-text/70">
                {formatDate(post.date)}
            </time>
            <span className="text-text/70">&middot;</span>
            <Text className="text-text/70">{post.readTime}</Text>
        </div>
        <Heading as={isFeatured ? 2 : 3} className={cn("font-bold leading-tight text-secondary group-hover:text-primary", isFeatured ? "text-3xl" : "text-xl")}>
          <Link href={post.link}>
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </Heading>
        <Text as="p" className="mt-4 line-clamp-3 flex-grow text-text/90">
          {post.excerpt}
        </Text>
        <div className="mt-6 flex items-center gap-x-4 border-t border-surface pt-4">
            <div className="text-sm leading-6">
            <Text as="p" className="font-semibold text-secondary">
                {post.author}
            </Text>
            </div>
        </div>
      </div>
    </Card>
  );
}
