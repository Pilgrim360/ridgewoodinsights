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
        {/* Editorial Header Section */}
        <header className="pt-16 pb-12 md:pt-24 md:pb-16 bg-white">
          <Container maxWidth="xl">
            <div className="max-w-3xl mx-auto text-center">
              {/* Category Badge */}
              <div className="flex justify-center mb-6">
                <Badge className="bg-surface text-secondary/80 hover:bg-surface-darker transition-colors border-transparent px-3 py-1 text-xs uppercase tracking-widest font-semibold">
                  {post.category}
                </Badge>
              </div>

              {/* Title */}
              <Heading
                as={1}
                className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-secondary mb-6 leading-tight tracking-tight"
              >
                {post.title}
              </Heading>

              {/* Metadata */}
              <div className="flex items-center justify-center gap-3 text-secondary/60 text-sm md:text-base font-medium">
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                {post.readTime && (
                  <>
                    <span className="text-secondary/30">•</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </div>
            </div>
          </Container>
        </header>

        {/* Hero Image - Wide Bleed style */}
        {post.image && (
          <Container maxWidth="2xl" className="mb-16 md:mb-20">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl shadow-2xl shadow-secondary/5">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Container>
        )}

        {/* Content Section */}
        <Container maxWidth="xl">
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
                  prose-p:text-text prose-p:leading-relaxed prose-p:font-normal
                  prose-strong:text-secondary prose-strong:font-semibold
                  prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary transition-colors
                  prose-blockquote:border-l-primary prose-blockquote:text-secondary/80 prose-blockquote:italic
                  prose-img:rounded-lg prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />

              {/* Share Buttons (Mobile and Tablet) */}
              <div className="xl:hidden mt-12 pt-8 border-t border-surface">
                <p className="text-sm text-secondary/60 mb-4 font-medium uppercase tracking-wider">Share this article</p>
                <ShareButtons title={post.title} />
              </div>

              {/* Navigation Footer */}
              <div className="mt-20 pt-10 border-t border-surface flex items-center justify-between">
                <Link href="/insights">
                  <Button variant="ghost" className="pl-0 text-secondary hover:text-primary hover:bg-transparent -ml-4 group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Insights
                  </Button>
                </Link>

                <div className="text-xs text-secondary/40 font-medium">
                  © {new Date().getFullYear()} Ridgewood Insights
                </div>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}