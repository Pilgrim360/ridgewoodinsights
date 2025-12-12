'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/admin/dates';
import { getPostRevisions } from '@/lib/admin/posts';

interface RevisionHistoryProps {
  postId: string;
  onRestore?: (revision: PostRevision) => void | undefined;
}

interface PostRevision {
  id: string;
  post_id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  created_by: string;
}

export function RevisionHistory({ postId, onRestore }: RevisionHistoryProps) {
  const [revisions, setRevisions] = useState<PostRevision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRevision, setSelectedRevision] = useState<PostRevision | null>(null);

  useEffect(() => {
    async function loadRevisions() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPostRevisions(postId);
        setRevisions(data);
      } catch (err) {
        console.error('Failed to load revisions:', err);
        setError('Failed to load revision history');
      } finally {
        setIsLoading(false);
      }
    }

    if (postId) {
      loadRevisions();
    }
  }, [postId]);

  const handleRestore = (revision: PostRevision) => {
    if (onRestore) {
      onRestore(revision);
    }
    setSelectedRevision(null);
  };

  const handleViewDetails = (revision: PostRevision) => {
    setSelectedRevision(revision);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Text>Loading revision history...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Text className="text-red-500">{error}</Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Heading as={3}>Revision History</Heading>

      {revisions.length === 0 ? (
        <Text>No revisions found for this post.</Text>
      ) : (
        <div className="space-y-3">
          {revisions.map((revision) => (
            <Card key={revision.id} className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Text className="font-medium">{revision.title}</Text>
                  <Text muted className="text-sm">
                    {formatDateTime(revision.created_at)} • {revision.created_by}
                  </Text>
                  <Badge variant={revision.status === 'published' ? 'success' : 'neutral'} className="mt-1">
                    {revision.status}
                  </Badge>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(revision)}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRestore(revision)}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Revision Details Modal */}
      {selectedRevision && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <Heading as={3}>Revision Details</Heading>
              <Button
                variant="ghost"
                onClick={() => setSelectedRevision(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Text className="font-medium">Title:</Text>
                <Text>{selectedRevision.title}</Text>
              </div>

              <div>
                <Text className="font-medium">Status:</Text>
                <Badge variant={selectedRevision.status === 'published' ? 'success' : 'neutral'}>
                  {selectedRevision.status}
                </Badge>
              </div>

              <div>
                <Text className="font-medium">Created:</Text>
                <Text>{formatDateTime(selectedRevision.created_at)}</Text>
              </div>

              <div>
                <Text className="font-medium">Content:</Text>
                <div className="mt-2 p-3 bg-gray-50 rounded border border-surface">
                  <Text className="whitespace-pre-wrap">{selectedRevision.content}</Text>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedRevision(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleRestore(selectedRevision)}
              >
                Restore This Revision
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}