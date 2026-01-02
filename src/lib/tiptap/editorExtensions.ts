import { findParentNodeClosestToPos } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import Typography from '@tiptap/extension-typography';

import { FontSize } from './extensions/FontSize';
import { LineHeight } from './extensions/LineHeight';
import { PageBreak } from './extensions/PageBreak';
import { IframeEmbed } from './extensions/IframeEmbed';
import { AudioEmbed } from './extensions/AudioEmbed';
import { ImageExtended } from './extensions/ImageExtended';
import { HeadingWithId } from './extensions/HeadingWithId';

export type TableAlignment = 'left' | 'center' | 'right';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableAlignment: {
      setTableAlignment: (alignment: TableAlignment) => ReturnType;
      toggleTableAlignment: (alignment: TableAlignment) => ReturnType;
    };
  }
}

const TableWithAlignment = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (element) => {
          const value = (element as HTMLElement).getAttribute('align');
          if (value === 'left' || value === 'center' || value === 'right') return value;
          return 'center';
        },
        renderHTML: (attributes) => {
          const value = attributes.align;
          if (value === 'left' || value === 'center' || value === 'right') {
            return { align: value };
          }
          return { align: 'center' };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTableAlignment:
        (alignment) =>
        ({ tr, dispatch }) => {
          const table = findParentNodeClosestToPos(tr.selection.$from, (node) => node.type.name === 'table');
          if (!table) return false;

          if (dispatch) {
            tr.setNodeMarkup(table.pos, undefined, {
              ...table.node.attrs,
              align: alignment,
            });
          }

          return true;
        },
      toggleTableAlignment:
        (alignment) =>
        ({ tr, dispatch }) => {
          const table = findParentNodeClosestToPos(tr.selection.$from, (node) => node.type.name === 'table');
          if (!table) return false;

          const current = (table.node.attrs.align as TableAlignment | undefined) ?? 'center';
          const next: TableAlignment = current === alignment ? 'center' : alignment;

          if (dispatch) {
            tr.setNodeMarkup(table.pos, undefined, {
              ...table.node.attrs,
              align: next,
            });
          }

          return true;
        },
    };
  },
});

export interface PostEditorExtensionsOptions {
  placeholder?: string;
  characterLimit?: number;
}

export function createPostEditorExtensions({
  placeholder = 'Start writing…',
  characterLimit,
}: PostEditorExtensionsOptions = {}) {
  return [
    StarterKit.configure({
      heading: false,
    }),
    HeadingWithId.configure({
      levels: [1, 2, 3, 4, 5, 6],
    }),
    Typography,
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Underline,
    Subscript,
    Superscript,
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    FontFamily,
    FontSize,
    LineHeight,
    TextAlign.configure({
      types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
    }),
    ImageExtended.configure({
      allowBase64: false,
    }),
    TableWithAlignment.configure({
      resizable: true,
      HTMLAttributes: {
        align: 'center',
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
    Youtube.configure({
      controls: true,
      nocookie: true,
    }),
    IframeEmbed,
    AudioEmbed,
    PageBreak,
    CharacterCount.configure({
      limit: characterLimit,
    }),
    Placeholder.configure({
      placeholder,
    }),
  ];
}
