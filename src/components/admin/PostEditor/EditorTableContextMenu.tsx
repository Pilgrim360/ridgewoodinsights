'use client';

import { type Editor } from '@tiptap/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Columns2,
  Columns3,
  Rows2,
  Rows3,
  Merge,
  Split,
  Trash2,
  Heading1,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ColorPicker } from './ColorPicker';

export interface EditorTableContextMenuProps {
  editor: Editor;
  disabled?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export function EditorTableContextMenu({
  editor,
  disabled,
  isOpen,
  onOpenChange,
  children,
}: EditorTableContextMenuProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-auto p-1">
            <div
            className="flex items-center gap-1"
            >
            <ToolbarButton
                title="Add column before"
                aria-label="Add column before"
                disabled={disabled}
                onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
                <Columns3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                title="Add column after"
                aria-label="Add column after"
                disabled={disabled}
                onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
                <Columns2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                title="Add row before"
                aria-label="Add row before"
                disabled={disabled}
                onClick={() => editor.chain().focus().addRowBefore().run()}
            >
                <Rows3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                title="Add row after"
                aria-label="Add row after"
                disabled={disabled}
                onClick={() => editor.chain().focus().addRowAfter().run()}
            >
                <Rows2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                title="Merge cells"
                aria-label="Merge cells"
                disabled={disabled}
                onClick={() => editor.chain().focus().mergeCells().run()}
            >
                <Merge className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                title="Split cell"
                aria-label="Split cell"
                disabled={disabled}
                onClick={() => editor.chain().focus().splitCell().run()}
            >
                <Split className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                title="Delete table"
                aria-label="Delete table"
                disabled={disabled}
                onClick={() => editor.chain().focus().deleteTable().run()}
            >
                <Trash2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                title="Toggle header row"
                aria-label="Toggle header row"
                disabled={disabled}
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ColorPicker
                disabled={disabled}
                onChange={color => editor.chain().focus().setCellAttribute('backgroundColor', color).run()}
            />
            </div>
        </PopoverContent>
    </Popover>
  );
}
