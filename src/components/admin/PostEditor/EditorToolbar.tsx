'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Quote,
  List,
  ListOrdered,
  Code,
  Undo2,
  Redo2,
  Link2,
  Unlink2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Images as MediaIcon,
  Table as TableIcon,
  Minus,
  FileSpreadsheet,
  Youtube as YoutubeIcon,
  AudioLines,
  Frame,
  SeparatorHorizontal,
} from 'lucide-react';

import { uploadPostAsset } from '@/lib/admin/storage';
import { cn } from '@/lib/utils';
import { MediaModal, type ImageConfig } from '../Media/MediaModal';
import { InsertTableDialog } from './dialogs/InsertTableDialog';
import { EditorTableToolbar } from './EditorTableToolbar';
import { parseCsv } from '@/lib/tiptap/utils';
import { getTocHeadings } from '@/lib/tiptap/toc';

import { ToolbarButton } from './ToolbarButton';
import { ToolbarSelect } from './ToolbarSelect';

const FONT_FAMILIES: Array<{ label: string; value: string }> = [
  { label: 'Default', value: '' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Times', value: 'Times New Roman' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Mono', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
];

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];
const LINE_HEIGHTS = ['1.2', '1.4', '1.6', '1.8', '2'];

const COLOR_PRESETS = ['#2C3E50', '#415161', '#006466', '#B42318', '#0B4F6C', '#7C3AED'];
const HIGHLIGHT_PRESETS = ['#FEF3C7', '#DCFCE7', '#DBEAFE', '#FCE7F3'];

export interface EditorToolbarProps {
  editor: Editor;
  disabled?: boolean;
  onError?: (message: string) => void;
  className?: string;
}

export function EditorToolbar({
  editor,
  disabled,
  onError,
  className,
}: EditorToolbarProps) {
  const csvInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);


  const headings = useMemo(
    () => getTocHeadings(editor),
    [editor]
  );

  const activeHeadingLevel = (() => {
    for (let level = 1; level <= 6; level += 1) {
      if (editor.isActive('heading', { level })) return String(level);
    }
    return 'paragraph';
  })();

  const currentFontFamily = editor.getAttributes('textStyle').fontFamily ?? '';
  const currentFontSize = editor.getAttributes('textStyle').fontSize ?? '';
  const currentColor = editor.getAttributes('textStyle').color ?? '';

  const insertLink = useCallback(() => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', previous ?? '');

    if (url === null) return;

    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const linkToHeading = useCallback(
    (headingId: string) => {
      if (!headingId) return;

      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: `#${headingId}` })
        .run();
    },
    [editor]
  );


  const handleMediaInsert = useCallback(
    (config: ImageConfig) => {
      const { url, alt, title } = config;

      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: alt || undefined,
          title: title || undefined,
        })
        .run();
    },
    [editor]
  );

  const handleCsvSelected = useCallback(
    async (file: File | null) => {
      if (!file) return;

      try {
        const text = await file.text();
        const { rows, maxColumns } = parseCsv(text);

        if (rows.length === 0 || maxColumns === 0) {
          onError?.('CSV file is empty');
          return;
        }

        const html =
          '<table>' +
          rows
            .map((row, rowIndex) => {
              const cells = Array.from({ length: maxColumns }).map((_, cellIndex) => {
                const value = row[cellIndex] ?? '';
                const tag = rowIndex === 0 ? 'th' : 'td';
                return `<${tag}>${escapeHtml(value)}</${tag}>`;
              });
              return `<tr>${cells.join('')}</tr>`;
            })
            .join('') +
          '</table>';

        editor.chain().focus().insertContent(html).run();
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Failed to import CSV');
      } finally {
        if (csvInputRef.current) csvInputRef.current.value = '';
      }
    },
    [editor, onError]
  );

  const handleAudioSelected = useCallback(
    async (file: File | null) => {
      if (!file) return;

      setIsUploading(true);

      try {
        const url = await uploadPostAsset(file);
        editor.chain().focus().setAudioEmbed({ src: url, title: file.name }).run();
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Audio upload failed');
      } finally {
        setIsUploading(false);
        if (audioInputRef.current) audioInputRef.current.value = '';
      }
    },
    [editor, onError]
  );

  const insertTable = useCallback(
    (rows: number, cols: number, withHeader: boolean) => {
      editor
        .chain()
        .focus()
        .insertTable({ rows, cols, withHeaderRow: withHeader })
        .run();
    },
    [editor]
  );

  if (editor.isActive('table')) {
    return (
      <div className={cn('w-full', className)}>
        <EditorTableToolbar editor={editor} disabled={disabled} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-lg border border-surface bg-white p-2',
        className
      )}
    >
        {/* Undo/redo */}
        <ToolbarButton
          title="Undo"
          aria-label="Undo"
          disabled={disabled || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          aria-label="Redo"
          disabled={disabled || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Heading + font */}
        <ToolbarSelect
          aria-label="Block type"
          disabled={disabled}
          value={activeHeadingLevel}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
              return;
            }

            editor
              .chain()
              .focus()
              .toggleHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
              .run();
          }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </ToolbarSelect>

        <ToolbarSelect
          aria-label="Font family"
          disabled={disabled}
          value={currentFontFamily}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              editor.chain().focus().unsetFontFamily().run();
              return;
            }
            editor.chain().focus().setFontFamily(value).run();
          }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.label} value={font.value}>
              {font.label}
            </option>
          ))}
        </ToolbarSelect>

        <ToolbarSelect
          aria-label="Font size"
          disabled={disabled}
          value={currentFontSize}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              editor.chain().focus().unsetFontSize().run();
              return;
            }
            editor.chain().focus().setFontSize(value).run();
          }}
        >
          <option value="">Size</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </ToolbarSelect>

        <ToolbarSelect
          aria-label="Line height"
          disabled={disabled}
          value={editor.getAttributes('paragraph').lineHeight ?? editor.getAttributes('heading').lineHeight ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              editor.chain().focus().unsetLineHeight().run();
              return;
            }
            editor.chain().focus().setLineHeight(value).run();
          }}
        >
          <option value="">Line</option>
          {LINE_HEIGHTS.map((lh) => (
            <option key={lh} value={lh}>
              {lh}
            </option>
          ))}
        </ToolbarSelect>

        <Divider />

        {/* Marks */}
        <ToolbarButton
          title="Bold"
          aria-label="Bold"
          disabled={disabled}
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          aria-label="Italic"
          disabled={disabled}
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          aria-label="Underline"
          disabled={disabled}
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          aria-label="Strikethrough"
          disabled={disabled}
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Subscript"
          aria-label="Subscript"
          disabled={disabled}
          isActive={editor.isActive('subscript')}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <Subscript className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Superscript"
          aria-label="Superscript"
          disabled={disabled}
          isActive={editor.isActive('superscript')}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <Superscript className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Align left"
          aria-label="Align left"
          disabled={disabled}
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          aria-label="Align center"
          disabled={disabled}
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          aria-label="Align right"
          disabled={disabled}
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          aria-label="Justify"
          disabled={disabled}
          isActive={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Lists + blocks */}
        <ToolbarButton
          title="Bullet list"
          aria-label="Bullet list"
          disabled={disabled}
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered list"
          aria-label="Ordered list"
          disabled={disabled}
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          aria-label="Blockquote"
          disabled={disabled}
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Inline code"
          aria-label="Inline code"
          disabled={disabled}
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          aria-label="Code block"
          disabled={disabled}
          isActive={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <SeparatorHorizontal className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Links */}
        <ToolbarButton
          title="Insert link"
          aria-label="Insert link"
          disabled={disabled}
          isActive={editor.isActive('link')}
          onClick={insertLink}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Remove link"
          aria-label="Remove link"
          disabled={disabled || !editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSelect
          aria-label="Link to section"
          disabled={disabled || headings.length === 0}
          value=""
          onChange={(e) => {
            const id = e.target.value;
            if (!id) return;
            linkToHeading(id);
          }}
          className="min-w-[160px]"
        >
          <option value="">Link to section…</option>
          {headings
            .filter((h) => h.id)
            .map((h) => (
              <option key={`${h.pos}-${h.id}`} value={h.id ?? ''}>
                {'—'.repeat(Math.max(0, h.level - 1))} {h.text}
              </option>
            ))}
        </ToolbarSelect>

        <Divider />

        {/* Color / highlight */}
        <div className="flex items-center gap-1">
          <input
            type="color"
            aria-label="Text color"
            disabled={disabled}
            value={currentColor || '#000000'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className={cn(
              'h-9 w-9 rounded-md border border-surface bg-white p-1',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              className="h-6 w-6 rounded border border-surface"
              style={{ backgroundColor: color }}
              aria-label={`Set text color ${color}`}
              disabled={disabled}
              onClick={() => editor.chain().focus().setColor(color).run()}
            />
          ))}
          <ToolbarButton
            title="Clear text color"
            aria-label="Clear text color"
            disabled={disabled}
            onClick={() => editor.chain().focus().unsetColor().run()}
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1">
          {HIGHLIGHT_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              className="h-6 w-6 rounded border border-surface"
              style={{ backgroundColor: color }}
              aria-label={`Highlight ${color}`}
              disabled={disabled}
              onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
            />
          ))}
          <ToolbarButton
            title="Clear highlight"
            aria-label="Clear highlight"
            disabled={disabled}
            onClick={() => editor.chain().focus().unsetHighlight().run()}
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Tables */}
        <ToolbarButton
          title="Insert table"
          aria-label="Insert table"
          disabled={disabled}
          onClick={() => setIsTableDialogOpen(true)}
        >
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Toggle header row"
          aria-label="Toggle header row"
          disabled={disabled || !editor.isActive('table')}
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        >
          <SeparatorHorizontal className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Delete table"
          aria-label="Delete table"
          disabled={disabled || !editor.isActive('table')}
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          <TrashButtonIcon />
        </ToolbarButton>

        <input
          ref={csvInputRef}
          type="file"
          accept="text/csv,.csv"
          className="hidden"
          onChange={(e) => void handleCsvSelected(e.target.files?.[0] ?? null)}
        />
        <ToolbarButton
          title="Import CSV as table"
          aria-label="Import CSV as table"
          disabled={disabled}
          onClick={() => csvInputRef.current?.click()}
        >
          <FileSpreadsheet className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Media */}
        <ToolbarButton
          title="Insert Image"
          aria-label="Insert Image"
          disabled={disabled}
          onClick={() => setIsMediaModalOpen(true)}
        >
          <MediaIcon className="h-4 w-4" />
        </ToolbarButton>

        <MediaModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onInsert={handleMediaInsert}
        />
        <InsertTableDialog
          isOpen={isTableDialogOpen}
          onClose={() => setIsTableDialogOpen(false)}
          onConfirm={insertTable}
        />
        <ToolbarButton
          title="Embed YouTube"
          aria-label="Embed YouTube"
          disabled={disabled}
          onClick={() => {
            const url = window.prompt('YouTube URL');
            if (!url) return;
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }}
        >
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Embed iframe (Vimeo, PDF, etc.)"
          aria-label="Embed iframe"
          disabled={disabled}
          onClick={() => {
            const src = window.prompt('Embed URL (iframe src)');
            if (!src) return;
            const title = window.prompt('Title (optional)') ?? undefined;
            editor.chain().focus().setIframeEmbed({ src, title }).run();
          }}
        >
          <Frame className="h-4 w-4" />
        </ToolbarButton>

        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => void handleAudioSelected(e.target.files?.[0] ?? null)}
        />
        <ToolbarButton
          title="Upload audio"
          aria-label="Upload audio"
          disabled={disabled || isUploading}
          onClick={() => audioInputRef.current?.click()}
        >
          <AudioLines className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Page breaks */}
        <ToolbarButton
          title="Horizontal rule"
          aria-label="Horizontal rule"
          disabled={disabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Page break (print)"
          aria-label="Page break"
          disabled={disabled}
          onClick={() => editor.chain().focus().setPageBreak().run()}
        >
          <SeparatorHorizontal className="h-4 w-4" />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-2 text-xs text-text/70">
          {isUploading && (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Uploading…
            </span>
          )}
        </div>
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-surface" aria-hidden />;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function TrashButtonIcon() {
  return <TrashIcon />;
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 16h10l1-16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
