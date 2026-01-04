import { Hero } from '@/components/sections/Hero';
import { InsightsPageClient } from '@/components/sections/InsightsPageClient';
import { CTA } from '@/components/sections/CTA';
import { getPublishedPostsPage } from '@/lib/blog';

export default async function InsightsPage() {
  // Fetch initial 12 posts on the server
  const { insights: initialItems, total: initialTotal } = await getPublishedPostsPage({
    offset: 0,
    limit: 12,
  });

  const initialOffset = 12;
  const initialHasMore = initialOffset < initialTotal;

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

      {/* Insights Page Client Component */}
      <InsightsPageClient
        initialItems={initialItems}
        initialOffset={initialOffset}
        initialHasMore={initialHasMore}
      />

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