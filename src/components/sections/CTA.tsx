'use client';

import Image from 'next/image';
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
  backgroundVariant?: 'default' | 'muted' | 'white' | 'image';
  urgencyMessage?: string;
  className?: string;
  imageSrc?: string;
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
  imageSrc = 'https://images.pexels.com/photos/733854/pexels-photo-733854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
}: CTAProps) {
  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted border border-surface',
    white: 'bg-white',
    image: 'relative overflow-hidden',
  };

  const contentClasses = {
    centered: 'text-center max-w-3xl mx-auto relative z-10',
    split: 'grid gap-8 md:grid-cols-2 md:items-center lg:gap-12 relative z-10',
    inline: 'flex flex-col md:flex-row items-center justify-between gap-6 relative z-10',
  };

  const buttonContainerClasses = {
    centered: 'flex flex-col sm:flex-row gap-4 justify-center items-center',
    split: 'flex flex-col sm:flex-row gap-4',
    inline: 'flex flex-col sm:flex-row gap-4 md:flex-shrink-0',
  };

  return (
    <Section
      id="cta"
      bg={backgroundVariant === 'image' ? 'default' : backgroundVariant}
      className={`${backgroundClasses[backgroundVariant]} ${className} ${backgroundVariant === 'image' ? 'py-20 md:py-24' : ''}`}
      aria-labelledby="cta-title"
    >
      {/* Background Image */}
      {backgroundVariant === 'image' && imageSrc && (
        <>
          <div className="absolute inset-0">
            <Image
              src={imageSrc}
              alt="Professional consultation environment"
              fill
              className="object-cover transition-transform duration-1000 ease-out"
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </>
      )}

      <Container maxWidth="xl">
        <div className={contentClasses[variant]}>
          {/* Content */}
          <div className={`space-y-4 ${variant === 'split' ? '' : 'md:max-w-2xl'}`}>
            <Heading
              as={2}
              id="cta-title"
              className={`font-bold ${
                backgroundVariant === 'image' 
                  ? 'text-white text-3xl md:text-4xl' 
                  : 'text-secondary text-2xl md:text-3xl'
              }`}
            >
              {title}
            </Heading>
            
            {description && (
              <Text
                as="p"
                className={`text-lg leading-relaxed ${
                  backgroundVariant === 'image' ? 'text-white/90' : 'text-text'
                }`}
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
                variant={backgroundVariant === 'image' ? 'primary' : (primaryAction.variant || 'primary')}
                size="lg"
                className="min-h-[44px] text-white hover:scale-105 transition-transform duration-300"
              >
                {primaryAction.label}
              </Button>
            </Link>
            
            {secondaryAction && (
              <Link href={secondaryAction.href} aria-label={secondaryAction.label}>
                <Button
                  variant={secondaryAction.variant || 'outline'}
                  size="lg"
                  className="min-h-[44px] hover:scale-105 transition-transform duration-300"
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