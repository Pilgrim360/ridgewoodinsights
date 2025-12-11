'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types/admin';
import { SettingsSection } from './SettingsSection';
import { cn } from '@/lib/utils';

interface SettingsFormProps {
  settings: SiteSettings;
  isSaving?: boolean;
  onSave: (settings: SiteSettings) => Promise<void>;
}

interface FormErrors {
  site_title?: string;
  site_tagline?: string;
  contact_email?: string;
}

export function SettingsForm({
  settings: initialSettings,
  isSaving,
  onSave,
}: SettingsFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!settings.site_title.trim()) {
      newErrors.site_title = 'Site title is required';
    } else if (settings.site_title.length > 100) {
      newErrors.site_title = 'Site title must be 100 characters or less';
    }

    if (!settings.site_tagline.trim()) {
      newErrors.site_tagline = 'Site tagline is required';
    } else if (settings.site_tagline.length > 200) {
      newErrors.site_tagline = 'Site tagline must be 200 characters or less';
    }

    if (!settings.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!isValidEmail(settings.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof SiteSettings,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onSave(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsSection
        title="Site Information"
        description="Configure your site's primary settings visible to the public."
      >
        {/* Site Title */}
        <div>
          <label htmlFor="site_title" className="block text-sm font-medium text-secondary mb-2">
            Site Title *
          </label>
          <input
            id="site_title"
            type="text"
            value={settings.site_title}
            onChange={(e) => handleChange('site_title', e.target.value)}
            disabled={isSaving}
            placeholder="e.g., Ridgewood Insights"
            maxLength={100}
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background',
              errors.site_title ? 'border-red-500' : 'border-surface'
            )}
          />
          {errors.site_title && (
            <p className="text-sm text-red-600 mt-1" role="alert">
              {errors.site_title}
            </p>
          )}
          <p className="text-xs text-text/60 mt-1">
            {settings.site_title.length}/100 characters
          </p>
        </div>

        {/* Site Tagline */}
        <div>
          <label htmlFor="site_tagline" className="block text-sm font-medium text-secondary mb-2">
            Site Tagline *
          </label>
          <input
            id="site_tagline"
            type="text"
            value={settings.site_tagline}
            onChange={(e) => handleChange('site_tagline', e.target.value)}
            disabled={isSaving}
            placeholder="e.g., Financial insights for accountants"
            maxLength={200}
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background',
              errors.site_tagline ? 'border-red-500' : 'border-surface'
            )}
          />
          {errors.site_tagline && (
            <p className="text-sm text-red-600 mt-1" role="alert">
              {errors.site_tagline}
            </p>
          )}
          <p className="text-xs text-text/60 mt-1">
            {settings.site_tagline.length}/200 characters
          </p>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Contact Information"
        description="Email address used for general inquiries and contact forms."
      >
        {/* Contact Email */}
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-secondary mb-2">
            Contact Email *
          </label>
          <input
            id="contact_email"
            type="email"
            value={settings.contact_email}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            disabled={isSaving}
            placeholder="e.g., hello@ridgewood.com"
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-background',
              errors.contact_email ? 'border-red-500' : 'border-surface'
            )}
          />
          {errors.contact_email && (
            <p className="text-sm text-red-600 mt-1" role="alert">
              {errors.contact_email}
            </p>
          )}
          <p className="text-xs text-text/60 mt-1">
            This email is displayed in contact forms and site metadata.
          </p>
        </div>
      </SettingsSection>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
