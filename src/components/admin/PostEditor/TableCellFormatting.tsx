'use client';

import { type Editor } from '@tiptap/react';

export interface TableCellFormattingProps {
  editor: Editor;
  disabled?: boolean;
}

export function TableCellFormatting({ editor, disabled }: TableCellFormattingProps) {
  const currentAttributes = editor.getAttributes('tableCell') || editor.getAttributes('tableHeader');

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-background rounded-md border border-surface mt-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">Cell BG:</span>
        <input
          type="color"
          className="h-6 w-6 rounded border border-surface p-0 cursor-pointer"
          value={currentAttributes.backgroundColor || '#ffffff'}
          onChange={(e) => editor.chain().focus().setCellAttribute('backgroundColor', e.target.value).run()}
          disabled={disabled}
        />
        <button
          onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', null).run()}
          className="text-[10px] text-primary hover:underline"
          disabled={disabled}
        >
          Clear
        </button>
      </div>
      
      {/* Add more cell specific controls here if needed */}
    </div>
  );
}
