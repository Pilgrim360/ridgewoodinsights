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
import { AdvancedTable } from './extensions/AdvancedTable';
import { AdvancedTableRow } from './extensions/AdvancedTableRow';
import { AdvancedTableHeader } from './extensions/AdvancedTableHeader';
import { AdvancedTableCell } from './extensions/AdvancedTableCell';
import Youtube from '@tiptap/extension-youtube';
import Typography from '@tiptap/extension-typography';

import { FontSize } from './extensions/FontSize';
import { LineHeight } from './extensions/LineHeight';
import { PageBreak } from './extensions/PageBreak';
import { IframeEmbed } from './extensions/IframeEmbed';
import { AudioEmbed } from './extensions/AudioEmbed';
import { ImageExtended } from './extensions/ImageExtended';
import { HeadingWithId } from './extensions/HeadingWithId';

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
    AdvancedTable.configure({
      resizable: true,
    }),
    AdvancedTableRow,
    AdvancedTableHeader,
    AdvancedTableCell,
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
