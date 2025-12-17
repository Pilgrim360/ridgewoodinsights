'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
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
  videoSrc?: string;
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
  videoSrc,
  alignment = 'left',
  className = '',
}: HeroProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
  };

  const sectionStyle = imageSrc && !videoSrc ? { backgroundImage: `url(${imageSrc})` } : {};

  return (
    <Section
      id="hero"
      className={cn(
        'relative flex min-h-screen items-center bg-cover bg-center py-20 overflow-hidden',
        className
      )}
      style={sectionStyle}
      aria-labelledby="hero-title"
    >
      {videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute inset-0 bg-black/40" />
      <Container className="relative" maxWidth="xl">
        <div className={`grid items-center gap-8 ${alignmentClasses[alignment]}`}>
          {/* Content */}
          <div className="space-y-6">
            {subtitle && (
              <Text
                as="p"
                className="font-semibold uppercase tracking-wide text-sm md:text-base text-white/90"
              >
                {subtitle}
              </Text>
            )}
            <Heading
              as={1}
              id="hero-title"
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-4xl',
                alignment === 'center' && 'mx-auto'
              )}
            >
              {title}
            </Heading>
            {description && (
              <Text
                as="p"
                className={cn(
                  'text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl',
                  alignment === 'center' && 'mx-auto'
                )}
              >
                {description}
              </Text>
            )}
            {/* CTAs */}
            <div
              className={cn(
                'flex flex-col sm:flex-row gap-4 pt-6',
                alignment === 'center' ? 'items-center justify-center' : 'items-start'
              )}
            >
              <Link href={primaryCTA.href} aria-label={primaryCTA.label}>
                <Button
                  variant={primaryCTA.variant || 'primary'}
                  size="lg"
                  className="min-h-[48px] w-full sm:w-auto"
                >
                  {primaryCTA.label}
                </Button>
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} aria-label={secondaryCTA.label}>
                  <Button
                    variant={secondaryCTA.variant || 'outline'}
                    size="lg"
                    className="min-h-[48px] w-full sm:w-auto"
                  >
                    {secondaryCTA.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}