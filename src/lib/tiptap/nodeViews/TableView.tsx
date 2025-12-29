import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Table as TableIcon } from 'lucide-react';

export const TableView = ({ editor }) => (
  <NodeViewWrapper className="relative">
    <div
      className="absolute -left-8 top-0 flex h-full items-center"
      contentEditable="false"
    >
      <button
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-white p-1 text-gray-400 shadow-md hover:bg-gray-100"
        onClick={() => editor.chain().focus().selectAll(editor.state.selection.from).run()}
      >
        <TableIcon size={16} />
      </button>
    </div>
    <div className="table-wrapper">
      <table className="w-full border-collapse">
        <tbody className="content" />
      </table>
    </div>
  </NodeViewWrapper>
);

export default (editor) => ReactNodeViewRenderer(TableView, { editor });
