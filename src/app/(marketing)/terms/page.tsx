import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { COMPANY_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Terms of Service for Ridgewood Insights website and services. Understand your rights and responsibilities when using our platform.',
  openGraph: {
    title: 'Terms of Service | Ridgewood Insights',
    description:
      'Read the Terms of Service for Ridgewood Insights website and services. Understand your rights and responsibilities when using our platform.',
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      {/* Hero Section */}
      <Section bg="white">
        <Container maxWidth="lg" className="text-center">
          <Heading as={1} className="mb-6">
            Terms of Service
          </Heading>
          <Text size="lg" muted className="max-w-2xl mx-auto">
            Please read these terms carefully before using our website and services.
          </Text>
          <Text size="sm" muted className="mt-4">
            Last Updated: January 2025
          </Text>
        </Container>
      </Section>

      {/* Acceptance of Terms */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Acceptance of Terms
          </Heading>
          <Text>
            By accessing and using the Ridgewood Insights website and services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
          </Text>
          <Text className="mt-4">
            Ridgewood Insights reserves the right to change, modify, add, or remove portions of these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service following the posting of changes constitutes your acceptance of such changes.
          </Text>
        </Container>
      </Section>

      {/* Use License */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Use License
          </Heading>
          <Text>
            Permission is granted to temporarily download one copy of the materials on Ridgewood Insights&apos; website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text>Modify or copy the materials</Text>
            </li>
            <li>
              <Text>Use the materials for any commercial purpose or for any public display</Text>
            </li>
            <li>
              <Text>Attempt to reverse engineer any software contained on the website</Text>
            </li>
            <li>
              <Text>Remove any copyright or other proprietary notations from the materials</Text>
            </li>
            <li>
              <Text>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</Text>
            </li>
          </ul>
          <Text className="mt-4">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by Ridgewood Insights at any time.
          </Text>
        </Container>
      </Section>

      {/* Disclaimer */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Disclaimer
          </Heading>
          <Text>
            The materials on Ridgewood Insights&apos; website are provided on an &apos;as is&apos; basis. Ridgewood Insights makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Text>
          <Text className="mt-4">
            Further, Ridgewood Insights does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </Text>
        </Container>
      </Section>

      {/* Limitation of Liability */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Limitation of Liability
          </Heading>
          <Text>
            In no event shall Ridgewood Insights or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ridgewood Insights&apos; website, even if Ridgewood Insights or a Ridgewood Insights authorized representative has been notified orally or in writing of the possibility of such damage.
          </Text>
          <Text className="mt-4">
            Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
          </Text>
        </Container>
      </Section>

      {/* Accuracy of Materials */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Accuracy of Materials
          </Heading>
          <Text>
            The materials appearing on Ridgewood Insights&apos; website could include technical, typographical, or photographic errors. Ridgewood Insights does not warrant that any of the materials on its website are accurate, complete, or current. Ridgewood Insights may make changes to the materials contained on its website at any time without notice.
          </Text>
          <Text className="mt-4">
            Ridgewood Insights does not, however, make any commitment to update the materials.
          </Text>
        </Container>
      </Section>

      {/* Professional Services */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Professional Services
          </Heading>
          <Text>
            The information provided on this website is for general informational purposes only and should not be construed as professional advice. Accounting, tax, and financial advice should be obtained from a qualified professional in your jurisdiction.
          </Text>
          <Text className="mt-4">
            Ridgewood Insights is not responsible for any actions taken based on the information provided on this website. We recommend consulting with our qualified professionals for specific advice tailored to your situation.
          </Text>
        </Container>
      </Section>

      {/* Governing Law */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Governing Law
          </Heading>
          <Text>
            These terms and any disputes arising out of or related to these terms or the service shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
          </Text>
          <Text className="mt-4">
            Any legal action or proceeding arising under these terms will be brought exclusively in the federal or state courts located in New York, New York, and you hereby irrevocably consent to the personal jurisdiction and venue therein.
          </Text>
        </Container>
      </Section>

      {/* Changes to Terms */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Changes to Terms
          </Heading>
          <Text>
            Ridgewood Insights reserves the right to revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
          </Text>
          <Text className="mt-4">
            We encourage users to frequently check this page for any changes. Your continued use of the website after any changes indicates your acceptance of the new terms.
          </Text>
        </Container>
      </Section>

      {/* Contact Information */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Contact Information
          </Heading>
          <Text>
            If you have any questions about these Terms of Service, please contact us:
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
