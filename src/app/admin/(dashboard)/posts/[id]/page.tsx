'use client';

import { useParams } from 'next/navigation';
import { Editor } from '@/components/admin/PostEditor/Editor';
import { EditorState } from '@/hooks/usePostEditor';
import { usePostById } from '@/hooks/queries/usePostsQueries';

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;

  const postQuery = usePostById(postId);

  if (postQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary mx-auto mb-4" />
          <p className="text-secondary">Loading post...</p>
        </div>
      </div>
    );
  }

  const data = postQuery.data;

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-secondary">Post not found</p>
        </div>
      </div>
    );
  }

  const initialData: EditorState = {
    title: data.title,
    slug: data.slug,
    content: data.content || data.content_html || '',
    category_id: data.category_id || null,
    cover_image: data.cover_image || null,
    status:
      (data.status === 'published' || data.status === 'draft' || data.status === 'scheduled'
        ? data.status
        : 'draft') as EditorState['status'],
    excerpt: data.excerpt || '',
    published_at: data.published_at,
    disclaimer_type: data.disclaimer_type ?? 'none',
  };

  return <Editor postId={postId} initialData={initialData} />;
}
