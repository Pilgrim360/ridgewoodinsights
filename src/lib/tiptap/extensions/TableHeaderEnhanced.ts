import TableHeader from '@tiptap/extension-table-header';
import { mergeAttributes } from '@tiptap/core';

export const TableHeaderEnhanced = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
      borderColor: {
        default: null,
      },
      textColor: {
        default: null,
      },
      textWeight: {
        default: 'bold',
      },
      verticalAlign: {
        default: 'middle',
      },
      borderEdges: {
        default: { top: true, bottom: true, left: true, right: true },
      },
      isHeaderRow: {
        default: true,
      },
    };
  },

  renderHTML({ HTMLAttributes, node }) {
    const { backgroundColor, borderColor, textColor, textWeight, verticalAlign, borderEdges } = node.attrs;

    const style = [];
    if (backgroundColor) style.push(`background-color: ${backgroundColor}`);
    if (borderColor) style.push(`border-color: ${borderColor}`);
    if (textColor) style.push(`color: ${textColor}`);
    if (textWeight === 'bold' || textWeight === 'normal') style.push(`font-weight: ${textWeight}`);
    if (verticalAlign) style.push(`vertical-align: ${verticalAlign}`);

    if (borderEdges) {
      if (!borderEdges.top) style.push(`border-top: none`);
      if (!borderEdges.bottom) style.push(`border-bottom: none`);
      if (!borderEdges.left) style.push(`border-left: none`);
      if (!borderEdges.right) style.push(`border-right: none`);
    }

    return [
      'th',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: style.join('; '),
      }),
      0,
    ];
  },
});
