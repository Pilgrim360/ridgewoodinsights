'use client';

import { useEffect, useState, useCallback } from 'react';
import { Editor } from '@/components/admin/PostEditor/Editor';
import { createPost } from '@/lib/admin/posts';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function NewPostPage() {
  const { showError, showSuccess } = useAdminError();
  const { user, isLoading: authLoading } = useAdminAuth();
  const [postId, setPostId] = useState<string | null>(null);

  // If no postId, create a new draft first
  const handleCreateDraft = useCallback(async () => {
    try {
      // Check if user is authenticated
      if (!user?.id) {
        showError('You must be logged in to create posts');
        return;
      }

      const newPost = await createPost({
        title: 'Untitled Post',
        slug: `post-${Date.now()}`,
        content_html: '', // Use content_html to match database schema
        status: 'draft',
        category_id: null,
        cover_image: null,
        excerpt: '',
        author_id: user.id, // Include the current user's ID
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
  }, [user, showError, showSuccess]);

  // Initialize draft on mount when user is available
  useEffect(() => {
    if (!authLoading && !user) {
      showError('Authentication required. Please log in again.');
      return;
    }

    if (!authLoading && user && !postId) {
      handleCreateDraft();
    }
  }, [user, postId, handleCreateDraft, authLoading, showError]);

  // Show loading while authenticating
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-primary mx-auto mb-4" />
          <p className="text-secondary">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show error if user not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-secondary mb-4">Authentication required</p>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading while creating post
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
