import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { generateOrganizationSchema } from '@/lib/schema';
import { COMPANY_INFO, LOGOS, SOCIAL_LINKS } from '@/constants';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const BASE_URL = 'https://ridgewoodinsights.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Ridgewood Insights - Professional Accounting & Tax Services in Zambia',
  description:
    'Professional accounting and tax services in Zambia. Expert bookkeeping, VAT returns, ZRA compliance, payroll management, and tax planning for businesses across Africa.',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZM',
    url: BASE_URL,
    siteName: 'Ridgewood Insights',
    title: 'Ridgewood Insights - Professional Accounting & Tax Services in Zambia',
    description:
      'Professional accounting and tax services in Zambia. Expert bookkeeping, VAT returns, ZRA compliance, payroll management, and tax planning for businesses across Africa.',
    images: [
      {
        url: LOGOS.scrolling,
        width: 1200,
        height: 630,
        alt: 'Ridgewood Insights - Accounting & Tax Services Zambia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ridgewood Insights - Professional Accounting & Tax Services in Zambia',
    description:
      'Professional accounting and tax services in Zambia. Expert bookkeeping, VAT returns, ZRA compliance, payroll management, and tax planning.',
    images: [LOGOS.scrolling],
  },
};

// Generate Organization schema for structured data
const organizationSchema = generateOrganizationSchema({
  name: COMPANY_INFO.name,
  url: BASE_URL,
  logo: LOGOS.scrolling,
  description:
    'Professional accounting and tax services firm based in Zambia, serving businesses across Africa with expertise in bookkeeping, VAT compliance, ZRA filings, and tax planning.',
  email: COMPANY_INFO.email,
  phone: COMPANY_INFO.phone,
  address: {
    streetAddress: 'Lusaka Business District',
    addressLocality: 'Lusaka',
    addressRegion: 'Lusaka Province',
    postalCode: '10101',
    addressCountry: 'ZM',
  },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-76KFBMV216"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-76KFBMV216');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased bg-background flex min-h-screen flex-col`}>
        {children}
      </body>
    </html>
  );
}