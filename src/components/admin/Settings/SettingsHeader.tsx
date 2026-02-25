'use client';

import { Check, AlertCircle, Clock, Loader2 } from 'lucide-react';

interface SettingsHeaderProps {
  isDirty?: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  saveError?: string | null;
}

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

export function SettingsHeader({ isDirty, isSaving, lastSaved, saveError }: SettingsHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Settings</h1>
        <p className="text-sm text-text/60 mt-0.5">Configure site-wide settings and information.</p>
      </div>

      <div className="flex items-center gap-1.5 text-xs mt-1">
        {saveError ? (
          <span className="flex items-center gap-1.5 text-red-600" role="alert">
            <AlertCircle className="w-3.5 h-3.5" />
            {saveError}
          </span>
        ) : isSaving ? (
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
    </div>
  );
}
