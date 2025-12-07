import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

export interface CompanyInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
}

export interface ContactInfoProps {
  companyInfo: CompanyInfo;
}

export function ContactInfo({ companyInfo }: ContactInfoProps) {
  return (
    <Section id="contact-info" bg="white" aria-labelledby="contact-info-title">
      <Container maxWidth="xl">
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {/* Phone */}
          <Card variant="default" className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <Heading as={3} className="text-lg font-semibold text-secondary mb-2">
              Phone
            </Heading>
            <Text as="p" className="text-text mb-2">
              Call us during business hours
            </Text>
            <a
              href={`tel:${companyInfo.phone.replace(/[^0-9]/g, '')}`}
              className="text-primary font-medium hover:underline"
            >
              {companyInfo.phone}
            </a>
          </Card>

          {/* Email */}
          <Card variant="default" className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <Heading as={3} className="text-lg font-semibold text-secondary mb-2">
              Email
            </Heading>
            <Text as="p" className="text-text mb-2">
              Send us an email anytime
            </Text>
            <a
              href={`mailto:${companyInfo.email}`}
              className="text-primary font-medium hover:underline"
            >
              {companyInfo.email}
            </a>
          </Card>

          {/* Address */}
          <Card variant="default" className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <Heading as={3} className="text-lg font-semibold text-secondary mb-2">
              Office
            </Heading>
            <Text as="p" className="text-text mb-2">
              Visit us in person
            </Text>
            <Text as="p" className="text-primary font-medium">
              {companyInfo.address}
            </Text>
          </Card>
        </div>

        {/* Business Hours */}
        <div className="text-center mb-16">
          <Heading as={2} className="text-xl font-semibold text-secondary mb-4">
            Business Hours
          </Heading>
          <div className="inline-block text-left">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-text">
              <Text as="span" className="font-medium">Monday - Friday:</Text>
              <Text as="span">9:00 AM - 6:00 PM</Text>
              <Text as="span" className="font-medium">Saturday:</Text>
              <Text as="span">10:00 AM - 2:00 PM</Text>
              <Text as="span" className="font-medium">Sunday:</Text>
              <Text as="span">Closed</Text>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}