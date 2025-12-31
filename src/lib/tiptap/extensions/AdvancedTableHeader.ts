import TableHeader from '@tiptap/extension-table-header';
import { mergeAttributes } from '@tiptap/core';

import {
  composeCellInlineStyle,
  DEFAULT_BORDER_ATTRIBUTES,
  DEFAULT_CELL_STYLE_ATTRIBUTES,
  normalizeHexColor,
  type BorderRadius,
  type BorderStyle,
  type BorderWidth,
} from '../utils/tableHelpers';

const DEFAULT_HEADER_BG = '#F8F9FB';

export const AdvancedTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderStyle: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderStyle,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderTopStyle as BorderStyle) ||
          ((element as HTMLElement).style.borderStyle as BorderStyle) ||
          DEFAULT_BORDER_ATTRIBUTES.borderStyle,
      },
      borderTopWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderTopWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderTopWidth as BorderWidth) ||
          DEFAULT_BORDER_ATTRIBUTES.borderTopWidth,
      },
      borderRightWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderRightWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderRightWidth as BorderWidth) ||
          DEFAULT_BORDER_ATTRIBUTES.borderRightWidth,
      },
      borderBottomWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderBottomWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderBottomWidth as BorderWidth) ||
          DEFAULT_BORDER_ATTRIBUTES.borderBottomWidth,
      },
      borderLeftWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderLeftWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderLeftWidth as BorderWidth) ||
          DEFAULT_BORDER_ATTRIBUTES.borderLeftWidth,
      },
      borderColor: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderColor,
        parseHTML: (element) => {
          const color = normalizeHexColor((element as HTMLElement).style.borderTopColor);
          return color ?? DEFAULT_BORDER_ATTRIBUTES.borderColor;
        },
      },
      borderRadius: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderRadius,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderRadius as BorderRadius) ||
          DEFAULT_BORDER_ATTRIBUTES.borderRadius,
      },
      backgroundColor: {
        default: DEFAULT_HEADER_BG,
        parseHTML: (element) =>
          normalizeHexColor((element as HTMLElement).style.backgroundColor) ?? DEFAULT_HEADER_BG,
      },
      textColor: {
        default: '#2C3E50',
        parseHTML: (element) => normalizeHexColor((element as HTMLElement).style.color) ?? '#2C3E50',
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const style = [HTMLAttributes.style, composeCellInlineStyle({
      ...DEFAULT_CELL_STYLE_ATTRIBUTES,
      ...node.attrs,
    })]
      .filter(Boolean)
      .join(' ');

    return [
      'th',
      mergeAttributes(HTMLAttributes, {
        class: ['rw-table-header-cell', HTMLAttributes.class].filter(Boolean).join(' '),
        style,
      }),
      0,
    ];
  },
});
