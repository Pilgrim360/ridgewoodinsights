'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

export interface HeroCTA {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA: HeroCTA;
  secondaryCTA?: HeroCTA;
  imageSrc?: string;
  imageAlt?: string;
  backgroundVariant?: 'default' | 'muted' | 'white';
  alignment?: 'left' | 'center';
  className?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  imageSrc,
  imageAlt = '',
  backgroundVariant = 'default',
  alignment = 'left',
  className = '',
}: HeroProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
  };

  return (
    <Section
      id="hero"
      bg={backgroundVariant}
      className={`py-16 md:py-24 ${className}`}
      aria-labelledby="hero-title"
    >
      <Container maxWidth="xl">
        <div className={`grid items-center gap-12 md:gap-16 lg:grid-cols-2 ${alignmentClasses[alignment]}`}>
          {/* Content */}
          <div className="space-y-6">
            {subtitle && (
              <Text
                as="p"
                className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base"
              >
                {subtitle}
              </Text>
            )}
            
            <Heading
              as={1}
              id="hero-title"
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary leading-tight"
            >
              {title}
            </Heading>
            
            {description && (
              <Text
                as="p"
                className="text-text text-lg md:text-xl leading-relaxed max-w-2xl"
              >
                {description}
              </Text>
            )}
            
            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-4 ${alignment === 'center' ? 'items-center justify-center' : ''}`}>
              <Link href={primaryCTA.href} aria-label={primaryCTA.label}>
                <Button
                  variant={primaryCTA.variant || 'primary'}
                  size="lg"
                  className="min-h-[44px] w-full sm:w-auto"
                >
                  {primaryCTA.label}
                </Button>
              </Link>
              
              {secondaryCTA && (
                <Link href={secondaryCTA.href} aria-label={secondaryCTA.label}>
                  <Button
                    variant={secondaryCTA.variant || 'outline'}
                    size="lg"
                    className="min-h-[44px] w-full sm:w-auto"
                  >
                    {secondaryCTA.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Image */}
          {imageSrc && (
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}