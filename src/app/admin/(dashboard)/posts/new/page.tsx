'use client';

import { useEffect } from 'react';
import { Editor } from '@/components/admin/PostEditor/Editor';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function NewPostPage() {
  const { showError } = useAdminError();
  const { user, isLoading: authLoading } = useAdminAuth();

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

  // Render editor without an initial postId
  // This tells the Editor to start in "create mode"
  return (
    <Editor
      initialData={{
        title: '',
        slug: '',
        content: '',
        status: 'draft',
        category_id: null,
        cover_image: null,
        excerpt: '',
        author_id: user.id
      }}
    />
  );
}
