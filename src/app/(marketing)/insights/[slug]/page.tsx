import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog';
import { sanitizeContent } from '@/lib/cms/html';
import { generateBlogPostingSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { LOGOS } from '@/constants';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { ShareButtons } from '@/components/ShareButtons';

const BASE_URL = 'https://ridgewoodinsights.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const postUrl = `${BASE_URL}/insights/${slug}`;

  return {
    title: `${post.title} | Ridgewood Insights`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url: postUrl,
      siteName: 'Ridgewood Insights',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const cleanContent = sanitizeContent(post.content);

  // Generate structured data for blog post
  const postUrl = `${BASE_URL}/insights/${slug}`;
  const blogPostingSchema = generateBlogPostingSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: post.author,
    publisher: {
      name: 'Ridgewood Insights',
      logo: LOGOS.scrolling,
    },
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
    mainEntityOfPage: postUrl,
    articleSection: post.category,
    keywords: [post.category, 'accounting Zambia', 'tax services', 'business insights'],
  });

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Insights', url: `${BASE_URL}/insights` },
    { name: post.title, url: postUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ReadingProgress />
      
      <article className="min-h-screen bg-white pb-20">
        {/* Hero Section with Background Image */}
        {post.image && (
          <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
            {/* Background Image */}
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient Overlay - Sophisticated darkening for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

            {/* Hero Content - Skewed to the bottom for image visibility */}
            <div className="absolute inset-0 flex items-end justify-center text-center pb-8 md:pb-12">
              <Container maxWidth="xl">
                <div className="max-w-4xl mx-auto px-4">
                  {/* Category Badge */}
                  <div className="flex justify-center mb-3">
                    <Badge className="bg-white/95 text-secondary backdrop-blur-sm hover:bg-white transition-colors border-transparent px-2 py-0.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold">
                      {post.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <Heading
                    as={1}
                    className="text-2xl md:text-4xl lg:text-5xl font-sans font-extrabold text-white mb-3 md:mb-4 leading-[1.1] tracking-tight drop-shadow-sm"
                  >
                    {post.title}
                  </Heading>

                  {/* Metadata */}
                  <div className="flex items-center justify-center gap-4 text-white/80 text-sm md:text-base font-medium tracking-wide">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    {post.readTime && (
                      <>
                        <span className="text-white/40">•</span>
                        <span>{post.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </Container>
            </div>
          </div>
        )}

        {/* Content Section */}
        <Container maxWidth="xl" className="py-12 md:py-16">
          <div className="relative">
            {/* Desktop Share Buttons - Floating to the left */}
            <div className="hidden xl:block absolute -left-24 top-0 h-full">
              <div className="sticky top-32">
                 <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-tighter mb-4 -rotate-90 origin-left translate-x-4">Share</p>
                 <ShareButtons title={post.title} />
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:text-secondary prose-headings:font-bold prose-headings:tracking-tight
                  prose-headings:mt-4 prose-headings:mb-2
                  prose-p:text-text prose-p:leading-relaxed prose-p:font-normal
                  prose-p:mb-2
                  prose-strong:text-secondary prose-strong:font-semibold
                  prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary transition-colors
                  prose-blockquote:border-l-primary prose-blockquote:text-secondary/80 prose-blockquote:italic prose-blockquote:my-2
                  prose-ul:my-2 prose-ol:my-2 prose-li:my-0
                  prose-img:rounded-lg prose-img:shadow-sm prose-img:my-4"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />

              {/* Share Buttons (Mobile and Tablet) */}
              <div className="xl:hidden mt-12 pt-8 border-t border-surface">
                <p className="text-sm text-secondary/60 mb-4 font-medium uppercase tracking-wider">Share this article</p>
                <ShareButtons title={post.title} />
              </div>

              {/* Navigation Footer */}
              <div className="mt-20 pt-10 border-t border-surface">
                <Link href="/insights">
                  <Button variant="ghost" className="pl-0 text-secondary hover:text-primary hover:bg-transparent -ml-4 group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Insights
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}