'use client';

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
}

export function AboutTrust({
  title,
  subtitle,
  description,
  trustSignals,
  layout = 'grid',
  backgroundVariant = 'default',
  className = '',
}: AboutTrustProps) {
  const renderTrustSignal = (signal: TrustSignal, index: number) => {
    switch (signal.type) {
      case 'credential':
        return (
          <Badge
            key={index}
            variant="neutral"
            className="inline-flex items-center px-3 py-2 text-sm font-medium"
          >
            {signal.icon && <signal.icon className="w-4 h-4 mr-2" />}
            {signal.value}
          </Badge>
        );

      case 'statistic':
        return (
          <Card
            key={index}
            variant="default"
            className="text-center p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {signal.value}
            </div>
            <Text as="p" className="text-text font-medium">
              {signal.title}
            </Text>
            {signal.description && (
              <Text as="p" className="text-text/80 text-sm mt-2">
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
            className="p-6 relative"
          >
            {signal.icon && (
              <div className="absolute top-4 right-4 opacity-20">
                <signal.icon className="w-8 h-8 text-primary" />
              </div>
            )}
            <blockquote className="text-text italic mb-4 leading-relaxed">
              {`"${signal.description}"`}
            </blockquote>
            <div className="border-t border-surface pt-4">
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
            className="p-6 text-center hover:border-primary transition-colors duration-300"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
              {signal.icon && <signal.icon className="w-6 h-6 text-primary" />}
            </div>
            <Heading
              as={4}
              className="text-lg font-semibold text-secondary mb-2"
            >
              {signal.title}
            </Heading>
            <Badge variant="info" className="text-xs">
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
      className={`relative overflow-hidden ${className}`}
      aria-labelledby="about-trust-title"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-secondary/3 rounded-full translate-x-1/2"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-1/4 left-20 w-20 h-20 border border-primary/10 rotate-45"></div>
        <div className="absolute bottom-1/3 right-20 w-16 h-16 border border-secondary/10 rotate-12"></div>
      </div>
      
      {/* Subtle background image for depth */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-3"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
        }}
      />
      
      <Container maxWidth="xl" className="relative z-10">
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