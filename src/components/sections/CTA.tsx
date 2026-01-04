'use client';

import Link from 'next/link';
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
  urgencyMessage,
  className = '',
}: CTAProps) {
  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-background border-y border-surface',
    white: 'bg-white',
  };

  const contentClasses = {
    centered: 'text-center max-w-3xl mx-auto flex flex-col gap-8 md:gap-10',
    split: 'grid gap-6 md:gap-8 md:grid-cols-2 md:items-center lg:gap-12',
    inline: 'flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 lg:gap-8',
  };

  const buttonContainerClasses = {
    centered: 'flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center',
    split: 'flex flex-col sm:flex-row gap-4 md:gap-6',
    inline: 'flex flex-col sm:flex-row gap-4 md:gap-6 md:flex-shrink-0',
  };

  return (
    <Section
      id="cta"
      bg={backgroundVariant}
      className={`${backgroundClasses[backgroundVariant]} ${className}`}
      aria-labelledby="cta-title"
    >
      <Container maxWidth="xl" className={variant === 'centered' ? 'flex justify-center' : ''}>
        <div className={contentClasses[variant]}>
          {/* Content */}
          <div className={`space-y-4 ${variant === 'split' ? '' : 'md:max-w-2xl'}`}>
            <Heading
              as={2}
              id="cta-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary"
            >
              {title}
            </Heading>
            
            {description && (
              <Text
                as="p"
                className="text-text text-lg leading-relaxed"
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
                  variant={secondaryAction.variant || 'outline'}
                  size="lg"
                  className="min-h-[44px]"
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