'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { FormField } from '../ui/FormField';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';

// Validation Schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  newsletter: z.boolean(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

// type ContactFormData = z.infer<typeof contactFormSchema>;
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}

export interface ContactFormProps {
  title?: string;
  subtitle?: string;
  onSubmit: (data: ContactFormData) => Promise<void> | void;
  submitButtonLabel?: string;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const serviceOptions = [
  { value: '', label: 'Select a service...' },
  { value: 'tax-preparation', label: 'Tax Preparation & Planning' },
  { value: 'bookkeeping', label: 'Bookkeeping & Accounting' },
  { value: 'financial-planning', label: 'Financial Planning' },
  { value: 'business-consulting', label: 'Business Consulting' },
  { value: 'payroll', label: 'Payroll Services' },
  { value: 'other', label: 'Other' },
];

export function ContactForm({
  title = 'Get in Touch',
  subtitle = "We'd love to hear from you",
  onSubmit,
  submitButtonLabel = 'Send Message',
  variant = 'default',
  className = '',
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      newsletter: false,
      terms: false,
    },
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContainerClasses = {
    default: 'max-w-2xl mx-auto',
    compact: 'max-w-lg mx-auto',
    detailed: 'max-w-4xl mx-auto',
  };

  const gridClasses = {
    default: 'grid gap-6 md:grid-cols-2',
    compact: 'grid gap-4',
    detailed: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
  };

  if (submitStatus === 'success') {
    return (
      <Section id="contact-form" bg="white" className={className}>
          <Container>
          <Card variant="default" className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <Heading as={2} className="text-2xl font-bold text-secondary mb-4">
              Thank You!
            </Heading>
            
            <Text className="text-text mb-6">
              Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
            </Text>
            
            <Button
              variant="outline"
              onClick={() => setSubmitStatus('idle')}
              className="mr-4"
            >
              Send Another Message
            </Button>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="contact-form" bg="white" className={className}>
      <Container>
        <div className={formContainerClasses[variant]}>
          {/* Form Header */}
          <div className="text-center mb-8">
            {subtitle && (
              <Text
                as="p"
                className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-4"
              >
                {subtitle}
              </Text>
            )}
            
            <Heading as={2} className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              {title}
            </Heading>
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Text className="text-red-700">
                  There was an error sending your message. Please try again.
                </Text>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <Card variant="default" className="p-6 md:p-8">
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
              <div className="space-y-6">
                {/* Name Fields */}
                <div className={gridClasses[variant]}>
                  <FormField
                    id="firstName"
                    label="First Name"
                    required
                    error={errors.firstName?.message}
                  >
                    <Input
                      {...register('firstName')}
                      type="text"
                      hasError={!!errors.firstName}
                      placeholder="John"
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    />
                  </FormField>

                  <FormField
                    id="lastName"
                    label="Last Name"
                    required
                    error={errors.lastName?.message}
                  >
                    <Input
                      {...register('lastName')}
                      type="text"
                      hasError={!!errors.lastName}
                      placeholder="Doe"
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                    />
                  </FormField>
                </div>

                {/* Contact Fields */}
                <div className={gridClasses[variant]}>
                  <FormField
                    id="email"
                    label="Email Address"
                    required
                    error={errors.email?.message}
                  >
                    <Input
                      {...register('email')}
                      type="email"
                      hasError={!!errors.email}
                      placeholder="john@example.com"
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </FormField>

                  <FormField
                    id="phone"
                    label="Phone Number"
                    error={errors.phone?.message}
                  >
                    <Input
                      {...register('phone')}
                      type="tel"
                      hasError={!!errors.phone}
                      placeholder="(555) 123-4567"
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </FormField>
                </div>

                {/* Company and Service Interest */}
                <div className={gridClasses[variant]}>
                  <FormField
                    id="company"
                    label="Company Name"
                    error={errors.company?.message}
                  >
                    <Input
                      {...register('company')}
                      type="text"
                      hasError={!!errors.company}
                      placeholder="Your Company"
                      aria-describedby={errors.company ? 'company-error' : undefined}
                    />
                  </FormField>

                  {variant !== 'compact' && (
                    <FormField
                      id="serviceInterest"
                      label="Service Interest"
                      error={errors.serviceInterest?.message}
                    >
                      <Select
                        {...register('serviceInterest')}
                        hasError={!!errors.serviceInterest}
                        aria-describedby={errors.serviceInterest ? 'serviceInterest-error' : undefined}
                      >
                        {serviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  )}
                </div>

                {/* Message */}
                <FormField
                  id="message"
                  label="Message"
                  required
                  error={errors.message?.message}
                >
                  <Textarea
                    {...register('message')}
                    rows={variant === 'compact' ? 3 : 4}
                    hasError={!!errors.message}
                    placeholder="Tell us about your accounting needs..."
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                </FormField>

                {/* Checkboxes */}
                <div className="space-y-4">
                  {variant === 'detailed' && (
                    <FormField
                      id="newsletter"
                      label=""
                      error={errors.newsletter?.message}
                    >
                      <Checkbox
                        {...register('newsletter')}
                        id="newsletter"
                        hasError={!!errors.newsletter}
                      >
                        <Text as="span" className="text-text text-sm">
                          Subscribe to our newsletter for tax tips and financial insights
                        </Text>
                      </Checkbox>
                    </FormField>
                  )}

                  <FormField
                    id="terms"
                    label=""
                    required
                    error={errors.terms?.message}
                  >
                    <Checkbox
                      {...register('terms')}
                      id="terms"
                      hasError={!!errors.terms}
                    >
                      <Text as="span" className="text-text text-sm">
                        I agree to the{' '}
                        <a
                          href="/terms"
                          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        >
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        >
                          Privacy Policy
                        </a>
                      </Text>
                    </Checkbox>
                  </FormField>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      submitButtonLabel
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}