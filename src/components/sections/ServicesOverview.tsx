'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';


export interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
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
              className="group bg-white relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              asChild
            >
              <Link
                href={service.href}
                className="block h-full"
                aria-labelledby={`service-${service.id}-title`}
              >
                {/* Featured Image */}
                {service.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                
                <div className="p-6 h-full flex flex-col">
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
                    className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-all duration-300"
                  >
                    {service.title}
                  </Heading>
                  
                  {/* Description */}
                  <Text
                    as="p"
                    className="text-text mb-6 leading-relaxed group-hover:text-text/90 transition-colors duration-300"
                  >
                    {service.description}
                  </Text>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <Text as="span" className="text-text text-sm group-hover:text-text/90 transition-colors duration-300">
                          {feature}
                        </Text>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA */}
                  <div className="mt-auto">
                    <Text
                      as="span"
                      className="text-primary font-medium text-sm group-hover:underline transition-all duration-300"
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
              className="inline-flex items-center px-6 py-3 border border-surface rounded-lg text-secondary font-medium hover:bg-surface hover:border-primary hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:-translate-y-1 hover:shadow-lg"
            >
              View All Services
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}