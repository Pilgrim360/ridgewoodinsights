'use client';

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
      className={`relative overflow-hidden ${className}`}
      aria-labelledby="services-title"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/5 rotate-12 rounded-lg"></div>
        <div className="absolute top-1/2 left-0 w-40 h-40 bg-primary/3 rounded-full -translate-x-20"></div>
      </div>
      
      {/* Subtle background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
        }}
      />
      
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
            <div
              key={service.id}
              className="group relative"
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              
              {/* Floating icon container */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-500 ease-out z-0"></div>
              
              <Link 
                href={service.href}
                className="block h-full"
                aria-labelledby={`service-${service.id}-title`}
              >
                <Card
                  variant="default"
                  className="group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-white/80 backdrop-blur-sm relative overflow-hidden h-full"
                  interactive={true}
                >
                  <div className="p-6 h-full flex flex-col">
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
                </Card>
              </Link>
            </div>
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