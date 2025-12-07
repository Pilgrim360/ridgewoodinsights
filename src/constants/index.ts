export const SITE_NAME = 'Ridgewood Insights';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const SITE_DESCRIPTION =
  'Professional accounting services and financial insights for businesses and individuals.';

export const COMPANY_INFO = {
  name: 'Ridgewood Insights',
  tagline: 'Your Trusted Financial Partner',
  address: '123 Financial District, Suite 400, New York, NY 10005',
  phone: '(555) 123-4567',
  email: 'info@ridgewoodinsights.com',
};

export const SOCIAL_LINKS = [
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'https://twitter.com', label: 'Twitter' },
];

export const QUICK_LINKS = [
  { href: '/services', label: 'Our Services' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

// Services Data
export const SERVICES = [
  {
    id: 'tax-preparation',
    title: 'Tax Preparation & Planning',
    description: 'Comprehensive tax services for individuals and businesses. We help you minimize your tax liability while ensuring full compliance with all regulations.',
    href: '/services#tax-preparation',
    features: [
      'Individual & Business Tax Returns',
      'Quarterly Tax Reviews',
      'Tax Planning Strategies',
      'IRS Representation',
    ],
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping & Accounting',
    description: 'Keep your financial records accurate and up-to-date with our professional bookkeeping services. We handle the numbers so you can focus on growing your business.',
    href: '/services#bookkeeping',
    features: [
      'Monthly Bookkeeping',
      'Financial Statement Preparation',
      'Accounts Payable/Receivable',
      'Bank Reconciliation',
    ],
  },
  {
    id: 'financial-planning',
    title: 'Financial Planning',
    description: 'Strategic financial planning to help you achieve your personal and business goals. We create customized plans tailored to your unique situation.',
    href: '/services#financial-planning',
    features: [
      'Retirement Planning',
      'Investment Analysis',
      'Cash Flow Management',
      'Wealth Building Strategies',
    ],
  },
  {
    id: 'business-consulting',
    title: 'Business Consulting',
    description: 'Expert guidance to help your business thrive. From startup advice to growth strategies, we provide the insights you need to succeed.',
    href: '/services#business-consulting',
    features: [
      'Business Formation',
      'Growth Strategy',
      'Financial Analysis',
      'Process Optimization',
    ],
  },
  {
    id: 'payroll',
    title: 'Payroll Services',
    description: 'Reliable payroll processing that ensures your employees are paid accurately and on time. We handle all the complexities of payroll management.',
    href: '/services#payroll',
    features: [
      'Payroll Processing',
      'Tax Withholding & Filing',
      'Direct Deposit Setup',
      'Year-End W-2 Preparation',
    ],
  },
  {
    id: 'audit-assurance',
    title: 'Audit & Assurance',
    description: 'Independent audit and assurance services that provide confidence in your financial statements and help meet regulatory requirements.',
    href: '/services#audit-assurance',
    features: [
      'Financial Statement Audits',
      'Internal Audits',
      'Compliance Reviews',
      'Risk Assessment',
    ],
  },
];
export type Service = typeof SERVICES[number];

// Trust Signals Data
export const TRUST_SIGNALS = [
  {
    type: 'statistic' as const,
    title: 'Years of Experience',
    value: '15+',
    description: 'Serving clients with excellence',
  },
  {
    type: 'statistic' as const,
    title: 'Clients Served',
    value: '500+',
    description: 'Businesses and individuals',
  },
  {
    type: 'statistic' as const,
    title: 'Client Satisfaction',
    value: '98%',
    description: 'Based on client surveys',
  },
  {
    type: 'statistic' as const,
    title: 'Tax Savings',
    value: '$2M+',
    description: 'Saved for our clients annually',
  },
];

export const CREDENTIALS = [
  {
    type: 'credential' as const,
    title: 'CPA',
    value: 'Certified Public Accountant',
  },
  {
    type: 'credential' as const,
    title: 'CFA',
    value: 'Chartered Financial Analyst',
  },
  {
    type: 'credential' as const,
    title: 'QuickBooks',
    value: 'QuickBooks ProAdvisor',
  },
];

// Testimonials Data
export const TESTIMONIALS = [
  {
    id: 'testimonial-1',
    quote: 'Ridgewood Insights transformed our financial operations. Their expertise in tax planning saved us over $50,000 last year alone. Highly recommended!',
    author: 'Sarah Johnson',
    title: 'CEO',
    company: 'TechStart Inc.',
    rating: 5,
    service: 'Tax Planning',
  },
  {
    id: 'testimonial-2',
    quote: 'The team at Ridgewood is incredibly responsive and knowledgeable. They\'ve been managing our bookkeeping for 3 years and we couldn\'t be happier.',
    author: 'Michael Chen',
    title: 'Owner',
    company: 'Chen\'s Restaurant Group',
    rating: 5,
    service: 'Bookkeeping',
  },
  {
    id: 'testimonial-3',
    quote: 'As a small business owner, I was overwhelmed with financial decisions. Ridgewood provided clear guidance and helped me create a solid financial plan.',
    author: 'Emily Rodriguez',
    title: 'Founder',
    company: 'Bloom Boutique',
    rating: 5,
    service: 'Financial Planning',
  },
];

// Insights/Blog Data
export interface Insight {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  category: string;
  author: string;
  image?: string;
  link: string;
}

export const INSIGHTS = [
  {
    id: 'insight-1',
    title: '2024 Tax Changes: What Small Businesses Need to Know',
    excerpt: 'Stay ahead of the curve with our comprehensive guide to the latest tax law changes affecting small businesses this year.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Tax Planning',
    author: 'John Smith, CPA',
    link: '/insights/2024-tax-changes',
  },
  {
    id: 'insight-2',
    title: 'Maximizing Your Retirement Contributions',
    excerpt: 'Learn strategies to maximize your retirement savings while minimizing your current tax burden.',
    date: '2024-01-10',
    readTime: '4 min read',
    category: 'Financial Planning',
    author: 'Jane Doe, CFA',
    link: '/insights/retirement-contributions',
  },
  {
    id: 'insight-3',
    title: 'The Benefits of Quarterly Financial Reviews',
    excerpt: 'Discover why regular financial check-ups can help your business stay on track and identify opportunities for growth.',
    date: '2024-01-05',
    readTime: '3 min read',
    category: 'Business Strategy',
    author: 'John Smith, CPA',
    link: '/insights/quarterly-reviews',
  },
  {
    id: 'insight-4',
    title: 'Understanding Cash Flow Management for Entrepreneurs',
    excerpt: 'Master the fundamentals of cash flow management to ensure your business remains solvent and can seize growth opportunities.',
    date: '2024-01-01',
    readTime: '6 min read',
    category: 'Business Strategy',
    author: 'Mike Johnson, CPA',
    link: '/insights/cash-flow-management',
  },
  {
    id: 'insight-5',
    title: 'Investment Strategies for High-Net-Worth Individuals',
    excerpt: 'Explore sophisticated investment approaches designed to preserve and grow wealth for affluent clients.',
    date: '2023-12-28',
    readTime: '7 min read',
    category: 'Financial Planning',
    author: 'Jane Doe, CFA',
    link: '/insights/investment-strategies',
  },
  {
    id: 'insight-6',
    title: 'Navigating Business Succession Planning',
    excerpt: 'Learn how to create a comprehensive succession plan that ensures your business legacy continues smoothly.',
    date: '2023-12-20',
    readTime: '5 min read',
    category: 'Business Consulting',
    author: 'John Smith, CPA',
    link: '/insights/succession-planning',
  },
  {
    id: 'insight-7',
    title: 'Year-End Tax Planning Checklist',
    excerpt: 'Don\'t miss these critical year-end tax planning opportunities to optimize your 2024 tax position.',
    date: '2023-12-15',
    readTime: '4 min read',
    category: 'Tax Planning',
    author: 'Mike Johnson, CPA',
    link: '/insights/year-end-tax-planning',
  },
  {
    id: 'insight-8',
    title: 'The Impact of Inflation on Retirement Planning',
    excerpt: 'Understand how rising inflation affects retirement savings and learn strategies to protect your nest egg.',
    date: '2023-12-10',
    readTime: '5 min read',
    category: 'Financial Planning',
    author: 'Jane Doe, CFA',
    link: '/insights/inflation-retirement',
  },
  {
    id: 'insight-9',
    title: 'Digital Transformation in Accounting Practices',
    excerpt: 'Explore how technology is revolutionizing the accounting industry and what it means for small businesses.',
    date: '2023-12-05',
    readTime: '6 min read',
    category: 'Business Strategy',
    author: 'John Smith, CPA',
    link: '/insights/digital-transformation',
  },
  {
    id: 'insight-10',
    title: 'Estate Planning Essentials for Business Owners',
    excerpt: 'Protect your business and family with comprehensive estate planning strategies tailored for entrepreneurs.',
    date: '2023-11-30',
    readTime: '7 min read',
    category: 'Estate Planning',
    author: 'Mike Johnson, CPA',
    link: '/insights/estate-planning-business',
  },
  {
    id: 'insight-11',
    title: 'Understanding Business Valuation Methods',
    excerpt: 'Learn the key approaches to valuing a business, whether for sale, partnership, or strategic planning.',
    date: '2023-11-25',
    readTime: '6 min read',
    category: 'Business Consulting',
    author: 'Jane Doe, CFA',
    link: '/insights/business-valuation',
  },
  {
    id: 'insight-12',
    title: 'Tax Implications of Remote Work Policies',
    excerpt: 'Navigate the tax considerations when implementing or updating remote work arrangements for your employees.',
    date: '2023-11-20',
    readTime: '4 min read',
    category: 'Tax Planning',
    author: 'John Smith, CPA',
    link: '/insights/remote-work-tax',
  },
];

// Team Members Data
export const TEAM_MEMBERS = [
  {
    id: 'john-smith',
    name: 'John Smith',
    title: 'Founder & Managing Partner',
    credentials: ['CPA', 'MBA'],
    bio: 'With over 20 years of experience in public accounting, John founded Ridgewood Insights to provide personalized financial services to businesses and individuals.',
    image: '/images/team/john-smith.jpg',
  },
  {
    id: 'jane-doe',
    name: 'Jane Doe',
    title: 'Senior Financial Advisor',
    credentials: ['CFA', 'CFP'],
    bio: 'Jane specializes in wealth management and retirement planning, helping clients achieve their long-term financial goals.',
    image: '/images/team/jane-doe.jpg',
  },
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    title: 'Tax Manager',
    credentials: ['CPA', 'EA'],
    bio: 'Mike leads our tax practice, bringing expertise in both individual and corporate tax planning and compliance.',
    image: '/images/team/mike-johnson.jpg',
  },
];

// Company Values
export const COMPANY_VALUES = [
  {
    title: 'Integrity',
    description: 'We uphold the highest ethical standards in everything we do, ensuring transparency and honesty in all client relationships.',
  },
  {
    title: 'Excellence',
    description: 'We strive for excellence in every service we provide, continuously improving our skills and knowledge.',
  },
  {
    title: 'Client Focus',
    description: 'Your success is our priority. We take the time to understand your unique needs and tailor our services accordingly.',
  },
  {
    title: 'Innovation',
    description: 'We embrace technology and innovative solutions to deliver more efficient and effective financial services.',
  },
];
