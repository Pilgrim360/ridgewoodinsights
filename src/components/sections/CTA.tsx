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

  return (
    <Section
      id="cta"
      bg={backgroundVariant}
      className={`relative overflow-hidden ${backgroundClasses[backgroundVariant]} ${className}`}
      aria-labelledby="cta-title"
    >
      {/* Background Visual Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        {/* Geometric Elements */}
        <div className="absolute top-1/4 right-10 w-20 h-20 border-2 border-primary/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 left-10 w-16 h-16 border border-secondary/30 rotate-12"></div>
      </div>
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.02]"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
        }}
      />
      
      <Container maxWidth="xl" className="relative z-10">
        <div className={contentClasses[variant]}>
          {/* Content */}
          <div className={`space-y-4 ${variant === 'split' ? '' : 'md:max-w-2xl'}`}>
            <Heading
              as={2}
              id="cta-title"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary"
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