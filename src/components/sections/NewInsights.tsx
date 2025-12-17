'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Insight } from '@/constants';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { InsightCard } from '../blog/InsightCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NewInsightsProps {
    title: string;
    subtitle?: string;
    insights: Insight[];
}

export function NewInsights({ title, subtitle, insights }: NewInsightsProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: 'start',
            breakpoints: {
                '(min-width: 768px)': { slidesToScroll: 2 },
                '(min-width: 1024px)': { slidesToScroll: 3 },
            },
        },
        [Autoplay({ delay: 5000, stopOnInteraction: true })]
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <Section id="new-insights" bg="default" aria-labelledby="new-insights-title" className="mt-16">
            <Container maxWidth="xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div className="text-center md:text-left mb-8 md:mb-0">
                        {subtitle && (
                            <Text as="p" className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-2">
                                {subtitle}
                            </Text>
                        )}
                        <Heading as={2} id="new-insights-title" className="text-3xl md:text-4xl font-bold text-secondary">
                            {title}
                        </Heading>
                    </div>
                    <div className="flex justify-center md:justify-end items-center gap-4">
                        <button
                            onClick={scrollPrev}
                            className="p-3 rounded-full bg-surface-light hover:bg-primary/20 text-secondary hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label="Previous insight"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="p-3 rounded-full bg-surface-light hover:bg-primary/20 text-secondary hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label="Next insight"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {insights.map((insight) => (
                            <div key={insight.id} className="flex-grow-0 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 pl-4">
                                <div className="h-full">
                                    <InsightCard insight={insight} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
