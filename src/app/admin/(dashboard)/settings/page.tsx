'use client';

import { useEffect, useState } from 'react';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { useDataRefresh } from '@/contexts/DataRefreshContext';
import { getSettings, updateSettings } from '@/lib/admin/settings';
import { SiteSettings } from '@/types/admin';
import { SettingsHeader } from '@/components/admin/Settings/SettingsHeader';
import { SettingsForm } from '@/components/admin/Settings/SettingsForm';

const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'Ridgewood Insights',
  site_tagline: 'Financial insights for accountants',
  contact_email: 'hello@ridgewoodinsights.com',
};

export default function SettingsPage() {
  const { showError, showSuccess } = useAdminError();
  const { refreshKey } = useDataRefresh();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load settings on mount and when data is refreshed
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const data = await getSettings();
        setSettings(data);
        setIsDirty(false);
        setLastSaved(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load settings';
        showError(errorMessage);
        setSaveError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [showError, refreshKey]);

  const handleSave = async (newSettings: SiteSettings) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Validate before saving
      if (!newSettings.site_title.trim()) {
        throw new Error('Site title is required');
      }
      if (!newSettings.site_tagline.trim()) {
        throw new Error('Site tagline is required');
      }
      if (!newSettings.contact_email.trim()) {
        throw new Error('Contact email is required');
      }

      // Save to database
      await updateSettings(newSettings);

      // Update local state
      setSettings(newSettings);
      setIsDirty(false);
      setLastSaved(new Date());
      setSaveError(null);

      showSuccess('Settings saved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save settings';
      setSaveError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary mx-auto mb-4" />
          <p className="text-secondary">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <SettingsHeader
        isDirty={isDirty}
        isSaving={isSaving}
        lastSaved={lastSaved}
        saveError={saveError}
      />

      <SettingsForm
        settings={settings}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </div>
  );
}
