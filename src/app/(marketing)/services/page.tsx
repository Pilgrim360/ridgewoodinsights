import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { ServiceDetails } from '@/components/sections/ServiceDetails';
import { CTA } from '@/components/sections/CTA';
import { Testimonials } from '@/components/sections/Testimonials';
import { SERVICES, TESTIMONIALS } from '@/constants';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Comprehensive accounting and financial services including tax preparation, bookkeeping, financial planning, business consulting, and payroll services.',
  openGraph: {
    title: 'Our Services | Ridgewood Insights',
    description:
      'Comprehensive accounting and financial services including tax preparation, bookkeeping, financial planning, business consulting, and payroll services.',
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Comprehensive Financial Services"
        subtitle="Our Services"
        description="From tax preparation to strategic financial planning, we offer a full range of services designed to help you achieve your financial goals. Our experienced team provides personalized solutions tailored to your unique needs."
        primaryCTA={{
          label: 'Schedule a Consultation',
          href: '/contact',
        }}
        secondaryCTA={{
          label: 'Contact Us',
          href: '/contact',
          variant: 'outline',
        }}
        imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        imageAlt="Professional accounting services and financial analysis"
        backgroundVariant="default"
        alignment="center"
      />

      {/* All Services Grid */}
      <ServicesOverview
        title="What We Offer"
        subtitle="Full Service Accounting"
        services={SERVICES}
      />

      {/* Service Details Section */}
      <ServiceDetails services={SERVICES} />

      {/* Testimonials */}
      <Testimonials
        title="Client Success Stories"
        subtitle="What Our Clients Say"
        testimonials={TESTIMONIALS}
        layout="carousel"
      />

      {/* CTA Section */}
      <CTA
        title="Let's Discuss Your Financial Needs"
        description="Our team is ready to help you find the right solutions for your business or personal finances. Schedule a free consultation today."
        primaryAction={{
          label: 'Get Started',
          href: '/contact',
        }}
        secondaryAction={{
          label: 'Call Us: (555) 123-4567',
          href: 'tel:+15551234567',
          variant: 'outline',
        }}
        variant="centered"
        backgroundVariant="muted"
      />
    </>
  );
}
