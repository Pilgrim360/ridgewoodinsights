'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
  features: string[];
  image?: string;
  imageAlt?: string;
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  return (
    <Section
      id="services-overview"
      bg="default"
      className={className}
      aria-labelledby="services-title"
    >
      <Container maxWidth="xl">
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
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 overflow-hidden"
              asChild
            >
              <Link
                href={service.href}
                className="block h-full"
                aria-labelledby={`service-${service.id}-title`}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="p-6 h-full flex flex-col relative">
                  {/* Background Image with Parallax */}
                  {service.image && (
                    <div className="absolute inset-0 -z-10 overflow-hidden opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                      <div
                        className="w-full h-full"
                        style={{
                          transform: hoveredId === service.id ? 'scale(1.05)' : 'scale(1)',
                          transition: 'transform 0.5s ease-out',
                        }}
                      >
                        <Image
                          src={service.image}
                          alt={service.imageAlt || service.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Icon */}
                  {service.icon && (
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                        <service.icon className="w-6 h-6 text-primary" />
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