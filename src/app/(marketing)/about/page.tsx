import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { OurStory } from '@/components/sections/OurStory';
import { CompanyValues } from '@/components/sections/CompanyValues';
// import { TeamGrid } from '@/components/sections/TeamGrid';
// import { CredentialsList } from '@/components/sections/CredentialsList';
import { CTA } from '@/components/sections/CTA';
import {
  TRUST_SIGNALS,
  CREDENTIALS,
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
        imageSrc="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1426&q=80"
        imageAlt="Professional team meeting discussing financial strategies"
        backgroundVariant="default"
        alignment="center"
      />

      {/* Our Story Section */}
      <OurStory trustSignals={TRUST_SIGNALS} />

      {/* Values Section */}
      <CompanyValues values={COMPANY_VALUES} />

      {/* Team Section - Coming soon */}
      {/* <TeamGrid members={TEAM_MEMBERS} /> */}

      {/* Credentials Section - Coming soon */}
      {/* <CredentialsList credentials={CREDENTIALS} /> */}

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
