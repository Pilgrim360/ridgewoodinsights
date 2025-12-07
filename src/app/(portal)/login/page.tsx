import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function LoginPage() {
  return (
    <Card variant="default" className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <Heading as={1} className="text-2xl font-bold text-secondary mb-2">
          Client Portal
        </Heading>
        <Text as="p" className="text-text">
          Sign in to access your documents
        </Text>
      </div>

      <form className="space-y-6">
        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="mb-2 block">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" fullWidth>
          Sign In
        </Button>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot your password?
          </a>
        </div>
      </form>
    </Card>
  );
}