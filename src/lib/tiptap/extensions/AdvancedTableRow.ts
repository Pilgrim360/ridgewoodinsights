import TableRow from '@tiptap/extension-table-row';

import {
  DEFAULT_BORDER_ATTRIBUTES,
  normalizeHexColor,
  type BorderStyle,
} from '../utils/tableHelpers';

export const AdvancedTableRow = TableRow.extend({
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
      borderColor: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderColor,
        parseHTML: (element) => {
          const color = normalizeHexColor((element as HTMLElement).style.borderTopColor);
          return color ?? DEFAULT_BORDER_ATTRIBUTES.borderColor;
        },
      },
    };
  },
});
