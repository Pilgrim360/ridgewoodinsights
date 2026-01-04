
import { Container, Section, Heading } from '@/components/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for Ridgewood Insights. Review our terms and conditions for using our accounting and tax services in Zambia.',
  alternates: {
    canonical: 'https://ridgewoodinsights.com/terms',
  },
  openGraph: {
    title: 'Terms of Service | Ridgewood Insights',
    description:
      'Terms of Service for Ridgewood Insights. Review our terms and conditions for using our accounting and tax services in Zambia.',
    url: 'https://ridgewoodinsights.com/terms',
    type: 'website',
  },
};

export default function TermsOfServicePage() {
  return (
    <Section className="py-20 lg:py-28">
      <Container>
        <Heading as={1} className="mb-12 text-center">
          Terms of Service
        </Heading>

        <div className="prose prose-lg mx-auto max-w-4xl">
          <p>
            Welcome to Ridgewood Insights. These terms and conditions outline the rules and regulations for the use of
            our website, located at ridgewoodinsights.com. By accessing this website, we assume you accept these terms
            and conditions. Do not continue to use Ridgewood Insights if you do not agree to all of the terms and
            conditions stated on this page.
          </p>

          <Heading as={2}>1. General</Heading>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and
            all Agreements: &quot;Client&quot;, &quot;You&quot; and &quot;Your&quot; refers to you, the person log on this website and compliant to
            the Company’s terms and conditions. &quot;The Company&quot;, &quot;Ourselves&quot;, &quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refers to our
            Company. &quot;Party&quot;, &quot;Parties&quot;, or &quot;Us&quot;, refers to both the Client and ourselves.
          </p>

          <Heading as={2}>2. License</Heading>
          <p>
            Unless otherwise stated, Ridgewood Insights and/or its licensors own the intellectual property rights for
            all material on Ridgewood Insights. All intellectual property rights are reserved. You may access this from
            Ridgewood Insights for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Ridgewood Insights</li>
            <li>Sell, rent or sub-license material from Ridgewood Insights</li>
            <li>Reproduce, duplicate or copy material from Ridgewood Insights</li>
            <li>Redistribute content from Ridgewood Insights</li>
          </ul>

          <Heading as={2}>3. User Comments</Heading>
          <p>
            This Agreement shall begin on the date hereof. Parts of this website offer an opportunity for users to post
            and exchange opinions and information in certain areas of the website. Ridgewood Insights does not filter,
            edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views
            and opinions of Ridgewood Insights, its agents and/or affiliates. Comments reflect the views and opinions
            of the person who post their views and opinions.
          </p>

          <Heading as={2}>4. Governing Law & Jurisdiction</Heading>
          <p>
            These terms will be governed by and interpreted in accordance with the laws of the Republic of Zambia,
            and you submit to the non-exclusive jurisdiction of the courts located in Zambia for the resolution of any disputes.
          </p>

          <Heading as={2}>5. Disclaimer</Heading>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions
            relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul>
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
