import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Service } from '@/constants';

export interface ServiceDetailsProps {
  title?: string;
  subtitle?: string;
  description?: string;
  services: Service[];
}

export function ServiceDetails({
  title = 'How We Can Help You',
  subtitle = 'Service Details',
  description = 'Each of our services is designed to address specific financial needs. Learn more about how we can support your financial success.',
  services,
}: ServiceDetailsProps) {
  return (
    <Section id="service-details" bg="white" aria-labelledby="details-title">
      <Container maxWidth="2xl">
        <div className="text-center mb-12 md:mb-16">
          {subtitle && (
            <Text
              as="p"
              className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-4"
            >
              {subtitle}
            </Text>
          )}
          <Heading
            as={2}
            id="details-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-6"
          >
            {title}
          </Heading>
          {description && (
            <Text as="p" className="text-text text-lg max-w-3xl mx-auto">
              {description}
            </Text>
          )}
        </div>

        <div className="space-y-12 md:space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <Badge variant="info" className="mb-4">
                  {service.title}
                </Badge>
                <Heading
                  as={3}
                  className="text-xl md:text-2xl font-bold text-secondary mb-4"
                >
                  {service.title}
                </Heading>
                <Text as="p" className="text-text text-lg mb-6 leading-relaxed">
                  {service.description}
                </Text>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <Text as="span" className="text-text">
                        {feature}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <Card variant="default" className="p-8 bg-background">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <Heading as={4} className="text-lg font-semibold text-secondary mb-2">
                      Ready to Get Started?
                    </Heading>
                    <Text as="p" className="text-text mb-4">
                      Contact us to learn more about our {service.title.toLowerCase()} services.
                    </Text>
                    <a
                      href="/contact"
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      Schedule a Consultation →
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}