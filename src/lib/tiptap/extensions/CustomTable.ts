import Table from '@tiptap/extension-table';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TableView } from '../nodeViews/TableView';

export const CustomTable = Table.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableView);
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'table-wrapper' },
      ['table', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['tbody', 0]],
    ];
  },
});
