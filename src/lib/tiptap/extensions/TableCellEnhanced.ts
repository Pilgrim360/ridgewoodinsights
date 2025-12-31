import TableCell from '@tiptap/extension-table-cell';
import { mergeAttributes } from '@tiptap/core';

export const TableCellEnhanced = TableCell.extend({
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
        default: 'normal',
      },
      verticalAlign: {
        default: 'middle',
      },
      borderEdges: {
        default: { top: true, bottom: true, left: true, right: true },
      },
    };
  },

  renderHTML({ HTMLAttributes, node }) {
    const { backgroundColor, borderColor, textColor, textWeight, verticalAlign, borderEdges } = node.attrs;

    const style = [];
    if (backgroundColor) style.push(`background-color: ${backgroundColor}`);
    if (borderColor) style.push(`border-color: ${borderColor}`);
    if (textColor) style.push(`color: ${textColor}`);
    if (textWeight === 'bold') style.push(`font-weight: bold`);
    if (verticalAlign) style.push(`vertical-align: ${verticalAlign}`);

    if (borderEdges) {
      if (!borderEdges.top) style.push(`border-top: none`);
      if (!borderEdges.bottom) style.push(`border-bottom: none`);
      if (!borderEdges.left) style.push(`border-left: none`);
      if (!borderEdges.right) style.push(`border-right: none`);
    }

    return [
      'td',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: style.join('; '),
      }),
      0,
    ];
  },
});
