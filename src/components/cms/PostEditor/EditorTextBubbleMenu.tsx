'use client';

import { useCallback } from 'react';
import { BubbleMenu, useEditorState, type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  Code,
  Type,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';

export interface EditorTextBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
}

export function EditorTextBubbleMenu({ editor }: EditorTextBubbleMenuProps) {
  const selectionState = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      isBold: ed.isActive('bold'),
      isItalic: ed.isActive('italic'),
      isUnderline: ed.isActive('underline'),
      isStrike: ed.isActive('strike'),
      isCode: ed.isActive('code'),
      isLink: ed.isActive('link'),
      isHeading1: ed.isActive('heading', { level: 1 }),
      isHeading2: ed.isActive('heading', { level: 2 }),
      isHeading3: ed.isActive('heading', { level: 3 }),
      isParagraph: ed.isActive('paragraph'),
    }),
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor: ed, from, to }) => {
        // Only show if there's a selection and it's not an image
        return from !== to && !ed.isActive('image');
      }}
      className="flex items-center gap-0.5 overflow-hidden rounded-lg border border-surface bg-white p-1 shadow-md"
    >
      <ToolbarButton
        size="sm"
        title="Heading 1"
        isActive={selectionState.isHeading1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        title="Heading 2"
        isActive={selectionState.isHeading2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        title="Heading 3"
        isActive={selectionState.isHeading3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        title="Paragraph"
        isActive={selectionState.isParagraph}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Type className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-surface" />

      <ToolbarButton
        size="sm"
        title="Bold"
        isActive={selectionState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        title="Italic"
        isActive={selectionState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        title="Underline"
        isActive={selectionState.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        title="Strikethrough"
        isActive={selectionState.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        title="Code"
        isActive={selectionState.isCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-surface" />

      <ToolbarButton
        size="sm"
        title="Link"
        isActive={selectionState.isLink}
        onClick={setLink}
        className="h-8 w-8 p-0 border-none bg-transparent"
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
    </BubbleMenu>
  );
}
