'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';


export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
  imageSrc?: string;
  features: string[];
}

export interface ServicesOverviewProps {
  title: string;
  subtitle?: string;
  services: Service[];
  maxDisplay?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  className?: string;
}

export function ServicesOverview({
  title,
  subtitle,
  services,
  maxDisplay,
  showViewAll = false,
  viewAllHref = '/services',
  className = '',
}: ServicesOverviewProps) {
  const displayServices = maxDisplay ? services.slice(0, maxDisplay) : services;
  
  return (
    <Section
      id="services-overview"
      bg="default"
      className={className}
      aria-labelledby="services-title"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,100,102,0.03)_0%,transparent_50%),radial-gradient(circle_at_70%_60%,rgba(44,62,80,0.02)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(0,100,102,0.02)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-surface/20" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <Container maxWidth="xl" className="relative z-10">
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
            id="services-title"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6"
          >
            {title}
          </Heading>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {displayServices.map((service) => (
            <Card
              key={service.id}
              variant="default"
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-white hover:bg-surface/10"
              asChild
            >
              <Link
                href={service.href}
                className="block h-full transform-gpu transition-transform duration-500 ease-out hover:scale-105"
                style={{
                  perspective: '1000px',
                }}
                aria-labelledby={`service-${service.id}-title`}
              >
                {/* Service Image */}
                {service.imageSrc && (
                  <div className="relative h-48 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                    <Image
                      src={service.imageSrc}
                      alt={service.title}
                      fill
                      className="object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={false}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                )}
                
                <div className="p-6 h-full flex flex-col relative z-10">
                  {/* Icon Animation Container */}
                  {service.icon && (
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
                        <service.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,100,102,0.5)]" />
                      </div>
                    </div>
                  )}
                  
                  {/* Title */}
                  <Heading
                    as={3}
                    id={`service-${service.id}-title`}
                    className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300"
                  >
                    {service.title}
                  </Heading>
                  
                  {/* Description */}
                  <Text
                    as="p"
                    className="text-text mb-6 leading-relaxed"
                  >
                    {service.description}
                  </Text>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <Text as="span" className="text-text text-sm">
                          {feature}
                        </Text>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA */}
                  <div className="mt-auto">
                    <Text
                      as="span"
                      className="text-primary font-medium text-sm group-hover:underline"
                    >
                      Learn More →
                    </Text>
                  </div>
                </div>

                {/* 3D Transform Overlay for Desktop */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,100,102,0.03) 0%, rgba(44,62,80,0.02) 100%)',
                    transform: 'translateZ(0)',
                  }}
                />
              </Link>
            </Card>
          ))}
        </div>

        {/* View All CTA */}
        {showViewAll && services.length > (maxDisplay || services.length) && (
          <div className="text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center px-6 py-3 border border-surface rounded-lg text-secondary font-medium hover:bg-surface hover:border-primary hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              View All Services
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}