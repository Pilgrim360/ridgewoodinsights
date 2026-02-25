import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { AboutTrust } from '@/components/sections/AboutTrust';
import { CTA } from '@/components/sections/CTA';
import { NewInsights } from '@/components/sections/NewInsights';
import { getPublishedPosts } from '@/lib/blog';
import {
  SERVICES,
  TRUST_SIGNALS,
  SITE_NAME,
} from '@/constants';

export const metadata: Metadata = {
  title: `${SITE_NAME} - Professional Accounting & Tax Services in Zambia`,
  description: 'Expert accounting and tax services in Zambia. Specializing in bookkeeping, VAT returns, ZRA compliance, payroll management, NAPSA filings, and tax planning for businesses across Africa.',
  alternates: {
    canonical: 'https://ridgewoodinsights.com',
  },
  keywords: [
    'accounting Zambia',
    'tax services Lusaka',
    'ZRA compliance',
    'VAT Zambia',
    'bookkeeping Zambia',
    'NAPSA compliance',
    'tax planning Zambia',
    'payroll services Zambia',
    'accounting firm Lusaka',
    'Zambian accountant',
  ],
  openGraph: {
    title: `${SITE_NAME} - Professional Accounting & Tax Services in Zambia`,
    description: 'Expert accounting and tax services in Zambia. Specializing in bookkeeping, VAT returns, ZRA compliance, payroll management, NAPSA filings, and tax planning for businesses across Africa.',
    url: 'https://ridgewoodinsights.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Professional Accounting & Tax Services in Zambia`,
    description: 'Expert accounting and tax services in Zambia. Specializing in bookkeeping, VAT returns, ZRA compliance, and tax planning.',
  },
};

export default async function HomePage() {
  const latestInsights = await getPublishedPosts(6);

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Expert Accounting & Compliance Services"
        subtitle="Ridgewood Insights"
        description="We provide comprehensive accounting, bookkeeping, payroll, and regulatory compliance services designed to help your business operate smoothly and stay audit-ready. Let us handle the numbers while you focus on growth."
        primaryCTA={{
          label: 'Schedule a Consultation',
          href: '/contact',
        }}
        secondaryCTA={{
          label: 'Our Services',
          href: '/services',
          variant: 'outline',
        }}
        videoSrc="https://cdn.pixabay.com/video/2023/01/30/148596-794221551_tiny.mp4"
        backgroundVariant="default"
        alignment="left"
      />

      {/* Services Overview */}
      <ServicesOverview
        title="Our Services"
        subtitle="What We Offer"
        services={SERVICES}
        maxDisplay={3}
        showViewAll={true}
        viewAllHref="/services"
      />

      {/* About/Trust Section */}
      <AboutTrust
        title="Why Choose Ridgewood Insights?"
        subtitle="Trusted Expertise"
        description="We combine deep regulatory knowledge with personalized service to help businesses navigate compliance with confidence. Our certified team handles the complexities of accounting, payroll, and compliance so you can focus on what matters most—growing your business."
        trustSignals={TRUST_SIGNALS}
        layout="grid"
        backgroundVariant="white"
      />

      {/* Insights Section */}
      <NewInsights
        title="Latest Insights"
        subtitle="Financial Tips & News"
        insights={latestInsights}
      />

      {/* CTA Section */}
      <CTA
        title="Ready to Simplify Your Business Accounting?"
        description="Schedule a free consultation with our team to discuss your accounting and compliance needs. We'll show you how to streamline operations and stay audit-ready."
        primaryAction={{
          label: 'Schedule Consultation',
          href: '/contact',
        }}
        secondaryAction={{
          label: 'Learn More',
          href: '/about',
          variant: 'outline',
        }}
        variant="centered"
        backgroundVariant="muted"
      />
    </>
  );
}
