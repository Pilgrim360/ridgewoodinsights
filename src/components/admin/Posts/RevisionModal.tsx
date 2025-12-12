'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/admin/dates';

interface PostRevision {
  id: string;
  post_id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  created_by: string;
}

interface RevisionModalProps {
  isOpen: boolean;
  revision: PostRevision | null;
  onClose: () => void | undefined;
  onRestore: (revision: PostRevision) => void | undefined;
}

export function RevisionModal({ isOpen, revision, onClose, onRestore }: RevisionModalProps) {
  if (!isOpen || !revision) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <Heading as={3}>Revision Details</Heading>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Text className="font-medium">Title:</Text>
            <Text>{revision.title}</Text>
          </div>

          <div>
            <Text className="font-medium">Status:</Text>
            <Badge variant={revision.status === 'published' ? 'success' : 'neutral'}>
              {revision.status}
            </Badge>
          </div>

          <div>
            <Text className="font-medium">Created:</Text>
            <Text>{formatDateTime(revision.created_at)}</Text>
          </div>

          <div>
            <Text className="font-medium">Content:</Text>
            <div className="mt-2 p-3 bg-gray-50 rounded border border-surface">
              <Text className="whitespace-pre-wrap">{revision.content}</Text>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => onRestore(revision)}
          >
            Restore This Revision
          </Button>
        </div>
      </Card>
    </div>
  );
}