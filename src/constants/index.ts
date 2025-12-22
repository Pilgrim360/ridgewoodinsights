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
  whatsapp: 'https://wa.me/15551234567',
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
    id: 'bookkeeping',
    title: 'Bookkeeping',
    description: 'Accurate financial records that stand up to scrutiny. We manage your accounts payable, receivable, and bank reconciliation to ensure your books are always audit-ready.',
    href: '/services#bookkeeping',
    imageSrc: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: [
      'Monthly Bookkeeping & Record Maintenance',
      'Accounts Payable/Receivable Management',
      'Bank Reconciliation',
      'Compliance Tracking',
    ],
  },
  {
    id: 'payroll-management',
    title: 'Payroll Management',
    description: 'Reliable payroll processing that ensures your team is paid accurately and on time. We handle tax withholding, statutory deductions, and all related compliance obligations.',
    href: '/services#payroll-management',
    imageSrc: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: [
      'Monthly Payroll Processing',
      'Tax Withholding & Statutory Deductions',
      'Employee Benefits Administration',
      'Statutory Returns Filing',
    ],
  },
  {
    id: 'tax-preparation',
    title: 'Tax Preparation',
    description: 'Expert tax preparation that minimizes your liability while ensuring full regulatory compliance. We handle income tax returns, VAT management, and strategic tax planning.',
    href: '/services#tax-preparation',
    imageSrc: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: [
      'Corporate & Personal Income Tax Returns',
      'VAT Returns & Management',
      'Income Tax Compliance',
      'Tax Planning & Optimization',
    ],
  },
  {
    id: 'financial-statement-preparation',
    title: 'Financial Statement Preparation',
    description: 'Professional financial statements prepared in accordance with international standards. Clear, credible reporting for lenders, investors, and stakeholders.',
    href: '/services#financial-statement-preparation',
    imageSrc: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: [
      'Consolidated Financial Statements',
      'Balance Sheet & Income Statement Preparation',
      'Cash Flow Analysis',
      'Notes & Disclosures',
    ],
  },
  {
    id: 'business-formation',
    title: 'Business Formation',
    description: 'From concept to launch. We guide you through company registration, tax registration, and licensing to get your business operating legally and efficiently.',
    href: '/services#business-formation',
    imageSrc: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: [
      'Company Registration & Registration Number',
      'Tax Identification & Statutory Registration',
      'Business License & Permit Acquisition',
      'Regulatory Documentation & Filing',
    ],
  },
  {
    id: 'regulatory-compliance',
    title: 'Regulatory Compliance',
    description: 'Stay compliant and avoid penalties. We handle audits, statutory filings, labor law requirements, and industry-specific regulations so you can focus on business.',
    href: '/services#regulatory-compliance',
    imageSrc: 'https://images.pexels.com/photos/4386330/pexels-photo-4386330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: [
      'Audit Preparation & Support',
      'Annual Statutory Filing',
      'Labor Law & Benefits Compliance',
      'Industry & Environmental Regulations',
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
    avatar: 'https://images.unsplash.com/photo-1704307708227-356fe9fed262?q=80&w=870&auto=format&fit=crop&ixlib',
    rating: 5,
    service: 'Tax Planning',
  },
  {
    id: 'testimonial-2',
    quote: 'The team at Ridgewood is incredibly responsive and knowledgeable. They\'ve been managing our bookkeeping for 3 years and we couldn\'t be happier.',
    author: 'Michael Chen',
    title: 'Owner',
    company: 'Chen\'s Restaurant Group',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 5,
    service: 'Bookkeeping',
  },
  {
    id: 'testimonial-3',
    quote: 'As a small business owner, I was overwhelmed with financial decisions. Ridgewood provided clear guidance and helped me create a solid financial plan.',
    author: 'Emily Rodriguez',
    title: 'Founder',
    company: 'Bloom Boutique',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1610&q=80',
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
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1613&q=80',
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
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid',
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
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1426&q=80',
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
    image: 'https://images.unsplash.com/photo-1554224154-26032fced907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80',
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
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c8a1f06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1587825140400-5fc38fef5b9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
