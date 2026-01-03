import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Heading, Text, Divider } from '@/components/ui';
import { COMPANY_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Ridgewood Insights Terms of Service - The legal agreement governing your use of our website and services in Zambia.',
  keywords: 'terms of service, legal agreement, Zambia, Ridgewood Insights, accounting services, financial advice',
};

export default function TermsPage() {
  const lastUpdated = 'January 1, 2024';

  return (
    <main>
      {/* Hero Header */}
      <Section bg="white" className="pt-24 pb-12">
        <Container>
          <div className="max-w-3xl">
            <Heading as={1} className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
              Terms of Service
            </Heading>
            <Text className="text-lg text-text/80 mb-4">
              Last Updated: {lastUpdated}
            </Text>
            <Divider className="my-8" />
            <Text className="text-xl leading-relaxed">
              Please read these terms of service carefully before using our website or engaging our professional services.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section bg="default" className="pb-24">
        <Container>
          <div className="prose prose-slate max-w-4xl prose-headings:text-secondary prose-p:text-text prose-li:text-text">
            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">1. Agreement to Terms</Heading>
              <Text className="mb-4">
                By accessing this website and engaging our services, you agree to be bound by these Terms of Service and all applicable laws and regulations in the Republic of Zambia. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">2. Professional Services Disclaimer</Heading>
              <Text className="mb-4">
                Ridgewood Insights provides professional accounting, tax, and financial advisory services. While we strive for the highest level of accuracy, the information provided on this website is for general informational purposes only and does not constitute specific professional advice.
              </Text>
              <Text>
                Engaging our services requires a separate signed engagement letter which will outline the specific scope, fees, and responsibilities of our professional relationship.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">3. Use License</Heading>
              <Text className="mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on Ridgewood Insights&apos; website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </Text>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
              </ul>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">4. Intellectual Property</Heading>
              <Text>
                The content, logo, graphics, and other intellectual property on this website are owned by or licensed to Ridgewood Insights and are protected by Zambian and international copyright and trademark laws.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">5. User Responsibilities</Heading>
              <Text className="mb-4">
                As a user of our website and services, you agree:
              </Text>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>To provide accurate, current, and complete information when requested.</li>
                <li>Not to use the website for any unlawful purpose.</li>
                <li>Not to transmit any viruses or malicious code.</li>
                <li>To maintain the confidentiality of any account credentials provided to you.</li>
              </ul>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">6. Limitation of Liability</Heading>
              <Text>
                In no event shall Ridgewood Insights or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ridgewood Insights&apos; website, even if Ridgewood Insights has been notified orally or in writing of the possibility of such damage.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">7. Governing Law</Heading>
              <Text>
                These terms and conditions are governed by and construed in accordance with the laws of the **Republic of Zambia** and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">8. Dispute Resolution</Heading>
              <Text>
                Any dispute arising out of or in connection with these Terms, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by arbitration in Lusaka, Zambia, in accordance with the Arbitration Act of Zambia.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">9. Contact Information</Heading>
              <Text className="mb-4">
                If you have any questions about these Terms, please contact us at:
              </Text>
              <div className="bg-surface p-6 rounded-lg">
                <Text className="font-bold">{COMPANY_INFO.name}</Text>
                <Text>Email: legal@ridgewoodinsights.com</Text>
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
