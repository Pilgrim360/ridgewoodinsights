'use client';

import Image from 'next/image';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

export interface TrustSignal {
  type: 'credential' | 'statistic' | 'testimonial' | 'certification';
  title: string;
  value: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AboutTrustProps {
  title: string;
  subtitle?: string;
  description: string;
  trustSignals: TrustSignal[];
  layout?: 'grid' | 'list';
  backgroundVariant?: 'default' | 'muted' | 'white';
  className?: string;
  teamImage?: string;
}

export function AboutTrust({
  title,
  subtitle,
  description,
  trustSignals,
  layout = 'grid',
  backgroundVariant = 'default',
  className = '',
  teamImage = 'https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
}: AboutTrustProps) {
  const renderTrustSignal = (signal: TrustSignal, index: number) => {
    switch (signal.type) {
      case 'credential':
        return (
          <Badge
            key={index}
            variant="neutral"
            className="inline-flex items-center px-3 py-2 text-sm font-medium group hover:bg-primary/10 hover:border-primary transition-all duration-300"
          >
            {signal.icon && <signal.icon className="w-4 h-4 mr-2 text-primary" />}
            <span className="group-hover:text-primary transition-colors duration-300">{signal.value}</span>
          </Badge>
        );

      case 'statistic':
        return (
          <Card
            key={index}
            variant="default"
            className="text-center p-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 relative z-10">
              {signal.value}
            </div>
            <Text as="p" className="text-text font-medium relative z-10">
              {signal.title}
            </Text>
            {signal.description && (
              <Text as="p" className="text-text/80 text-sm mt-2 relative z-10">
                {signal.description}
              </Text>
            )}
          </Card>
        );

      case 'testimonial':
        return (
          <Card
            key={index}
            variant="default"
            className="p-6 relative group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            {signal.icon && (
              <div className="absolute top-4 right-4 opacity-20">
                <signal.icon className="w-8 h-8 text-primary" />
              </div>
            )}
            <blockquote className="text-text italic mb-4 leading-relaxed transition-colors duration-300 group-hover:text-text/90">
              {`"${signal.description}"`}
            </blockquote>
            <div className="border-t border-surface pt-4 group-hover:border-primary/20 transition-colors duration-300">
              <Text as="p" className="font-semibold text-secondary">
                {signal.title}
              </Text>
              <Text as="p" className="text-text/80 text-sm">
                {signal.value}
              </Text>
            </div>
          </Card>
        );

      case 'certification':
        return (
          <Card
            key={index}
            variant="outlined"
            className="p-6 text-center group hover:border-primary hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              {signal.icon && <signal.icon className="w-6 h-6 text-primary" />}
            </div>
            <Heading
              as={4}
              className="text-lg font-semibold text-secondary mb-2 group-hover:text-primary transition-colors duration-300"
            >
              {signal.title}
            </Heading>
            <Badge variant="info" className="text-xs group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {signal.value}
            </Badge>
            {signal.description && (
              <Text as="p" className="text-text/80 text-sm mt-3">
                {signal.description}
              </Text>
            )}
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Section
      id="about-trust"
      bg={backgroundVariant}
      className={className}
      aria-labelledby="about-trust-title"
    >
      <Container maxWidth="xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
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
              as={2}
              id="about-trust-title"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary"
            >
              {title}
            </Heading>
            
            <Text
              as="p"
              className="text-text text-lg leading-relaxed"
            >
              {description}
            </Text>

            {/* Team Image */}
            {teamImage && (
              <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden group">
                <Image
                  src={teamImage}
                  alt="Our professional team at Ridgewood Insights"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
          </div>
          
          {/* Trust Signals */}
          <div className="space-y-8">
            <div className={`grid gap-6 ${
              layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
            }`}>
              {trustSignals.map((signal, index) => renderTrustSignal(signal, index))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}