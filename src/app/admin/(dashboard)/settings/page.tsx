'use client';

import { useEffect, useState } from 'react';
import { SiteSettings } from '@/types/admin';
import { SettingsForm } from '@/components/admin/Settings/SettingsForm';
import { useSiteSettings } from '@/hooks/queries/useSettingsQueries';
import { useUpdateSettings } from '@/hooks/queries/useAdminMutations';

const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'Ridgewood Insights',
  site_tagline: 'Financial insights for accountants',
  contact_email: 'enquiries@ridgewoodinsights.com',
};

export default function SettingsPage() {
  const settingsQuery = useSiteSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!settingsQuery.data) return;
    setIsDirty(false);
  }, [settingsQuery.data]);

  const handleSave = async (newSettings: SiteSettings) => {
    try {
      await updateSettingsMutation.mutateAsync(newSettings);
      setIsDirty(false);
      setLastSaved(new Date());
    } catch {
      // Error handled by toast
    }
  };

  if (settingsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary" />
      </div>
    );
  }

  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-secondary">Settings</h1>
        {lastSaved && (
          <span className="text-xs text-text/60">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      <SettingsForm
        key={settingsQuery.dataUpdatedAt}
        settings={settings}
        isSaving={updateSettingsMutation.isPending}
        onSave={handleSave}
      />
    </div>
  );
}
