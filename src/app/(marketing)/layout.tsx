import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Ridgewood Insights',
    default: 'Ridgewood Insights - Accounting and Financial Insights Firm',
  },
  description:
    'Professional accounting services and financial insights for businesses and individuals. Tax preparation, bookkeeping, financial planning, and business consulting.',
  keywords: [
    'accounting',
    'tax preparation',
    'bookkeeping',
    'financial planning',
    'business consulting',
    'CPA',
    'New York accountant',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ridgewood Insights',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
