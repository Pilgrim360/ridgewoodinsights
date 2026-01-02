import Table, { TableOptions } from '@tiptap/extension-table';
import { mergeAttributes, Extension } from '@tiptap/core';

export interface ExtendedTableOptions extends TableOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setTableAlignment: (alignment: 'left' | 'center' | 'right') => ReturnType;
  }
}

export const TipTapTable = Table.extend<ExtendedTableOptions>({
  name: 'table',

  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('align') || 'center',
        renderHTML: (attributes) => {
          if (!attributes.align || attributes.align === 'center') {
            return {};
          }
          return {
            align: attributes.align,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTableAlignment:
        (alignment: 'left' | 'center' | 'right') =>
        ({ commands }) => {
          return commands.updateAttributes('table', { align: alignment });
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes.align || 'center';
    const classes = ['table'];
    
    if (align !== 'center') {
      classes.push(`align-${align}`);
    }

    return [
      'table',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: classes.join(' '),
      }),
      ['tbody', 0],
    ];
  },
});