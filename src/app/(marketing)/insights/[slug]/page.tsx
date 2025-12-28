import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog';
import { sanitizeContent } from '@/lib/admin/html';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { ShareButtons } from '@/components/ShareButtons';

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

  return {
    title: `${post.title} | Ridgewood Insights`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
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

  return (
    <>
      <ReadingProgress />
      
      <article className="min-h-screen pb-24 bg-white">
        {/* Minimalist Hero Section */}
        <div className="pt-8 pb-8 md:pt-12 md:pb-12">
            <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-transparent px-3 py-1">
                  {post.category}
                </Badge>
              </div>

              <Heading as={1} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary mb-6 leading-tight tracking-tight">
                {post.title}
              </Heading>

              <div className="flex flex-wrap items-center justify-center gap-3 text-secondary/40 text-sm font-medium">
                <span>
                  {formatDate(post.date)}
                </span>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>

        {/* Featured Image */}
        {post.image && (
          <Container className="mb-16 md:mb-24">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
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

        <Container>
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 relative">
            
            {/* Sidebar / Share Buttons - Sticky on Desktop */}
            <div className="hidden md:block w-12 flex-shrink-0">
              <div className="sticky top-32">
                 <ShareButtons title={post.title} />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl mx-auto md:mx-0">
              <div 
                className="prose prose-lg md:prose-xl prose-slate max-w-none 
                  prose-headings:text-secondary prose-headings:font-bold prose-headings:tracking-tight
                  prose-p:text-text prose-p:leading-8 prose-p:font-light
                  prose-strong:text-secondary prose-strong:font-semibold
                  prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary transition-colors
                  prose-blockquote:border-l-primary prose-blockquote:text-secondary/80 prose-blockquote:italic
                  prose-img:rounded-lg prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />

              {/* Mobile Share Buttons */}
              <div className="md:hidden mt-12 pt-8 border-t border-surface">
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