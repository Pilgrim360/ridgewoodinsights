'use client';

interface SettingsHeaderProps {
  isDirty?: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  saveError?: string | null;
}

export function SettingsHeader({
  isDirty,
  isSaving,
  lastSaved,
  saveError,
}: SettingsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Settings</h1>
          <p className="text-sm text-text/60 mt-1">
            Configure site-wide settings and information.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {saveError && (
            <span className="text-red-600" role="alert">
              {saveError}
            </span>
          )}
          {isSaving && (
            <span className="text-text/60 flex items-center gap-1">
              <div className="h-3 w-3 animate-spin rounded-full border border-text/30 border-t-text" />
              Saving...
            </span>
          )}
          {!isSaving && !isDirty && lastSaved && (
            <span className="text-text/60">
              Saved {formatRelativeTime(lastSaved)}
            </span>
          )}
          {isDirty && !isSaving && (
            <span className="text-amber-600">Changes not saved</span>
          )}
        </div>
      </div>
    </div>
  );
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
