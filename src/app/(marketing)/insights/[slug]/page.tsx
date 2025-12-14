import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

  return (
    <article className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-secondary text-white pt-32 pb-16 md:pt-40 md:pb-24">
        <Container maxWidth="lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-primary text-white border-transparent">
                {post.category}
              </Badge>
              <span className="text-white/60 text-sm">
                {formatDate(post.date)}
              </span>
              {post.readTime && (
                <span className="text-white/60 text-sm">
                  • {post.readTime}
                </span>
              )}
            </div>

            <Heading as={1} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
              {post.title}
            </Heading>

            <div className="flex items-center gap-3 border-t border-white/10 pt-8">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-white/60">Author</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container maxWidth="lg" className="mt-[-4rem] relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          {post.image && (
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8 md:p-12 lg:p-16">
            {/* Content */}
            <div 
              className="prose prose-lg prose-slate max-w-none 
                prose-headings:text-secondary prose-headings:font-bold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer / Share / Back */}
            <div className="mt-16 pt-8 border-t border-surface flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <Link href="/insights">
                  <Button variant="outline">
                    ← Back to Insights
                  </Button>
                </Link>
              </div>
              
              {/* Add share buttons here if needed */}
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}