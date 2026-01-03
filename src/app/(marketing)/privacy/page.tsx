
import { Container, Section, Heading } from '@/components/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <Section className="py-20 lg:py-28">
      <Container>
        <Heading as={1} className="mb-12 text-center">
          Privacy Policy
        </Heading>

        <div className="prose prose-lg mx-auto max-w-4xl">
          <p>
            Your privacy is important to us. It is Ridgewood Insights&apos; policy to respect your privacy regarding any
            information we may collect from you across our website, ridgewoodinsights.com, and other sites we own and
            operate.
          </p>

          <Heading as={2}>1. Information We Collect</Heading>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by
            fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and
            how it will be used.
          </p>
          <p>
            We may collect the following information:
          </p>
          <ul>
            <li>Contact information including email address</li>
            <li>Demographic information such as postcode, preferences and interests</li>
            <li>Other information relevant to customer surveys and/or offers</li>
          </ul>

          <Heading as={2}>2. How We Use Your Information</Heading>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <Heading as={2}>3. Security</Heading>
          <p>
            We are committed to ensuring that your information is secure. In order to prevent unauthorized access or
            disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and
            secure the information we collect online.
          </p>

          <Heading as={2}>4. Links to Other Websites</Heading>
          <p>
            Our website may contain links to other websites of interest. However, once you have used these links to
            leave our site, you should note that we do not have any control over that other website. Therefore, we
            cannot be responsible for the protection and privacy of any information which you provide whilst visiting
            such sites and such sites are not governed by this privacy statement.
          </p>

          <Heading as={2}>5. Governing Law</Heading>
          <p>
            This policy and any dispute or claim arising out of or in connection with it shall be governed by and
            construed in accordance with the laws of the Republic of Zambia.
          </p>
        </div>
      </Container>
    </Section>
  );
}
