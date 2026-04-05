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

      <article className="min-h-screen bg-white">
        {post.image ? (
          <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden md:h-[52vh]">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

            <div className="absolute inset-0 flex items-end">
              <Container maxWidth="xl">
                <header className="max-w-3xl px-4 pb-10 md:pb-14">
                  <Badge className="mb-4 border-transparent bg-white/90 px-3 py-1 text-xs text-secondary backdrop-blur-sm">
                    {post.category}
                  </Badge>

                  <Heading
                    as={1}
                    className="mb-4 text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
                  >
                    {post.title}
                  </Heading>

                  {post.excerpt && (
                    <p className="mb-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-white/80">
                    <span>{formatDate(post.date)}</span>
                    {post.readTime && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{post.readTime}</span>
                      </>
                    )}
                  </div>
                </header>
              </Container>
            </div>
          </div>
        ) : (
          <Container maxWidth="xl" className="border-b border-surface py-12 md:py-16">
            <header className="mx-auto max-w-3xl px-4 text-center md:px-0">
              <Badge className="mb-4 border-transparent bg-primary/10 px-3 py-1 text-xs text-primary">{post.category}</Badge>
              <Heading as={1} className="mb-4 text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                {post.title}
              </Heading>
              {post.excerpt && <p className="mb-6 text-base leading-relaxed text-text md:text-lg">{post.excerpt}</p>}
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-text/80">
                <span>{formatDate(post.date)}</span>
                {post.readTime && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </div>
            </header>
          </Container>
        )}

        <Container maxWidth="xl" className="py-12 md:py-16 lg:py-20">
          <div className="relative flex flex-col gap-8 md:flex-row md:gap-10 lg:gap-12">
            <aside className="hidden w-12 flex-shrink-0 md:block" aria-label="Share this article">
              <div className="sticky top-28">
                <ShareButtons title={post.title} />
              </div>
            </aside>

            <div className="mx-auto w-full max-w-[72ch] md:mx-0">
              <div
                className="prose prose-base max-w-none text-text md:prose-lg
                  prose-headings:text-secondary prose-headings:font-semibold prose-headings:tracking-tight prose-headings:scroll-mt-28
                  prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3
                  prose-p:leading-8 prose-p:mb-6
                  prose-strong:text-secondary prose-strong:font-semibold
                  prose-a:text-primary prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary
                  prose-ul:my-6 prose-ol:my-6 prose-li:my-1 prose-li:marker:text-primary
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-background prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:text-secondary/90
                  prose-img:my-10 prose-img:rounded-xl prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />

              <div className="mt-12 border-t border-surface pt-8 md:hidden">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-secondary/70">Share this article</p>
                <ShareButtons title={post.title} />
              </div>

              <div className="mt-14 border-t border-surface pt-8">
                <Link href="/insights">
                  <Button variant="ghost" className="-ml-4 pl-0 text-secondary hover:bg-transparent hover:text-primary group">
                    <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Back to Insights
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
