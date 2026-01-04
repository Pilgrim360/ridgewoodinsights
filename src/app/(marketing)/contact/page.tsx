'use client';

import { Hero } from '@/components/sections/Hero';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactFormSection } from '@/components/sections/ContactFormSection';
import { FAQ } from '@/components/sections/FAQ';
import { COMPANY_INFO } from '@/constants';

// Contact form submission handler
async function handleContactSubmit(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}) {
  // In production, this would send to an API endpoint or email service
  console.log('Contact form submitted:', data);
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

const FAQ_ITEMS = [
  {
    question: 'What services do you offer?',
    answer: 'We offer a comprehensive range of financial services including tax preparation and planning, bookkeeping and accounting, financial planning, business consulting, payroll services, and audit & assurance.',
  },
  {
    question: 'How do I schedule a consultation?',
    answer: 'You can schedule a consultation by filling out the contact form above, calling us at +260 976 404079, or emailing us at enquiries@ridgewoodinsights.com. We typically respond within 24 hours.',
  },
  {
    question: 'Do you work with individuals or just businesses?',
    answer: 'We work with both individuals and businesses of all sizes. Whether you need personal tax preparation or comprehensive business accounting services, we\'re here to help.',
  },
  {
    question: 'What are your fees?',
    answer: 'Our fees vary depending on the complexity of services required. We offer transparent pricing and will provide a detailed quote after understanding your specific needs during the initial consultation.',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Get in Touch"
        subtitle="Contact Us"
        description="Have questions about our services? Ready to schedule a consultation? We're here to help. Reach out to us and we'll respond within 24 hours."
        primaryCTA={{
          label: 'Call Us Now',
          href: `tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`,
        }}
        secondaryCTA={{
          label: 'Email Us',
          href: `mailto:${COMPANY_INFO.email}`,
          variant: 'outline',
        }}
        imageSrc="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        imageAlt="Professional customer service and consultation"
        backgroundVariant="default"
        alignment="center"
      />

      {/* Contact Information Section */}
      <ContactInfo companyInfo={COMPANY_INFO} />

      {/* Contact Form Section */}
      <ContactFormSection
        title="Send Us a Message"
        subtitle="We'd Love to Hear From You"
        onSubmit={handleContactSubmit}
        submitButtonLabel="Send Message"
        variant="default"
      />

      {/* FAQ Section */}
      <FAQ items={FAQ_ITEMS} />
    </>
  );
}
