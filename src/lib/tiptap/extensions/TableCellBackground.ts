import { Extension } from '@tiptap/core';

export interface TableCellBackgroundOptions {
  HTMLAttributes: Record<string, string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableCellBackground: {
      setCellBackground: (color: string) => ReturnType;
      unsetCellBackground: () => ReturnType;
    };
  }
}

export const TableCellBackground = Extension.create<TableCellBackgroundOptions>({
  name: 'tableCellBackground',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      backgroundColor: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.backgroundColor || null,
        renderHTML: (attributes: { backgroundColor: string | null }) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setCellBackground:
        (color) =>
        ({ commands }) => {
          return commands.updateAttributes('tableCell', { backgroundColor: color });
        },
      unsetCellBackground:
        () =>
        ({ commands }) => {
          return commands.updateAttributes('tableCell', { backgroundColor: null });
        },
    };
  },
});
