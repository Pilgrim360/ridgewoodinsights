'use client';

import { FloatingMenu, type Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
} from 'lucide-react';

import { FloatingToolbarButton, FloatingToolbarDivider } from './EditorFloatingMenuButton';

export interface EditorFloatingMenuProps {
  editor: Editor;
  disabled?: boolean;
}

export function EditorFloatingMenu({ editor, disabled }: EditorFloatingMenuProps) {
  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom',
        offset: [0, 8],
      }}
      className="flex items-center gap-0.5 rounded-lg border border-surface bg-white p-1 shadow-md"
    >
      <FloatingToolbarButton
        editor={editor}
        disabled={disabled}
        isActive={editor.isActive('heading', { level: 1 })}
        action={(chain) => chain.toggleHeading({ level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </FloatingToolbarButton>

      <FloatingToolbarButton
        editor={editor}
        disabled={disabled}
        isActive={editor.isActive('heading', { level: 2 })}
        action={(chain) => chain.toggleHeading({ level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </FloatingToolbarButton>

      <FloatingToolbarButton
        editor={editor}
        disabled={disabled}
        isActive={editor.isActive('heading', { level: 3 })}
        action={(chain) => chain.toggleHeading({ level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </FloatingToolbarButton>

      <FloatingToolbarDivider />

      <FloatingToolbarButton
        editor={editor}
        disabled={disabled}
        isActive={editor.isActive('bulletList')}
        action={(chain) => chain.toggleBulletList()}
        title="Bullet list"
      >
        <List className="h-4 w-4" />
      </FloatingToolbarButton>

      <FloatingToolbarButton
        editor={editor}
        disabled={disabled}
        isActive={editor.isActive('orderedList')}
        action={(chain) => chain.toggleOrderedList()}
        title="Ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </FloatingToolbarButton>

      <FloatingToolbarDivider />

      <FloatingToolbarButton
        editor={editor}
        disabled={disabled}
        isActive={editor.isActive('blockquote')}
        action={(chain) => chain.toggleBlockquote()}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </FloatingToolbarButton>

      <FloatingToolbarButton
        editor={editor}
        disabled={disabled}
        isActive={editor.isActive('codeBlock')}
        action={(chain) => chain.toggleCodeBlock()}
        title="Code block"
      >
        <Code className="h-4 w-4" />
      </FloatingToolbarButton>
    </FloatingMenu>
  );
}
