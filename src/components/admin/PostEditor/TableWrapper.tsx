'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export function TableWrapper() {
  return (
    <NodeViewWrapper className="tiptap-table-wrapper-node-view my-8 group relative">
      <div className="overflow-x-auto rounded-lg border border-surface bg-white shadow-sm transition-shadow group-hover:shadow-md">
        <table className="min-w-full divide-y divide-surface">
          <NodeViewContent as="tbody" />
        </table>
      </div>
      
      {/* Scroll indicator overlay - only shows when content overflows */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </NodeViewWrapper>
  );
}
