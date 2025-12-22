import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Hero } from '@/components/sections/Hero';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { AboutTrust } from '@/components/sections/AboutTrust';
import { CTA } from '@/components/sections/CTA';
import { Testimonials } from '@/components/sections/Testimonials';
import { NewInsights } from '@/components/sections/NewInsights';
import { getPublishedPosts } from '@/lib/blog';
import {
  SERVICES,
  TRUST_SIGNALS,
  TESTIMONIALS,
  SITE_NAME,
  SITE_DESCRIPTION,
} from '@/constants';

export const metadata: Metadata = {
  title: `${SITE_NAME} - Professional Accounting & Financial Services`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} - Professional Accounting & Financial Services`,
    description: SITE_DESCRIPTION,
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

      {/* Services Overview with Scroll Animation */}
      <ScrollReveal direction="up" delay={0.1}>
        <ServicesOverview
          title="Our Services"
          subtitle="What We Offer"
          services={SERVICES}
          maxDisplay={3}
          showViewAll={true}
          viewAllHref="/services"
        />
      </ScrollReveal>

      {/* About/Trust Section with Scroll Animation */}
      <ScrollReveal direction="up" delay={0.2}>
        <AboutTrust
          title="Why Choose Ridgewood Insights?"
          subtitle="Trusted Expertise"
          description="We combine deep regulatory knowledge with personalized service to help businesses navigate compliance with confidence. Our certified team handles the complexities of accounting, payroll, and compliance so you can focus on what matters most—growing your business."
          trustSignals={TRUST_SIGNALS}
          layout="grid"
          backgroundVariant="white"
        />
      </ScrollReveal>

      {/* Testimonials with Scroll Animation */}
      <ScrollReveal direction="up" delay={0.3}>
        <Testimonials
          title="What Our Clients Say"
          subtitle="Client Success Stories"
          testimonials={TESTIMONIALS}
          layout="grid"
          maxDisplay={3}
        />
      </ScrollReveal>

      {/* CTA Section with Scroll Animation */}
      <ScrollReveal direction="up" delay={0.4}>
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
          backgroundVariant="image"
          imageSrc="https://images.pexels.com/photos/733854/pexels-photo-733854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
      </ScrollReveal>

      {/* Insights Section with Scroll Animation */}
      <ScrollReveal direction="up" delay={0.5}>
        <NewInsights
          title="Latest Insights"
          subtitle="Financial Tips & News"
          insights={latestInsights}
        />
      </ScrollReveal>
    </>
  );
}
