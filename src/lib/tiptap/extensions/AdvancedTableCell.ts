import { TableCell, TableCellOptions } from '@tiptap/extension-table-cell';

export interface AdvancedTableCellOptions extends TableCellOptions {
  HTMLAttributes: Record<string, string>;
  backgroundColor: string;
  textColor: string;
  borderTopColor: string;
  borderTopWidth: number;
  borderTopStyle: 'solid' | 'dashed' | 'dotted';
  borderBottomColor: string;
  borderBottomWidth: number;
  borderBottomStyle: 'solid' | 'dashed' | 'dotted';
  borderLeftColor: string;
  borderLeftWidth: number;
  borderLeftStyle: 'solid' | 'dashed' | 'dotted';
  borderRightColor: string;
  borderRightWidth: number;
  borderRightStyle: 'solid' | 'dashed' | 'dotted';
  colspan: number;
  rowspan: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    advancedTableCell: {
      setCellBackground: (color: string) => ReturnType;
      setCellTextColor: (color: string) => ReturnType;
      setCellBorderTop: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderBottom: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderLeft: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderRight: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      setCellBorderAll: (color: string, width: number, style: 'solid' | 'dashed' | 'dotted') => ReturnType;
      clearCellBorders: () => ReturnType;
      setColspan: (value: number) => ReturnType;
      setRowspan: (value: number) => ReturnType;
    };
  }
}

export const AdvancedTableCell = TableCell.extend<AdvancedTableCellOptions>({
  name: 'tableCell',

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
      backgroundColor: '',
      textColor: '',
      borderTopColor: '',
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderBottomColor: '',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderLeftColor: '',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderRightColor: '',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      colspan: 1,
      rowspan: 1,
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-background-color') || '',
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor} !important`,
          };
        },
      },
      textColor: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-text-color') || '',
        renderHTML: (attributes) => {
          if (!attributes.textColor) return {};
          return {
            'data-text-color': attributes.textColor,
            style: `color: ${attributes.textColor} !important`,
          };
        },
      },
      borderTopColor: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-border-top-color') || '',
        renderHTML: (attributes) => {
          if (!attributes.borderTopColor) return {};
          return {
            'data-border-top-color': attributes.borderTopColor,
          };
        },
      },
      borderTopWidth: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute('data-border-top-width') || '1', 10),
        renderHTML: (attributes) => {
          return {
            'data-border-top-width': attributes.borderTopWidth,
          };
        },
      },
      borderTopStyle: {
        default: 'solid',
        parseHTML: (element) => element.getAttribute('data-border-top-style') || 'solid',
        renderHTML: (attributes) => {
          return {
            'data-border-top-style': attributes.borderTopStyle,
          };
        },
      },
      borderBottomColor: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-border-bottom-color') || '',
        renderHTML: (attributes) => {
          if (!attributes.borderBottomColor) return {};
          return {
            'data-border-bottom-color': attributes.borderBottomColor,
          };
        },
      },
      borderBottomWidth: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute('data-border-bottom-width') || '1', 10),
        renderHTML: (attributes) => {
          return {
            'data-border-bottom-width': attributes.borderBottomWidth,
          };
        },
      },
      borderBottomStyle: {
        default: 'solid',
        parseHTML: (element) => element.getAttribute('data-border-bottom-style') || 'solid',
        renderHTML: (attributes) => {
          return {
            'data-border-bottom-style': attributes.borderBottomStyle,
          };
        },
      },
      borderLeftColor: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-border-left-color') || '',
        renderHTML: (attributes) => {
          if (!attributes.borderLeftColor) return {};
          return {
            'data-border-left-color': attributes.borderLeftColor,
          };
        },
      },
      borderLeftWidth: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute('data-border-left-width') || '1', 10),
        renderHTML: (attributes) => {
          return {
            'data-border-left-width': attributes.borderLeftWidth,
          };
        },
      },
      borderLeftStyle: {
        default: 'solid',
        parseHTML: (element) => element.getAttribute('data-border-left-style') || 'solid',
        renderHTML: (attributes) => {
          return {
            'data-border-left-style': attributes.borderLeftStyle,
          };
        },
      },
      borderRightColor: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-border-right-color') || '',
        renderHTML: (attributes) => {
          if (!attributes.borderRightColor) return {};
          return {
            'data-border-right-color': attributes.borderRightColor,
          };
        },
      },
      borderRightWidth: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute('data-border-right-width') || '1', 10),
        renderHTML: (attributes) => {
          return {
            'data-border-right-width': attributes.borderRightWidth,
          };
        },
      },
      borderRightStyle: {
        default: 'solid',
        parseHTML: (element) => element.getAttribute('data-border-right-style') || 'solid',
        renderHTML: (attributes) => {
          return {
            'data-border-right-style': attributes.borderRightStyle,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'td[data-component="advancedTableCell"]',
        priority: 60,
      },
      {
        tag: 'td',
        priority: 50,
      },
      {
        tag: 'th',
        priority: 50,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const {
      backgroundColor,
      textColor,
      borderTopColor,
      borderTopWidth,
      borderTopStyle,
      borderBottomColor,
      borderBottomWidth,
      borderBottomStyle,
      borderLeftColor,
      borderLeftWidth,
      borderLeftStyle,
      borderRightColor,
      borderRightWidth,
      borderRightStyle,
    } = this.options;

    const styles: string[] = [];

    if (backgroundColor) {
      styles.push(`background-color: ${backgroundColor} !important`);
    }
    if (textColor) {
      styles.push(`color: ${textColor} !important`);
    }

    // Build border styles
    const borderParts: string[] = [];
    
    if (borderTopColor) {
      borderParts.push(`border-top: ${borderTopWidth}px ${borderTopStyle} ${borderTopColor} !important`);
    }
    if (borderBottomColor) {
      borderParts.push(`border-bottom: ${borderBottomWidth}px ${borderBottomStyle} ${borderBottomColor} !important`);
    }
    if (borderLeftColor) {
      borderParts.push(`border-left: ${borderLeftWidth}px ${borderLeftStyle} ${borderLeftColor} !important`);
    }
    if (borderRightColor) {
      borderParts.push(`border-right: ${borderRightWidth}px ${borderRightStyle} ${borderRightColor} !important`);
    }

    if (borderParts.length > 0) {
      styles.push(...borderParts);
    }

    return [
      'td',
      {
        'data-component': 'advancedTableCell',
        'data-background-color': backgroundColor || undefined,
        'data-text-color': textColor || undefined,
        'data-border-top-color': borderTopColor || undefined,
        'data-border-top-width': borderTopWidth || undefined,
        'data-border-top-style': borderTopStyle || undefined,
        'data-border-bottom-color': borderBottomColor || undefined,
        'data-border-bottom-width': borderBottomWidth || undefined,
        'data-border-bottom-style': borderBottomStyle || undefined,
        'data-border-left-color': borderLeftColor || undefined,
        'data-border-left-width': borderLeftWidth || undefined,
        'data-border-left-style': borderLeftStyle || undefined,
        'data-border-right-color': borderRightColor || undefined,
        'data-border-right-width': borderRightWidth || undefined,
        'data-border-right-style': borderRightStyle || undefined,
        class: 'advanced-table-cell',
        style: styles.length > 0 ? styles.join('; ') : undefined,
        ...HTMLAttributes,
      },
      0,
    ];
  },

  addCommands() {
    return {
      setCellBackground:
        (backgroundColor) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { backgroundColor });
        },
      setCellTextColor:
        (textColor) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { textColor });
        },
      setCellBorderTop:
        (borderTopColor, borderTopWidth, borderTopStyle) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            borderTopColor,
            borderTopWidth,
            borderTopStyle,
          });
        },
      setCellBorderBottom:
        (borderBottomColor, borderBottomWidth, borderBottomStyle) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            borderBottomColor,
            borderBottomWidth,
            borderBottomStyle,
          });
        },
      setCellBorderLeft:
        (borderLeftColor, borderLeftWidth, borderLeftStyle) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            borderLeftColor,
            borderLeftWidth,
            borderLeftStyle,
          });
        },
      setCellBorderRight:
        (borderRightColor, borderRightWidth, borderRightStyle) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            borderRightColor,
            borderRightWidth,
            borderRightStyle,
          });
        },
      setCellBorderAll:
        (borderColor, borderWidth, borderStyle) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            borderTopColor: borderColor,
            borderTopWidth: borderWidth,
            borderTopStyle: borderStyle,
            borderBottomColor: borderColor,
            borderBottomWidth: borderWidth,
            borderBottomStyle: borderStyle,
            borderLeftColor: borderColor,
            borderLeftWidth: borderWidth,
            borderLeftStyle: borderStyle,
            borderRightColor: borderColor,
            borderRightWidth: borderWidth,
            borderRightStyle: borderStyle,
          });
        },
      clearCellBorders:
        () =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            borderTopColor: '',
            borderBottomColor: '',
            borderLeftColor: '',
            borderRightColor: '',
          });
        },
      setColspan:
        (colspan) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { colspan: Math.max(1, colspan) });
        },
      setRowspan:
        (rowspan) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { rowspan: Math.max(1, rowspan) });
        },
    };
  },
});
