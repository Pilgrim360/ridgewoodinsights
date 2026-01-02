import Table from '@tiptap/extension-table';

export const TableExtended = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute('data-align') || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.align) {
            return {};
          }
          return { 'data-align': attributes.align };
        },
      },
    };
  },
});
