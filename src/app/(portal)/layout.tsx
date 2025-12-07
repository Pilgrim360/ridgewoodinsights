import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal | Ridgewood Insights',
  description: 'Secure client portal for Ridgewood Insights.',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {children}
    </div>
  );
}