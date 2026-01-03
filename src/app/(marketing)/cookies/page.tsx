import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, Heading, Text, Divider } from '@/components/ui';
import { COMPANY_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Ridgewood Insights Cookie Policy - Information about how we use cookies and similar technologies on our website.',
  keywords: 'cookie policy, cookies, data collection, Zambia, Ridgewood Insights',
};

export default function CookiesPage() {
  const lastUpdated = 'January 1, 2024';

  return (
    <main>
      {/* Hero Header */}
      <Section bg="white" className="pt-24 pb-12">
        <Container>
          <div className="max-w-3xl">
            <Heading as={1} className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
              Cookie Policy
            </Heading>
            <Text className="text-lg text-text/80 mb-4">
              Last Updated: {lastUpdated}
            </Text>
            <Divider className="my-8" />
            <Text className="text-xl leading-relaxed">
              This policy explains how Ridgewood Insights uses cookies and similar technologies to recognize you when you visit our website.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section bg="default" className="pb-24">
        <Container>
          <div className="prose prose-slate max-w-4xl prose-headings:text-secondary prose-p:text-text prose-li:text-text">
            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">1. What are Cookies?</Heading>
              <Text className="mb-4">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </Text>
              <Text>
                Cookies set by the website owner (in this case, Ridgewood Insights) are called &quot;first-party cookies&quot;. Cookies set by parties other than the website owner are called &quot;third-party cookies&quot;.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">2. Why do we use Cookies?</Heading>
              <Text className="mb-4">
                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our online properties.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">3. Types of Cookies We Use</Heading>
              <ul className="list-disc pl-6 space-y-4 mb-4">
                <li>
                  <strong>Essential Website Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.
                </li>
                <li>
                  <strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.
                </li>
                <li>
                  <strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">4. How can I control Cookies?</Heading>
              <Text className="mb-4">
                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
              </Text>
              <Text>
                Most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit your browser&apos;s help pages.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">5. Changes to this Cookie Policy</Heading>
              <Text>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </Text>
            </section>

            <section className="mb-12">
              <Heading as={2} className="text-2xl font-bold mb-4">6. Contact Information</Heading>
              <Text className="mb-4">
                If you have any questions about our use of cookies or other technologies, please email us at:
              </Text>
              <div className="bg-surface p-6 rounded-lg">
                <Text className="font-bold">{COMPANY_INFO.name}</Text>
                <Text>Email: {COMPANY_INFO.email}</Text>
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
