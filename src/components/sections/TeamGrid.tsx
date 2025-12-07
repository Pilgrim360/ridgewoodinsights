import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  credentials: string[];
  bio: string;
  image?: string;
}

export interface TeamGridProps {
  title?: string;
  subtitle?: string;
  description?: string;
  members: TeamMember[];
}

export function TeamGrid({
  title = 'Meet the Experts',
  subtitle = 'Our Team',
  description = 'Our team of certified professionals brings decades of combined experience to help you achieve your financial goals.',
  members,
}: TeamGridProps) {
  return (
    <Section id="team" bg="white" aria-labelledby="team-title">
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
            id="team-title"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6"
          >
            {title}
          </Heading>
          {description && (
            <Text as="p" className="text-text text-lg max-w-3xl mx-auto">
              {description}
            </Text>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card
              key={member.id}
              variant="default"
              className="p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              {/* Avatar Placeholder */}
              <div className="w-24 h-24 bg-surface rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <Heading as={3} className="text-xl font-semibold text-secondary mb-1">
                {member.name}
              </Heading>
              <Text as="p" className="text-primary font-medium text-sm mb-3">
                {member.title}
              </Text>
              
              <div className="flex justify-center gap-2 mb-4">
                {member.credentials.map((credential, index) => (
                  <Badge key={index} variant="info" className="text-xs">
                    {credential}
                  </Badge>
                ))}
              </div>
              
              <Text as="p" className="text-text text-sm leading-relaxed">
                {member.bio}
              </Text>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}