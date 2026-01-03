import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Heading, Text, Divider } from '@/components/ui';
import { COMPANY_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Ridgewood Insights Privacy Policy - How we collect, use, and protect your data in accordance with Zambian law.',
  keywords: 'privacy policy, data protection, Zambia, Ridgewood Insights, financial data, personal information',
};

export default function PrivacyPage() {
  const lastUpdated = 'January 1, 2024';

  return (
    <main>
      {/* Hero Header */}
      <Section bg="white" className="pt-24 pb-12">
        <Container>
          <div className="max-w-3xl">
            <Heading as={1} className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
              Privacy Policy
            </Heading>
            <Text className="text-lg text-text/80 mb-4">
              Last Updated: {lastUpdated}
            </Text>
            <Divider className="my-8" />
            <Text className="text-xl leading-relaxed">
              At Ridgewood Insights, we take your privacy seriously. This policy outlines our commitment to protecting your personal data in compliance with the laws of the Republic of Zambia.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section bg="default" className="pb-24">
        <Container>
          <div className="prose prose-slate max-w-4xl prose-headings:text-secondary prose-p:text-text prose-li:text-text">
            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">1. Introduction</Heading>
              <Text className="mb-4">
                Ridgewood Insights (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </Text>
              <Text>
                We operate in accordance with the <strong>Data Protection Act No. 4 of 2021</strong> of the Republic of Zambia.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">2. The Data We Collect</Heading>
              <Text className="mb-4">
                Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </Text>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes bank account and payment card details (primarily for service engagement).</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of services you have purchased from us.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              </ul>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">3. How We Use Your Personal Data</Heading>
              <Text className="mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </Text>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation in Zambia.</li>
              </ul>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">4. Data Protection Principles</Heading>
              <Text className="mb-4">
                In accordance with the Zambian Data Protection Act, we ensure that your personal data is:
              </Text>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Processed lawfully, fairly and in a transparent manner.</li>
                <li>Collected for specified, explicit and legitimate purposes.</li>
                <li>Adequate, relevant and limited to what is necessary.</li>
                <li>Accurate and, where necessary, kept up to date.</li>
                <li>Kept in a form which permits identification of data subjects for no longer than is necessary.</li>
                <li>Processed in a manner that ensures appropriate security of the personal data.</li>
              </ul>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">5. Data Security</Heading>
              <Text>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">6. Data Retention</Heading>
              <Text>
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. Under Zambian law, certain financial records must be kept for a minimum of 7 years.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">7. Your Legal Rights</Heading>
              <Text className="mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </Text>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Withdraw consent at any time where we are relying on consent to process your personal data.</li>
              </ul>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">8. Contact Us</Heading>
              <Text className="mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact our Data Protection Officer at:
              </Text>
              <div className="bg-surface p-6 rounded-lg">
                <Text className="font-bold">{COMPANY_INFO.name}</Text>
                <Text>Email: privacy@ridgewoodinsights.com</Text>
                <Text>Address: {COMPANY_INFO.address}</Text>
              </div>
            </section>
            
            <div className="mt-12">
              <Link href="/" className="text-primary font-semibold hover:underline flex items-center gap-2">
                ← Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
