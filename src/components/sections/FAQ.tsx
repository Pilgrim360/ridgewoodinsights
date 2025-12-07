import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

export function FAQ({
  title = 'Frequently Asked Questions',
  subtitle = 'FAQ',
  items,
}: FAQProps) {
  return (
    <Section id="faq" bg="default" aria-labelledby="faq-title">
      <Container maxWidth="xl">
        <div className="text-center mb-12">
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
            id="faq-title"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6"
          >
            {title}
          </Heading>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {items.map((faq, index) => (
            <Card key={index} variant="default" className="p-6">
              <Heading as={3} className="text-lg font-semibold text-secondary mb-3">
                {faq.question}
              </Heading>
              <Text as="p" className="text-text leading-relaxed">
                {faq.answer}
              </Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}