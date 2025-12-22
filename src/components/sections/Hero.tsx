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
  enableParallax?: boolean;
  floatingElements?: boolean;
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
  enableParallax = false,
  floatingElements = false,
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
        enableParallax && 'parallax-container',
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
      
      {/* Parallax Background Image */}
      {enableParallax && !videoSrc && (
        <div className="absolute inset-0 parallax-bg">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
            }}
          />
        </div>
      )}
      
      {/* Floating Elements */}
      {floatingElements && (
        <>
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/10 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/20 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/20 rounded-full animate-float-delayed"></div>
        </>
      )}
      
      {/* Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/5 rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-secondary/5 rotate-12 animate-pulse-slower"></div>
      </div>
      
      <div className="absolute inset-0 bg-black/60" />
      <Container className="relative z-10" maxWidth="xl">
        <div className={`grid items-center gap-8 ${alignmentClasses[alignment]}`}>
          {/* Content */}
          <div className="space-y-6">
            {subtitle && (
              <Text
                as="p"
                className="font-semibold uppercase tracking-wide text-sm md:text-base text-white/90 animate-fade-in-up"
              >
                {subtitle}
              </Text>
            )}
            <Heading
              as={1}
              id="hero-title"
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-4xl animate-fade-in-up animation-delay-200',
                alignment === 'center' && 'mx-auto'
              )}
            >
              {title}
            </Heading>
            {description && (
              <Text
                as="p"
                className={cn(
                  'text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl animate-fade-in-up animation-delay-400',
                  alignment === 'center' && 'mx-auto'
                )}
              >
                {description}
              </Text>
            )}
            {/* CTAs */}
            <div
              className={cn(
                'flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up animation-delay-600',
                alignment === 'center' ? 'items-center justify-center' : 'items-start'
              )}
            >
              <Link href={primaryCTA.href} aria-label={primaryCTA.label}>
                <Button
                  variant={primaryCTA.variant || 'primary'}
                  size="lg"
                  className="min-h-[48px] w-full sm:w-auto transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  {primaryCTA.label}
                </Button>
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} aria-label={secondaryCTA.label}>
                  <Button
                    variant={secondaryCTA.variant || 'outline'}
                    size="lg"
                    className="min-h-[48px] w-full sm:w-auto transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
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