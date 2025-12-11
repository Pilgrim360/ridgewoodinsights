'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { type Insight } from '../../constants';

export interface InsightsProps {
    title: string;
    subtitle?: string;
    insights: Insight[];
    layout?: 'grid' | 'list' | 'carousel';
    maxDisplay?: number;
    showLoadMore?: boolean;
    loadMoreHref?: string;
    className?: string;
    autoAdvanceInterval?: number;
    itemsPerView?: number;
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
    autoAdvanceInterval = 5000,
    itemsPerView = 1,
}: InsightsProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const displayInsights = maxDisplay ? insights.slice(0, maxDisplay) : insights;
    const maxSlides = Math.max(0, displayInsights.length - itemsPerView + 1);

    // Auto-advance carousel
    useEffect(() => {
        if (layout !== 'carousel' || isHovered) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.max(1, maxSlides));
        }, autoAdvanceInterval);

        return () => clearInterval(interval);
    }, [layout, isHovered, maxSlides, autoAdvanceInterval]);

    // Keyboard navigation
    useEffect(() => {
        if (layout !== 'carousel') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                setCurrentSlide((prev) =>
                    Math.min(prev + 1, Math.max(0, maxSlides - 1))
                );
            } else if (e.key === 'ArrowLeft') {
                setCurrentSlide((prev) => Math.max(0, prev - 1));
            }
        };

        const currentRef = carouselRef.current;
        currentRef?.addEventListener('keydown', handleKeyDown);
        return () =>
            currentRef?.removeEventListener('keydown', handleKeyDown);
    }, [layout, maxSlides]);

    const nextSlide = () => {
        setCurrentSlide((prev) =>
            Math.min(prev + 1, Math.max(0, maxSlides - 1))
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
    };

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
                {/* Image */}
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
                    {/* Meta Information */}
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

                    {/* Title */}
                    <Heading
                        as={3}
                        id={`insight-${insight.id}-title`}
                        className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2"
                    >
                        {insight.title}
                    </Heading>

                    {/* Excerpt */}
                    <Text
                        as="p"
                        className="text-text flex-grow leading-relaxed mb-4 line-clamp-3"
                    >
                        {insight.excerpt}
                    </Text>

                    {/* Author */}
                    <div className="border-t border-surface pt-4 mt-auto">
                        <Text as="p" className="text-text/80 text-sm">
                            By <span className="font-medium">{insight.author}</span>
                        </Text>
                    </div>
                </div>
            </Link>
        </Card>
    );

    const renderCarousel = () => (
        <div
            ref={carouselRef}
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            tabIndex={0}
            role="region"
            aria-label="Latest insights carousel"
            aria-roledescription="carousel"
        >
            {/* Carousel Container */}
            <div
                className="overflow-hidden rounded-xl"
                role="region"
                aria-label="Latest insights"
            >
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
                    }}
                >
                    {displayInsights.map((insight, index) => (
                        <div
                            key={insight.id}
                            className="flex-shrink-0"
                            style={{
                                width: `${100 / itemsPerView}%`,
                                paddingRight: index < displayInsights.length - 1 ? '1.5rem' : '0',
                            }}
                        >
                            <div className="h-full px-4">
                                {renderInsightCard(insight)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Previous Button */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                aria-label="Previous insight"
                type="button"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* Next Button */}
            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                aria-label="Next insight"
                type="button"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxSlides }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${index === currentSlide
                                ? 'bg-primary w-8'
                                : 'bg-surface hover:bg-surface/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === currentSlide ? 'true' : 'false'}
                        type="button"
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full">
                {currentSlide + 1} / {maxSlides}
            </div>
        </div>
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
                            {/* Image */}
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

                            {/* Content */}
                            <div className={`p-6 ${insight.image ? 'md:w-2/3' : 'w-full'} flex flex-col justify-center`}>
                                {/* Meta Information */}
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

                                {/* Title */}
                                <Heading
                                    as={3}
                                    id={`insight-${insight.id}-title`}
                                    className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300"
                                >
                                    {insight.title}
                                </Heading>

                                {/* Excerpt */}
                                <Text
                                    as="p"
                                    className="text-text leading-relaxed mb-4"
                                >
                                    {insight.excerpt}
                                </Text>

                                {/* Author */}
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
            <Container maxWidth="xl">
                {/* Section Header */}
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

                {/* Insights Content */}
                {layout === 'carousel' && renderCarousel()}
                {layout === 'list' && renderList()}
                {layout === 'grid' && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayInsights.map((insight) =>
                            renderInsightCard(insight)
                        )}
                    </div>
                )}

                {/* Load More CTA */}
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