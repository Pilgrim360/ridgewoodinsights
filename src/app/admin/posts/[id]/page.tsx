'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Editor } from '@/components/admin/PostEditor/Editor';
import { getPost } from '@/lib/admin/posts';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { EditorState } from '@/hooks/usePostEditor';

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const { showError } = useAdminError();
  const [post, setPost] = useState<EditorState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(postId);
        if (!data) {
          showError('Post not found');
          return;
        }

        setPost({
          title: data.title,
          slug: data.slug,
          content: data.content || data.content_html || '',
          category_id: data.category_id || null,
          cover_image: data.cover_image || null,
          status: (data.status === 'published' || data.status === 'draft' ? data.status : 'draft') as 'draft' | 'published',
          excerpt: data.excerpt || '',
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load post';
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    if (postId) {
      loadPost();
    }
  }, [postId, showError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary mx-auto mb-4" />
          <p className="text-secondary">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-secondary">Post not found</p>
        </div>
      </div>
    );
  }

  return <Editor postId={postId} initialData={post} />;
}
