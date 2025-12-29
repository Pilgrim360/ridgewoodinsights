import { Table, TableOptions } from '@tiptap/extension-table';

export interface AdvancedTableOptions extends TableOptions {
  HTMLAttributes: Record<string, string>;
  theme: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  borderColor: string;
  borderWidth: number;
  resizable: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    advancedTable: {
      setTableTheme: (theme: string) => ReturnType;
      setTableBorderStyle: (style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setTableBorderColor: (color: string) => ReturnType;
      setTableBorderWidth: (width: number) => ReturnType;
      setTableAttribute: (attr: string, value: unknown) => ReturnType;
    };
  }
}

export const AdvancedTable = Table.extend<AdvancedTableOptions>({
  name: 'advancedTable',

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
      theme: 'minimal',
      borderStyle: 'solid',
      borderColor: '#E2E7ED',
      borderWidth: 1,
      resizable: true,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      theme: {
        default: 'minimal',
        parseHTML: (element) => element.getAttribute('data-theme') || 'minimal',
        renderHTML: (attributes) => {
          return {
            'data-theme': attributes.theme,
          };
        },
      },
      borderStyle: {
        default: 'solid',
        parseHTML: (element) => element.getAttribute('data-border-style') || 'solid',
        renderHTML: (attributes) => {
          return {
            'data-border-style': attributes.borderStyle,
          };
        },
      },
      borderColor: {
        default: '#E2E7ED',
        parseHTML: (element) => element.getAttribute('data-border-color') || '#E2E7ED',
        renderHTML: (attributes) => {
          return {
            'data-border-color': attributes.borderColor,
          };
        },
      },
      borderWidth: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute('data-border-width') || '1', 10),
        renderHTML: (attributes) => {
          return {
            'data-border-width': attributes.borderWidth,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'table[data-component="advancedTable"]',
        priority: 60,
      },
      {
        tag: 'table',
        priority: 50,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { theme, borderStyle, borderColor, borderWidth } = this.options;
    
    return [
      'table',
      {
        'data-component': 'advancedTable',
        'data-theme': theme,
        'data-border-style': borderStyle,
        'data-border-color': borderColor,
        'data-border-width': borderWidth,
        class: `table-wrapper advanced-table table-theme-${theme}`,
        style: borderStyle !== 'solid' || borderColor !== '#E2E7ED' || borderWidth !== 1
          ? `border-style: ${borderStyle}; border-color: ${borderColor}; border-width: ${borderWidth}px;`
          : undefined,
        ...HTMLAttributes,
      },
      0,
    ];
  },

  addCommands() {
    return {
      setTableTheme:
        (theme) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { theme });
        },
      setTableBorderStyle:
        (borderStyle) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { borderStyle });
        },
      setTableBorderColor:
        (borderColor) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { borderColor });
        },
      setTableBorderWidth:
        (borderWidth) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { borderWidth });
        },
      setTableAttribute:
        (attr, value) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { [attr]: value });
        },
    };
  },
});
