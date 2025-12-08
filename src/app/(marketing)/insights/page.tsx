import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { InsightsGrid } from '@/components/sections/InsightsGrid';
import { CTA } from '@/components/sections/CTA';
import { INSIGHTS } from '@/constants';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Stay informed with the latest financial insights, tax tips, and business strategies from Ridgewood Insights. Expert guidance for your financial success.',
  keywords:
    'financial insights, tax planning, business advice, accounting tips, financial planning',
  openGraph: {
    title: 'Insights | Ridgewood Insights',
    description:
      'Stay informed with the latest financial insights, tax tips, and business strategies from Ridgewood Insights.',
    type: 'website',
  },
};

export default function InsightsPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Insights"
        subtitle="Financial Insights & Strategies"
        description="Stay informed with expert financial insights, tax strategies, and business advice to help you make smarter decisions for your future."
        primaryCTA={{
          label: 'Contact Us',
          href: '/contact',
        }}
        secondaryCTA={{
          label: 'View Services',
          href: '/services',
          variant: 'outline',
        }}
        backgroundVariant="default"
        alignment="center"
      />

      {/* Insights Grid */}
      <InsightsGrid insights={INSIGHTS} backgroundVariant="white" />

      {/* CTA Section */}
      <CTA
        title="Have Questions About Your Finances?"
        description="Our team of experts is ready to help you navigate your financial challenges. Schedule a free consultation today."
        primaryAction={{
          label: 'Schedule a Consultation',
          href: '/contact',
        }}
        secondaryAction={{
          label: 'View Our Services',
          href: '/services',
          variant: 'outline',
        }}
        variant="centered"
        backgroundVariant="muted"
      />
    </>
  );
}
