'use client';

import { useEffect, useState } from 'react';
import { SiteSettings } from '@/types/cms';
import { CmsPageHeader } from '@/components/cms/CmsPageHeader';
import { SettingsForm } from '@/components/cms/Settings/SettingsForm';
import { useSiteSettings } from '@/hooks/queries/useSettingsQueries';
import { useUpdateSettings } from '@/hooks/queries/useCmsMutations';
import { Check, AlertCircle, Clock, Loader2 } from 'lucide-react';

const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'Ridgewood Insights',
  site_tagline: 'Financial insights for accountants',
  contact_email: 'enquiries@ridgewoodinsights.com',
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

  function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary mx-auto mb-4" />
          <p className="text-secondary text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;

  return (
    <div className="max-w-2xl">
      <CmsPageHeader
        title="Settings"
        description="Configure site-wide settings and information."
        actions={
          <div className="flex items-center gap-1.5 text-xs">
            {saveError ? (
              <span className="flex items-center gap-1.5 text-red-600" role="alert">
                <AlertCircle className="w-3.5 h-3.5" />
                {saveError}
              </span>
            ) : updateSettingsMutation.isPending ? (
              <span className="flex items-center gap-1.5 text-text/50">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving…
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1.5 text-amber-600">
                <Clock className="w-3.5 h-3.5" />
                Unsaved changes
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5 text-text/50">
                <Check className="w-3.5 h-3.5" />
                Saved {formatRelativeTime(lastSaved)}
              </span>
            ) : null}
          </div>
        }
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
