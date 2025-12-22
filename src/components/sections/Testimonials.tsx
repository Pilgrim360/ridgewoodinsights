'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company?: string;
  avatar?: string;
  rating?: number; // 1-5 stars
  service?: string;
}

export interface TestimonialsProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  layout?: 'grid' | 'carousel' | 'featured';
  maxDisplay?: number;
  className?: string;
}

export function Testimonials({
  title,
  subtitle,
  testimonials,
  layout = 'grid',
  maxDisplay,
  className = '',
}: TestimonialsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const displayTestimonials = maxDisplay ? testimonials.slice(0, maxDisplay) : testimonials;

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-primary' : 'text-surface'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderTestimonial = (testimonial: Testimonial) => (
    <Card
      key={testimonial.id}
      variant="default"
      className="h-full p-6 relative transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-2"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <svg
          className="w-8 h-8 text-primary"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.112-5.472-5.088-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>

      {/* Rating */}
      {renderStars(testimonial.rating)}

      {/* Quote */}
      <blockquote className="text-text italic mb-6 leading-relaxed relative z-10">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author Info */}
      <div className="border-t border-surface pt-4 relative z-10">
        <div className="flex items-start gap-4">
          {testimonial.avatar && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={testimonial.avatar}
                alt={`${testimonial.author} avatar`}
                fill
                className="object-cover"
                sizes="48px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <Text as="p" className="font-semibold text-secondary">
              {testimonial.author}
            </Text>
            <Text as="p" className="text-text text-sm">
              {testimonial.title}
              {testimonial.company && ` at ${testimonial.company}`}
            </Text>
            {testimonial.service && (
              <Text as="p" className="text-primary text-xs mt-1">
                {testimonial.service}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCarousel = () => (
    <div className="relative">
      {/* Carousel Container */}
      <div 
        className="overflow-hidden"
        role="region"
        aria-label="Client testimonials"
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <div className="max-w-2xl mx-auto">
                {renderTestimonial(testimonial)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {displayTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              index === currentSlide ? 'bg-primary' : 'bg-surface'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );

  const renderFeatured = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        {displayTestimonials[0] && renderTestimonial(displayTestimonials[0])}
      </div>
      
      {displayTestimonials.length > 1 && (
        <div className="grid gap-8 md:grid-cols-2">
          {displayTestimonials.slice(1).map((testimonial) => 
            renderTestimonial(testimonial)
          )}
        </div>
      )}
    </div>
  );

  return (
    <Section
      id="testimonials"
      bg="default"
      className={className}
      aria-labelledby="testimonials-title"
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
            id="testimonials-title"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6"
          >
            {title}
          </Heading>
        </div>

        {/* Testimonials Content */}
        {layout === 'carousel' && renderCarousel()}
        {layout === 'featured' && renderFeatured()}
        {layout === 'grid' && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayTestimonials.map((testimonial) => 
              renderTestimonial(testimonial)
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}