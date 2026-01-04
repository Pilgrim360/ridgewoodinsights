import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Stay informed with expert financial insights, tax tips, and business strategies from Ridgewood Insights. Get the latest guidance on accounting, VAT compliance, ZRA regulations, and tax planning in Zambia and across Africa.',
  keywords: [
    'financial insights Zambia',
    'tax planning advice',
    'business advice Zambia',
    'accounting tips Zambia',
    'ZRA regulations',
    'VAT compliance tips',
    'NAPSA guidance',
    'tax strategy Zambia',
    'business insights Africa',
    'financial planning Zambia',
  ],
  alternates: {
    canonical: 'https://ridgewoodinsights.com/insights',
  },
  openGraph: {
    title: 'Insights | Ridgewood Insights',
    description:
      'Stay informed with expert financial insights, tax tips, and business strategies from Ridgewood Insights. Get the latest guidance on accounting, VAT compliance, ZRA regulations, and tax planning in Zambia.',
    url: 'https://ridgewoodinsights.com/insights',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights | Ridgewood Insights',
    description:
      'Expert financial insights, tax tips, and business strategies for Zambian businesses. Stay informed on ZRA regulations, VAT compliance, and tax planning.',
  },
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
