'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

export interface CTAAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface CTAProps {
  title: string;
  description?: string;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  variant?: 'centered' | 'split' | 'inline';
  backgroundVariant?: 'default' | 'muted' | 'white';
  backgroundImage?: string;
  urgencyMessage?: string;
  className?: string;
}

export function CTA({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'centered',
  backgroundVariant = 'default',
  backgroundImage,
  urgencyMessage,
  className = '',
}: CTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!backgroundImage || !backgroundRef.current) return;

    const handleScroll = () => {
      if (sectionRef.current && backgroundRef.current) {
        const { top } = sectionRef.current.getBoundingClientRect();
        const speed = -0.3;
        const yPos = top * speed;
        backgroundRef.current.style.transform = `translateY(${yPos}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [backgroundImage]);

  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted border border-surface',
    white: 'bg-white',
  };

  const contentClasses = {
    centered: 'text-center max-w-3xl mx-auto',
    split: 'grid gap-8 md:grid-cols-2 md:items-center lg:gap-12',
    inline: 'flex flex-col md:flex-row items-center justify-between gap-6',
  };

  const buttonContainerClasses = {
    centered: 'flex flex-col sm:flex-row gap-4 justify-center items-center',
    split: 'flex flex-col sm:flex-row gap-4',
    inline: 'flex flex-col sm:flex-row gap-4 md:flex-shrink-0',
  };

  const hasBackgroundImage = !!backgroundImage;
  const textColor = hasBackgroundImage ? 'text-white' : 'text-text';
  const headingColor = hasBackgroundImage ? 'text-white' : 'text-secondary';


  return (
    <Section
      id="cta"
      ref={sectionRef}
      bg={backgroundVariant}
      className={`${
        !hasBackgroundImage ? backgroundClasses[backgroundVariant] : ''
      } ${className} relative overflow-hidden`}
      aria-labelledby="cta-title"
    >
      {hasBackgroundImage && (
        <div
          ref={backgroundRef}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      <Container maxWidth="xl" className="relative z-10">
        <div className={contentClasses[variant]}>
          {/* Content */}
          <div className={`space-y-4 ${variant === 'split' ? '' : 'md:max-w-2xl'}`}>
            <Heading
              as={2}
              id="cta-title"
              className={`text-2xl md:text-3xl lg:text-4xl font-bold ${headingColor}`}
            >
              {title}
            </Heading>
            
            {description && (
              <Text
                as="p"
                className={`${textColor} text-lg leading-relaxed`}
              >
                {description}
              </Text>
            )}
            
            {urgencyMessage && (
              <Text
                as="p"
                className="text-primary font-semibold text-sm uppercase tracking-wide"
              >
                {urgencyMessage}
              </Text>
            )}
          </div>
          
          {/* Actions */}
          <div className={buttonContainerClasses[variant]}>
            <Link href={primaryAction.href} aria-label={primaryAction.label}>
              <Button
                variant={primaryAction.variant || 'primary'}
                size="lg"
                className="min-h-[44px]"
              >
                {primaryAction.label}
              </Button>
            </Link>
            
            {secondaryAction && (
              <Link href={secondaryAction.href} aria-label={secondaryAction.label}>
                <Button
                  variant={secondaryAction.variant || (hasBackgroundImage ? 'outline' : 'secondary')}
                  size="lg"
                  className={`min-h-[44px] ${hasBackgroundImage ? 'border-white text-white hover:bg-white/10' : ''}`}
                >
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}