import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { OurStory } from '@/components/sections/OurStory';
import { CompanyValues } from '@/components/sections/CompanyValues';
import { TeamGrid } from '@/components/sections/TeamGrid';
import { CredentialsList } from '@/components/sections/CredentialsList';
import { CTA } from '@/components/sections/CTA';
import { Testimonials } from '@/components/sections/Testimonials';
import {
  TRUST_SIGNALS,
  CREDENTIALS,
  TESTIMONIALS,
  TEAM_MEMBERS,
  COMPANY_VALUES,
} from '@/constants';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Ridgewood Insights, our team of certified professionals, and our commitment to providing exceptional accounting and financial services.',
  openGraph: {
    title: 'About Us | Ridgewood Insights',
    description:
      'Learn about Ridgewood Insights, our team of certified professionals, and our commitment to providing exceptional accounting and financial services.',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Your Trusted Financial Partner"
        subtitle="About Ridgewood Insights"
        description="For over 15 years, we've been helping businesses and individuals navigate complex financial challenges. Our team of certified professionals is dedicated to your success."
        primaryCTA={{
          label: 'Meet Our Team',
          href: '#team',
        }}
        secondaryCTA={{
          label: 'Contact Us',
          href: '/contact',
          variant: 'outline',
        }}
        backgroundVariant="default"
        alignment="center"
      />

      {/* Our Story Section */}
      <OurStory trustSignals={TRUST_SIGNALS} />

      {/* Values Section */}
      <CompanyValues values={COMPANY_VALUES} />

      {/* Team Section */}
      <TeamGrid members={TEAM_MEMBERS} />

      {/* Credentials Section */}
      <CredentialsList credentials={CREDENTIALS} />

      {/* Testimonials */}
      <Testimonials
        title="What Our Clients Say"
        subtitle="Client Testimonials"
        testimonials={TESTIMONIALS}
        layout="featured"
      />

      {/* CTA Section */}
      <CTA
        title="Ready to Work With Us?"
        description="Join hundreds of satisfied clients who trust Ridgewood Insights with their financial needs. Schedule a free consultation today."
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
