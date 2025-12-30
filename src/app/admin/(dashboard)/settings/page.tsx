'use client';

import { useEffect, useState } from 'react';
import { SiteSettings } from '@/types/admin';
import { SettingsHeader } from '@/components/admin/Settings/SettingsHeader';
import { SettingsForm } from '@/components/admin/Settings/SettingsForm';
import { useSiteSettings } from '@/hooks/queries/useSettingsQueries';
import { useUpdateSettings } from '@/hooks/queries/useAdminMutations';

const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'Ridgewood Insights',
  site_tagline: 'Financial insights for accountants',
  contact_email: 'hello@ridgewoodinsights.com',
};

export default function SettingsPage() {
  const settingsQuery = useSiteSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!settingsQuery.data) return;

    setIsDirty(false);
    setSaveError(null);
  }, [settingsQuery.data]);

  const handleSave = async (newSettings: SiteSettings) => {
    setSaveError(null);

    try {
      if (!newSettings.site_title.trim()) {
        throw new Error('Site title is required');
      }
      if (!newSettings.site_tagline.trim()) {
        throw new Error('Site tagline is required');
      }
      if (!newSettings.contact_email.trim()) {
        throw new Error('Contact email is required');
      }

      await updateSettingsMutation.mutateAsync(newSettings);
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save settings';
      setSaveError(errorMessage);
    }
  };

  if (settingsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary mx-auto mb-4" />
          <p className="text-secondary">Loading settings...</p>
        </div>
      </div>
    );
  }

  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;

  return (
    <div className="max-w-2xl">
      <SettingsHeader
        isDirty={isDirty}
        isSaving={updateSettingsMutation.isPending}
        lastSaved={lastSaved}
        saveError={saveError}
      />

      <SettingsForm
        key={settingsQuery.dataUpdatedAt}
        settings={settings}
        isSaving={updateSettingsMutation.isPending}
        onSave={handleSave}
      />
    </div>
  );
}
