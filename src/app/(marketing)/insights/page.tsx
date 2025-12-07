import { Metadata } from 'next';
import { InsightsPage } from '../../../components/pages/InsightsPage';

export const metadata: Metadata = {
  title: 'Insights | Ridgewood Insights',
  description: 'Stay informed with the latest financial insights, tax tips, and business strategies from Ridgewood Insights. Expert guidance for your financial success.',
  keywords: 'financial insights, tax planning, business advice, accounting tips, financial planning',
  openGraph: {
    title: 'Insights | Ridgewood Insights',
    description: 'Stay informed with the latest financial insights, tax tips, and business strategies from Ridgewood Insights.',
    type: 'website',
  },
};

export default function Insights() {
  return <InsightsPage />;
}