import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

export interface Value {
  title: string;
  description: string;
}

export interface CompanyValuesProps {
  title?: string;
  subtitle?: string;
  values: Value[];
}

export function CompanyValues({
  title = 'What Drives Us',
  subtitle = 'Our Values',
  values,
}: CompanyValuesProps) {
  return (
    <Section id="values" bg="default" aria-labelledby="values-title">
      <Container maxWidth="xl">
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
            id="values-title"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6"
          >
            {title}
          </Heading>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <Card
              key={index}
              variant="default"
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-bold text-xl">{index + 1}</span>
              </div>
              <Heading as={3} className="text-lg font-semibold text-secondary mb-3">
                {value.title}
              </Heading>
              <Text as="p" className="text-text text-sm leading-relaxed">
                {value.description}
              </Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}