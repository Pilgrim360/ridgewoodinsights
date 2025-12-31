'use client';

import { type Editor } from '@tiptap/react';

export interface TableContextMenuProps {
  editor: Editor;
  children: React.ReactNode;
}

export function TableContextMenu({ children }: TableContextMenuProps) {
  // In a real implementation, this would be triggered by right click on the table
  // For now, it's a bit complex to hook into right-click in Tiptap without a custom plugin
  return <>{children}</>;
}
