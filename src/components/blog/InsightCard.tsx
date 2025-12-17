import Image from 'next/image';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { type Insight } from '../../constants';

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const InsightCard = ({ insight }: { insight: Insight }) => {
    return (
        <Card
            key={insight.id}
            variant="default"
            className="group h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
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
                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        />
                    </div>
                )}
                <div className="p-6 flex flex-col h-full">
                    <Badge variant="neutral" className="text-xs font-medium mb-4 w-fit">
                        {insight.category}
                    </Badge>
                    <Heading
                        as={3}
                        id={`insight-${insight.id}-title`}
                        className="text-lg font-bold text-secondary mb-2 transition-colors duration-300 group-hover:text-primary line-clamp-2"
                    >
                        {insight.title}
                    </Heading>
                    <Text as="span" className="text-text/70 text-xs mb-4">
                        {formatDate(insight.date)}
                    </Text>
                    <Text as="p" className="text-text/80 flex-grow leading-relaxed mb-4 line-clamp-3">
                        {insight.excerpt}
                    </Text>
                    <div className="border-t border-surface-light pt-4 mt-auto">
                        <Text as="p" className="text-text/90 text-sm font-medium">
                            By <span className="font-semibold text-secondary">{insight.author}</span>
                        </Text>
                    </div>
                </div>
            </Link>
        </Card>
    );
};
