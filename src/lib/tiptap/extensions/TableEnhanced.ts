import Table from '@tiptap/extension-table';
import { mergeAttributes } from '@tiptap/core';

export const TableEnhanced = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderStyle: {
        default: 'solid',
        renderHTML: (attributes) => ({
          'data-border-style': attributes.borderStyle,
        }),
      },
      borderWidth: {
        default: 1,
        renderHTML: (attributes) => ({
          'data-border-width': attributes.borderWidth,
        }),
      },
      borderColor: {
        default: '#E2E7ED',
        renderHTML: (attributes) => ({
          'data-border-color': attributes.borderColor,
        }),
      },
      cornerRadius: {
        default: 0,
        renderHTML: (attributes) => ({
          'data-corner-radius': attributes.cornerRadius,
        }),
      },
      tableTheme: {
        default: 'default',
        renderHTML: (attributes) => ({
          'data-table-theme': attributes.tableTheme,
        }),
      },
      backgroundColor: {
        default: 'transparent',
        renderHTML: (attributes) => ({
          'data-background-color': attributes.backgroundColor,
        }),
      },
      cellPadding: {
        default: 8,
        renderHTML: (attributes) => ({
          'data-cell-padding': attributes.cellPadding,
        }),
      },
      tableAlignment: {
        default: 'left',
        renderHTML: (attributes) => ({
          'data-table-alignment': attributes.tableAlignment,
        }),
      },
      tableWidth: {
        default: '100%',
        renderHTML: (attributes) => ({
          'data-table-width': attributes.tableWidth,
        }),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const {
      borderStyle,
      borderWidth,
      borderColor,
      cornerRadius,
      tableTheme,
      backgroundColor,
      cellPadding,
      tableAlignment,
      tableWidth,
    } = node.attrs;

    const style = [
      `--table-border-style: ${borderStyle}`,
      `--table-border-width: ${borderWidth}px`,
      `--table-border-color: ${borderColor}`,
      `--table-corner-radius: ${cornerRadius}px`,
      `--table-background-color: ${backgroundColor}`,
      `--table-cell-padding: ${cellPadding}px`,
      `width: ${tableWidth}`,
    ].join('; ');

    const alignmentClasses = {
      left: 'mr-auto ml-0',
      center: 'mx-auto',
      right: 'ml-auto mr-0',
    };

    return [
      'div',
      {
        class: 'tiptap-table-wrapper overflow-x-auto my-6',
      },
      [
        'table',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `tiptap-table theme-${tableTheme} ${alignmentClasses[tableAlignment as keyof typeof alignmentClasses] || ''}`,
          style,
        }),
        ['tbody', 0],
      ],
    ];
  },
});
