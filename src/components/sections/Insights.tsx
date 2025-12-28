import Link from 'next/link';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { type Insight } from '../../constants';
import Image from 'next/image';

export interface InsightsProps {
    title: string;
    subtitle?: string;
    insights: Insight[];
    layout?: 'grid' | 'list';
    maxDisplay?: number;
    showLoadMore?: boolean;
    loadMoreHref?: string;
    className?: string;
}

export function Insights({
    title,
    subtitle,
    insights,
    layout = 'grid',
    maxDisplay,
    showLoadMore = false,
    loadMoreHref = '/insights',
    className = '',
}: InsightsProps) {
    const displayInsights = maxDisplay ? insights.slice(0, maxDisplay) : insights;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderInsightCard = (insight: Insight) => (
        <Card
            key={insight.id}
            variant="default"
            className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            asChild
        >
            <Link
                href={insight.link}
                className="block h-full"
                aria-labelledby={`insight-${insight.id}-title`}
            >
                {insight.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                            src={insight.image}
                            alt={insight.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                    </div>
                )}
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                        <Badge variant="neutral" className="text-xs">
                            {insight.category}
                        </Badge>
                        <Text as="span" className="text-text/70 text-xs">
                            {formatDate(insight.date)}
                        </Text>
                        {insight.readTime && (
                            <Text as="span" className="text-text/70 text-xs">
                                {insight.readTime}
                            </Text>
                        )}
                    </div>
                    <Heading
                        as={3}
                        id={`insight-${insight.id}-title`}
                        className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2"
                    >
                        {insight.title}
                    </Heading>
                    <Text
                        as="p"
                        className="text-text flex-grow leading-relaxed mb-4 line-clamp-3"
                    >
                        {insight.excerpt}
                    </Text>
                    <div className="border-t border-surface pt-4 mt-auto">
                        <Text as="p" className="text-text/80 text-sm">
                            By <span className="font-medium">{insight.author}</span>
                        </Text>
                    </div>
                </div>
            </Link>
        </Card>
    );

    const renderList = () => (
        <div className="space-y-8">
            {displayInsights.map((insight) => (
                <Card
                    key={insight.id}
                    variant="default"
                    className="group overflow-hidden hover:shadow-md transition-shadow duration-300"
                    asChild
                >
                    <Link
                        href={insight.link}
                        className="block"
                        aria-labelledby={`insight-${insight.id}-title`}
                    >
                        <div className="md:flex">
                            {insight.image && (
                                <div className="md:w-1/3">
                                    <div className="relative aspect-[16/9] md:aspect-square overflow-hidden">
                                        <Image
                                            src={insight.image}
                                            alt={insight.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                        />
                                    </div>
                                </div>
                            )}
                            <div className={`p-6 ${insight.image ? 'md:w-2/3' : 'w-full'} flex flex-col justify-center`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge variant="neutral" className="text-xs">
                                        {insight.category}
                                    </Badge>
                                    <Text as="span" className="text-text/70 text-xs">
                                        {formatDate(insight.date)}
                                    </Text>
                                    {insight.readTime && (
                                        <Text as="span" className="text-text/70 text-xs">
                                            {insight.readTime}
                                        </Text>
                                    )}
                                </div>
                                <Heading
                                    as={3}
                                    id={`insight-${insight.id}-title`}
                                    className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300"
                                >
                                    {insight.title}
                                </Heading>
                                <Text
                                    as="p"
                                    className="text-text leading-relaxed mb-4"
                                >
                                    {insight.excerpt}
                                </Text>
                                <Text as="p" className="text-text/80 text-sm">
                                    By <span className="font-medium">{insight.author}</span>
                                </Text>
                            </div>
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
    );

    return (
        <Section
            id="insights"
            bg="default"
            className={className}
            aria-labelledby="insights-title"
        >
            <Container>
                <div className="text-center mb-12 md:mb-16">
                    {subtitle && (
                        <Text
                            as="p"
                            className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-4"
                        >
                            {subtitle}
                        </Text>
                    )}
                    <Heading
                        as={2}
                        id="insights-title"
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6"
                    >
                        {title}
                    </Heading>
                </div>

                {layout === 'list' && renderList()}
                {layout === 'grid' && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayInsights.map((insight) =>
                            renderInsightCard(insight)
                        )}
                    </div>
                )}

                {showLoadMore && insights.length > (maxDisplay || insights.length) && (
                    <div className="text-center mt-12">
                        <Link
                            href={loadMoreHref}
                            className="inline-flex items-center px-6 py-3 border border-surface rounded-lg text-secondary font-medium hover:bg-surface hover:border-primary hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Load More Insights
                        </Link>
                    </div>
                )}
            </Container>
        </Section>
    );
}
