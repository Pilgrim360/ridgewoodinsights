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
