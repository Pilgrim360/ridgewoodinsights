'use client';

import { useCallback } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { ImageUpload } from './ImageUpload';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  disabled,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
  });

  const handleImageUpload = useCallback(
    (url: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    [editor]
  );

  const applyFormat = (format: string) => {
    if (!editor) return;

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'ul':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'ol':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'link':
        insertLink(editor);
        break;
    }
  };

  const insertLink = (ed: Editor) => {
    const url = window.prompt('Enter URL');
    if (url) {
      ed.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-surface rounded-lg border border-surface">
        <ToolbarButton
          onClick={() => applyFormat('bold')}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('italic')}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('strike')}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px bg-white/20" />

        <ToolbarButton
          onClick={() => applyFormat('h1')}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('h2')}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('h3')}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <div className="w-px bg-white/20" />

        <ToolbarButton
          onClick={() => applyFormat('ul')}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          •
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('ol')}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          #
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('blockquote')}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          ❝
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('code')}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          {'<>'}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyFormat('link')}
          isActive={editor.isActive('link')}
          title="Insert Link"
        >
          🔗
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="border border-surface rounded-lg overflow-hidden bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-96 [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none"
        />
      </div>

      {/* Image Upload */}
      <div className="pt-4 border-t border-surface">
        <p className="text-sm font-medium text-secondary mb-3">
          Insert Image
        </p>
        <ImageUpload onImageUpload={handleImageUpload} disabled={disabled} />
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-white text-secondary hover:bg-primary/10'
      }`}
    >
      {children}
    </button>
  );
}
