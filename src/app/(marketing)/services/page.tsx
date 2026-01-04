import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { ServiceDetails } from '@/components/sections/ServiceDetails';
import { CTA } from '@/components/sections/CTA';
import { SERVICES } from '@/constants';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Comprehensive accounting and tax services in Zambia including bookkeeping, payroll management, VAT returns, ZRA compliance, NAPSA filings, tax preparation, financial statement preparation, business formation, and regulatory compliance for businesses across Africa.',
  alternates: {
    canonical: 'https://ridgewoodinsights.com/services',
  },
  keywords: [
    'accounting services Zambia',
    'bookkeeping Lusaka',
    'payroll management Zambia',
    'VAT returns Zambia',
    'ZRA compliance services',
    'NAPSA filing',
    'tax preparation Zambia',
    'financial statements Zambia',
    'business formation Zambia',
    'regulatory compliance Africa',
  ],
  openGraph: {
    title: 'Our Services | Ridgewood Insights',
    description:
      'Comprehensive accounting and tax services in Zambia including bookkeeping, payroll management, VAT returns, ZRA compliance, NAPSA filings, tax preparation, financial statements, and business formation.',
    url: 'https://ridgewoodinsights.com/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Ridgewood Insights',
    description:
      'Comprehensive accounting and tax services in Zambia including bookkeeping, VAT returns, ZRA compliance, and tax preparation.',
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Comprehensive Accounting & Compliance Services"
        subtitle="Our Services"
        description="From business formation and bookkeeping to tax preparation and regulatory compliance, we provide a full range of accounting services designed to keep your business operating smoothly and remaining audit-ready."
        primaryCTA={{
          label: 'Schedule a Consultation',
          href: '/contact',
        }}
        secondaryCTA={{
          label: 'Contact Us',
          href: '/contact',
          variant: 'outline',
        }}
        imageSrc="https://images.pexels.com/photos/7821716/pexels-photo-7821716.jpeg"
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

      {/* CTA Section */}
      <CTA
        title="Let's Discuss Your Accounting Needs"
        description="Our team is ready to help you find the right accounting solutions for your business. Schedule a free consultation to get started."
        primaryAction={{
          label: 'Schedule a Consultation',
          href: '/contact',
        }}
        secondaryAction={{
          label: 'Contact Us',
          href: '/contact',
          variant: 'outline',
        }}
        variant="centered"
        backgroundVariant="muted"
      />
    </>
  );
}
