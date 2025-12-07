import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { TrustSignal } from '@/components/sections/AboutTrust';

export interface OurStoryProps {
  title?: string;
  subtitle?: string;
  trustSignals: TrustSignal[];
}

export function OurStory({
  title = 'Building Trust Through Excellence',
  subtitle = 'Our Story',
  trustSignals,
}: OurStoryProps) {
  return (
    <Section id="our-story" bg="white" aria-labelledby="story-title">
      <Container maxWidth="xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
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
              id="story-title"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6"
            >
              {title}
            </Heading>
            <div className="space-y-4 text-text text-lg leading-relaxed">
              <Text as="p">
                Ridgewood Insights was founded in 2009 with a simple mission: to provide 
                personalized, high-quality financial services that help our clients succeed. 
                What started as a small practice has grown into a trusted firm serving 
                hundreds of businesses and individuals.
              </Text>
              <Text as="p">
                Our founder, John Smith, recognized that many people felt overwhelmed by 
                financial complexity and underserved by large, impersonal accounting firms. 
                He set out to create a different kind of practice—one that combines
                professional expertise with genuine care for each client's unique situation.
              </Text>
              <Text as="p">
                Today, our team of certified professionals continues that tradition, 
                providing the same personalized attention and expert guidance that has 
                been our hallmark from the beginning.
              </Text>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trustSignals.map((signal, index) => (
              <Card
                key={index}
                variant="default"
                className="text-center p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {signal.value}
                </div>
                <Text as="p" className="text-text font-medium text-sm">
                  {signal.title}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}