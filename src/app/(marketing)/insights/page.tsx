import { Suspense } from 'react';
import { Hero } from '@/components/sections/Hero';
import { CTA } from '@/components/sections/CTA';
import { getPublishedPosts } from '@/lib/blog';
import { InsightsPageClient } from '@/components/sections/InsightsPageClient';

export default async function InsightsPage() {
  const initialPosts = await getPublishedPosts(12);

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Insights"
        subtitle="Financial Insights & Strategies"
        description="Stay informed with expert financial insights, tax strategies, and business advice to help you make smarter decisions for your future."
        imageSrc="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Financial insights and strategies"
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

      {/* Insights Grid with Client Interactivity */}
      <Suspense fallback={<div className="h-96 bg-surface" />}>
        <InsightsPageClient initialPosts={initialPosts} />
      </Suspense>

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
