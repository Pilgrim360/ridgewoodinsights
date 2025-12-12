'use client';

import { useEffect, useState, useCallback } from 'react';
import { Editor } from '@/components/admin/PostEditor/Editor';
import { createPost } from '@/lib/admin/posts';
import { useAdminError } from '@/contexts/AdminErrorContext';

export default function NewPostPage() {
  const { showError, showSuccess } = useAdminError();
  const [postId, setPostId] = useState<string | null>(null);

  // If no postId, create a new draft first
  const handleCreateDraft = useCallback(async () => {
    try {
      const newPost = await createPost({
        title: 'Untitled Post',
        slug: `post-${Date.now()}`,
        content: '',
        status: 'draft',
        category_id: null,
        cover_image: null,
        excerpt: '',
      });

      if (newPost.id) {
        setPostId(newPost.id);
      }
      showSuccess('Draft created. Start editing...');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create post';
      showError(errorMessage);
    }
  }, [showError, showSuccess]);

  // Initialize draft on mount
  useEffect(() => {
    if (!postId) {
      handleCreateDraft();
    }
  }, [postId, handleCreateDraft]);

  if (!postId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary mx-auto mb-4" />
          <p className="text-secondary">Creating new post...</p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      postId={postId}
      initialData={{
        title: 'Untitled Post',
        slug: `post-${Date.now()}`,
        content: '',
        status: 'draft',
        category_id: null,
        cover_image: null,
        excerpt: '',
      }}
    />
  );
}
