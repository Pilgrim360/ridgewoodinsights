'use client';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="bg-white border border-surface rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-secondary">{title}</h2>
        {description && (
          <p className="text-sm text-text/60 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
