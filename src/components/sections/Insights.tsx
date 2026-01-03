import Link from 'next/link';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { type Insight } from '../../constants';
import { InsightCard } from '../blog/InsightCard';

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

    return (
        <Section
            id="insights"
            bg="default"
            className={className}
            aria-labelledby="insights-title"
        >
            <Container maxWidth="full-bleed">
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
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-6"
                    >
                        {title}
                    </Heading>
                </div>

                {layout === 'list' && (
                    <div className="space-y-6 md:space-y-8">
                        {displayInsights.map((insight) => (
                            <InsightCard key={insight.id} insight={insight} layout="list" />
                        ))}
                    </div>
                )}
                {layout === 'grid' && (
                    <div className="grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {displayInsights.map((insight) => (
                            <InsightCard key={insight.id} insight={insight} layout="grid" />
                        ))}
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
