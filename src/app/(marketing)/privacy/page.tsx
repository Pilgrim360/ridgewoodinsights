import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { COMPANY_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Ridgewood Insights collects, uses, and protects your personal information. Our comprehensive privacy policy outlines our data practices.',
  openGraph: {
    title: 'Privacy Policy | Ridgewood Insights',
    description:
      'Learn how Ridgewood Insights collects, uses, and protects your personal information. Our comprehensive privacy policy outlines our data practices.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <Section bg="white">
        <Container maxWidth="lg" className="text-center">
          <Heading as={1} className="mb-6">
            Privacy Policy
          </Heading>
          <Text size="lg" muted className="max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </Text>
          <Text size="sm" muted className="mt-4">
            Last Updated: January 2025
          </Text>
        </Container>
      </Section>

      {/* Introduction */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Introduction
          </Heading>
          <Text>
            Ridgewood Insights (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ridgewoodinsights.com and use our services.
          </Text>
          <Text className="mt-4">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </Text>
        </Container>
      </Section>

      {/* Information We Collect */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Information We Collect
          </Heading>
          
          <Heading as={3} className="mt-8 mb-4">
            Personal Information
          </Heading>
          <Text>
            We may collect personally identifiable information, such as:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text>Name and contact information (email, phone, mailing address)</Text>
            </li>
            <li>
              <Text>Account credentials (username, encrypted password)</Text>
            </li>
            <li>
              <Text>Professional and business information (company name, title, industry)</Text>
            </li>
            <li>
              <Text>Payment information (processed securely through third-party providers)</Text>
            </li>
          </ul>

          <Heading as={3} className="mt-8 mb-4">
            Automatically Collected Information
          </Heading>
          <Text>
            When you visit our website, we automatically collect certain information, including:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text>IP address and browser type</Text>
            </li>
            <li>
              <Text>Operating system and device information</Text>
            </li>
            <li>
              <Text>Referring website and pages visited</Text>
            </li>
            <li>
              <Text>Time and date of visits</Text>
            </li>
          </ul>
        </Container>
      </Section>

      {/* How We Use Information */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            How We Use Your Information
          </Heading>
          <Text>
            We use the information we collect for various purposes, including:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text>Providing, maintaining, and improving our services</Text>
            </li>
            <li>
              <Text>Processing transactions and sending related information</Text>
            </li>
            <li>
              <Text>Sending technical notices, updates, security alerts, and support messages</Text>
            </li>
            <li>
              <Text>Responding to your comments, questions, and customer service requests</Text>
            </li>
            <li>
              <Text>Communicating with you about products, services, events, and promotions</Text>
            </li>
            <li>
              <Text>Monitoring and analyzing trends, usage, and activities</Text>
            </li>
            <li>
              <Text>Detecting, investigating, and preventing security incidents and fraud</Text>
            </li>
          </ul>
        </Container>
      </Section>

      {/* Data Security */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Data Security
          </Heading>
          <Text>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </Text>
          <Text className="mt-4">
            While we strive to protect your personal information, we cannot guarantee its absolute security. Any transmission of personal information is at your own risk.
          </Text>
        </Container>
      </Section>

      {/* Your Rights */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Your Privacy Rights
          </Heading>
          <Text>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text><strong>Access:</strong> Request a copy of the personal information we hold about you</Text>
            </li>
            <li>
              <Text><strong>Correction:</strong> Request correction of inaccurate or incomplete information</Text>
            </li>
            <li>
              <Text><strong>Deletion:</strong> Request deletion of your personal information</Text>
            </li>
            <li>
              <Text><strong>Portability:</strong> Receive your personal information in a structured, machine-readable format</Text>
            </li>
            <li>
              <Text><strong>Objection:</strong> Object to processing of your personal information</Text>
            </li>
            <li>
              <Text><strong>Restriction:</strong> Request restriction of processing your personal information</Text>
            </li>
          </ul>
          <Text className="mt-4">
            To exercise these rights, please contact us at {COMPANY_INFO.email}. We will respond to your request within a reasonable timeframe.
          </Text>
        </Container>
      </Section>

      {/* Contact Information */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Contact Us
          </Heading>
          <Text>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
          </Text>
          <div className="mt-6 space-y-2">
            <Text>
              <strong>Email:</strong> {COMPANY_INFO.email}
            </Text>
            <Text>
              <strong>Phone:</strong> {COMPANY_INFO.phone}
            </Text>
            <Text>
              <strong>Address:</strong> {COMPANY_INFO.address}
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
