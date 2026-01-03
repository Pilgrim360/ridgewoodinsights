import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { COMPANY_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Learn about how Ridgewood Insights uses cookies on our website. Understand what cookies are, how we use them, and how you can manage your preferences.',
  openGraph: {
    title: 'Cookie Policy | Ridgewood Insights',
    description:
      'Learn about how Ridgewood Insights uses cookies on our website. Understand what cookies are, how we use them, and how you can manage your preferences.',
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <Section bg="white">
        <Container maxWidth="lg" className="text-center">
          <Heading as={1} className="mb-6">
            Cookie Policy
          </Heading>
          <Text size="lg" muted className="max-w-2xl mx-auto">
            This policy explains how Ridgewood Insights uses cookies and similar technologies on our website.
          </Text>
          <Text size="sm" muted className="mt-4">
            Last Updated: January 2025
          </Text>
        </Container>
      </Section>

      {/* What Are Cookies */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            What Are Cookies?
          </Heading>
          <Text>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
          </Text>
          <Text className="mt-4">
            Cookies allow us to recognize your device and remember information about your preferences (such as language, font size, and other display preferences) over a period of time. They do not give us access to your computer or any information about you, other than the data you choose to share with us.
          </Text>
          <Heading as={3} className="mt-6 mb-4">
            Types of Cookies
          </Heading>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <Text><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</Text>
            </li>
            <li>
              <Text><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period</Text>
            </li>
            <li>
              <Text><strong>First-Party Cookies:</strong> Cookies set by our website directly</Text>
            </li>
            <li>
              <Text><strong>Third-Party Cookies:</strong> Cookies set by external services we use</Text>
            </li>
          </ul>
        </Container>
      </Section>

      {/* How We Use Cookies */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            How We Use Cookies
          </Heading>
          <Text>
            Ridgewood Insights uses cookies for various purposes to enhance your experience on our website:
          </Text>
          
          <Heading as={3} className="mt-8 mb-4">
            Essential Cookies
          </Heading>
          <Text>
            These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot disable these cookies without affecting the basic functions of the website.
          </Text>

          <Heading as={3} className="mt-8 mb-4">
            Analytics Cookies
          </Heading>
          <Text>
            These cookies help us understand how visitors interact with our website by providing information about metrics such as the number of visitors, bounce rate, traffic source, and user behavior. This data helps us improve our website and user experience.
          </Text>

          <Heading as={3} className="mt-8 mb-4">
            Functional Cookies
          </Heading>
          <Text>
            These cookies enable enhanced functionality and personalization, such as videos and live chats. They may be set by us or by third-party providers whose services we have added to our pages.
          </Text>

          <Heading as={3} className="mt-8 mb-4">
            Marketing Cookies
          </Heading>
          <Text>
            These cookies are used to track visitors across websites and display relevant advertisements. They help us deliver more personalized content and measure the effectiveness of our marketing campaigns.
          </Text>
        </Container>
      </Section>

      {/* Third-Party Cookies */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Third-Party Cookies
          </Heading>
          <Text>
            We may use third-party services that set cookies on your behalf. These third parties include:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text><strong>Google Analytics:</strong> For website analytics and performance monitoring</Text>
            </li>
            <li>
              <Text><strong>Social Media Platforms:</strong> For social sharing and engagement features</Text>
            </li>
            <li>
              <Text><strong>Advertising Networks:</strong> For personalized advertising and remarketing</Text>
            </li>
          </ul>
          <Text className="mt-4">
            Please note that these third parties have their own privacy policies and cookie policies. We recommend reviewing these policies to understand how they collect and use your information.
          </Text>
        </Container>
      </Section>

      {/* Cookie Management */}
      <Section bg="white">
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Managing Cookies
          </Heading>
          <Text>
            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas may be restricted.
          </Text>
          
          <Heading as={3} className="mt-8 mb-4">
            Browser Settings
          </Heading>
          <Text>
            Most web browsers allow you to control cookies through their settings. You can:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text>Block all cookies from being set</Text>
            </li>
            <li>
              <Text>Delete existing cookies from your device</Text>
            </li>
            <li>
              <Text>Receive a notification before a cookie is set</Text>
            </li>
            <li>
              <Text>Allow only certain types of cookies</Text>
            </li>
          </ul>
          <Text className="mt-4">
            To manage cookies in your browser, please refer to the help section of your browser or visit the following resources:
          </Text>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>
              <Text><strong>Chrome:</strong> chrome://settings/cookies</Text>
            </li>
            <li>
              <Text><strong>Firefox:</strong> Options &gt; Privacy &amp; Security</Text>
            </li>
            <li>
              <Text><strong>Safari:</strong> Preferences &gt; Privacy</Text>
            </li>
            <li>
              <Text><strong>Edge:</strong> Settings &gt; Cookies and site permissions</Text>
            </li>
          </ul>

          <Heading as={3} className="mt-8 mb-4">
            Cookie Preferences
          </Heading>
          <Text>
            We may provide a cookie consent banner that allows you to manage your cookie preferences directly on our website. You can change your preferences at any time by accessing the cookie settings through this banner or through your browser settings.
          </Text>
        </Container>
      </Section>

      {/* Updates to This Policy */}
      <Section>
        <Container maxWidth="lg">
          <Heading as={2} className="mb-6">
            Updates to This Cookie Policy
          </Heading>
          <Text>
            We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or other reasons. We encourage you to review this policy regularly to stay informed about how we use cookies.
          </Text>
          <Text className="mt-4">
            Any changes to this policy will be posted on this page with an updated effective date. Your continued use of our website following the posting of changes constitutes your acceptance of such changes.
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
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
