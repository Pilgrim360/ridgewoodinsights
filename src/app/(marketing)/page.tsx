import { Metadata } from 'next';
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
        title="Expert Financial Guidance for Your Success"
        subtitle="Ridgewood Insights"
        description="We provide comprehensive accounting services and strategic financial insights to help businesses and individuals achieve their financial goals. Partner with us for personalized solutions that drive results."
        primaryCTA={{
          label: 'Schedule a Consultation',
          href: '/contact',
        }}
        secondaryCTA={{
          label: 'Our Services',
          href: '/services',
          variant: 'outline',
        }}
        imageSrc="https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        imageAlt="Professional financial planning and accounting services"
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
        description="With over 15 years of experience serving businesses and individuals, we've built a reputation for excellence, integrity, and personalized service. Our team of certified professionals is dedicated to helping you navigate complex financial challenges and achieve your goals."
        trustSignals={TRUST_SIGNALS}
        layout="grid"
        backgroundVariant="white"
      />

      {/* Testimonials */}
      <Testimonials
        title="What Our Clients Say"
        subtitle="Client Success Stories"
        testimonials={TESTIMONIALS}
        layout="grid"
        maxDisplay={3}
      />

      {/* CTA Section */}
      <CTA
        title="Ready to Take Control of Your Finances?"
        description="Schedule a free consultation with our team to discuss your financial needs and discover how we can help you achieve your goals."
        primaryAction={{
          label: 'Get Started Today',
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

      {/* Insights Section */}
      <NewInsights
        title="Latest Insights"
        subtitle="Financial Tips & News"
        insights={latestInsights}
      />
    </>
  );
}
