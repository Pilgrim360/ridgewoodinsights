import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { TrustSignal } from '@/components/sections/AboutTrust';

export interface CredentialsListProps {
  title?: string;
  subtitle?: string;
  credentials: TrustSignal[];
}

export function CredentialsList({
  title = 'Certified Excellence',
  subtitle = 'Professional Credentials',
  credentials,
}: CredentialsListProps) {
  return (
    <Section id="credentials" bg="default" aria-labelledby="credentials-title">
      <Container maxWidth="full-bleed">
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
            id="credentials-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-6"
          >
            {title}
          </Heading>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6">
          {credentials.map((credential, index) => (
            <Badge
              key={index}
              variant="neutral"
              className="px-6 py-3 text-base font-medium"
            >
              {credential.title} - {credential.value}
            </Badge>
          ))}
        </div>
      </Container>
    </Section>
  );
}