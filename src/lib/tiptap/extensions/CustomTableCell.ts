import TableCell from '@tiptap/extension-table-cell';
import { mergeAttributes } from '@tiptap/core';

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
      },
      borderColor: {
        default: null,
      },
      borderWidth: {
        default: null,
      },
      borderStyle: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    let style = '';
    if (HTMLAttributes.backgroundColor) {
      style += `background-color: ${HTMLAttributes.backgroundColor};`;
    }
    if (HTMLAttributes.borderColor) {
      style += `border-color: ${HTMLAttributes.borderColor};`;
    }
    if (HTMLAttributes.borderWidth) {
      style += `border-width: ${HTMLAttributes.borderWidth};`;
    }
    if (HTMLAttributes.borderStyle) {
      style += `border-style: ${HTMLAttributes.borderStyle};`;
    }

    const attributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    if (style) {
      attributes.style = (attributes.style || '') + style;
    }

    return ['td', attributes, 0];
  },

  parseHTML() {
    return [
      {
        tag: 'td',
        getAttrs: (dom: HTMLElement) => {
          const colspan = dom.getAttribute('colspan');
          const rowspan = dom.getAttribute('rowspan');
          const colwidth = dom.getAttribute('colwidth');
          const rowspanOk = rowspan && Number.parseInt(rowspan, 10) > 1;
          const colspanOk = colspan && Number.parseInt(colspan, 10) > 1;
          const colwidthOk = colwidth && /^\d+(,\d+)*$/.test(colwidth);

          let hasCustomAttrs = false;
          const attrs: { [key: string]: any } = {};

          if (colspanOk) {
            attrs.colspan = Number.parseInt(colspan, 10);
            hasCustomAttrs = true;
          }
          if (rowspanOk) {
            attrs.rowspan = Number.parseInt(rowspan, 10);
            hasCustomAttrs = true;
          }
          if (colwidthOk) {
            attrs.colwidth = colwidth.split(',').map((item) => Number.parseInt(item, 10));
            hasCustomAttrs = true;
          }

          const style = dom.style;
          if (style.backgroundColor) {
            attrs.backgroundColor = style.backgroundColor;
            hasCustomAttrs = true;
          }
          if (style.borderColor) {
            attrs.borderColor = style.borderColor;
            hasCustomAttrs = true;
          }
          if (style.borderWidth) {
            attrs.borderWidth = style.borderWidth;
            hasCustomAttrs = true;
          }
          if (style.borderStyle) {
            attrs.borderStyle = style.borderStyle;
            hasCustomAttrs = true;
          }

          return hasCustomAttrs ? attrs : false;
        },
      },
    ];
  },
});
