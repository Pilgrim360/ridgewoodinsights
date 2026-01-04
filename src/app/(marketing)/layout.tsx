import type { Metadata } from 'next';
import { ClientLayout } from '@/app/ClientLayout';
import { generateLocalBusinessSchema } from '@/lib/schema';
import { COMPANY_INFO, LOGOS, SOCIAL_LINKS } from '@/constants';

const BASE_URL = 'https://ridgewoodinsights.com';

export const metadata: Metadata = {
  title: {
    template: '%s | Ridgewood Insights',
    default: 'Ridgewood Insights - Professional Accounting & Tax Services in Zambia',
  },
  description:
    'Expert accounting and tax services in Zambia. Specializing in bookkeeping, VAT returns, ZRA compliance, payroll management, NAPSA filings, financial statements, and tax planning for businesses across Africa.',
  keywords: [
    'accounting Zambia',
    'tax services Lusaka',
    'ZRA compliance',
    'VAT Zambia',
    'bookkeeping Zambia',
    'NAPSA compliance',
    'tax planning Zambia',
    'payroll management Zambia',
    'financial statements Zambia',
    'business formation Zambia',
    'accounting services Africa',
    'Lusaka accountant',
    'Zambian tax consultant',
    'ZRA tax filing',
    'VAT returns Zambia',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_ZM',
    siteName: 'Ridgewood Insights',
    url: BASE_URL,
    images: [
      {
        url: LOGOS.scrolling,
        width: 1200,
        height: 630,
        alt: 'Ridgewood Insights - Professional Accounting & Tax Services in Zambia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ridgewoodinsights',
    creator: '@ridgewoodinsights',
  },
  other: {
    'geo.region': 'ZM-09', // Zambia - Lusaka Province
    'geo.placename': 'Lusaka',
    'geo.position': '-15.4167;28.2833', // Lusaka coordinates
  },
};

// Generate LocalBusiness schema for marketing pages
const localBusinessSchema = generateLocalBusinessSchema({
  name: COMPANY_INFO.name,
  url: BASE_URL,
  logo: LOGOS.scrolling,
  description:
    'Professional accounting and tax services firm in Lusaka, Zambia. We provide comprehensive bookkeeping, VAT compliance, ZRA filings, NAPSA management, payroll services, and strategic tax planning for businesses and individuals across Zambia and Africa.',
  email: COMPANY_INFO.email,
  phone: COMPANY_INFO.phone,
  address: {
    streetAddress: 'Lusaka Business District',
    addressLocality: 'Lusaka',
    addressRegion: 'Lusaka Province',
    postalCode: '10101',
    addressCountry: 'ZM',
  },
  geo: {
    latitude: -15.4167,
    longitude: 28.2833,
  },
  openingHours: ['Mo-Fr 08:00-17:00'],
  priceRange: '$',
  sameAs: SOCIAL_LINKS.map((link) => link.href),
});

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}
