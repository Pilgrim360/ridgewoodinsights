import { BubbleMenu, Editor } from '@tiptap/react';
import { memo, useMemo } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Trash2,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Toolbar } from '../ui/Toolbar';

interface TableBubbleMenuProps {
  editor: Editor;
}

export const TableBubbleMenu = memo(
  ({ editor }: TableBubbleMenuProps) => {
    const isFloated = useMemo(() => {
      return (
        editor.isActive('table', { align: 'left' }) ||
        editor.isActive('table', { align: 'right' })
      );
    }, [editor.state]);

    const handleSetAlign = (align: 'left' | 'center' | 'right') => {
      if (editor.isActive('table', { align })) {
        editor.chain().focus().updateAttributes('table', { align: null }).run();
      } else {
        editor.chain().focus().updateAttributes('table', { align }).run();
      }
    };

    const handleAddClear = () => {
      const { to } = editor.state.selection;
      editor
        .chain()
        .focus()
        .insertContentAt(to, '<p class="rw-table-clear"></p>')
        .run();
    };

    const handleDeleteTable = () => {
      editor.chain().focus().deleteTable().run();
    };

    return (
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('table')}
        tippyOptions={{
          duration: 100,
          placement: 'top-start',
          theme: 'light-border',
        }}
      >
        <Toolbar.Root>
          <Toolbar.Button
            tooltip="Align left"
            onClick={() => handleSetAlign('left')}
            className={cn(editor.isActive('table', { align: 'left' }) && 'bg-accent')}
          >
            <AlignLeft className="h-4 w-4" />
          </Toolbar.Button>
          <Toolbar.Button
            tooltip="Align center"
            onClick={() => handleSetAlign('center')}
            className={cn(editor.isActive('table', { align: 'center' }) && 'bg-accent')}
          >
            <AlignCenter className="h-4 w-4" />
          </Toolbar.Button>
          <Toolbar.Button
            tooltip="Align right"
            onClick={() => handleSetAlign('right')}
            className={cn(editor.isActive('table', { align: 'right' }) && 'bg-accent')}
          >
            <AlignRight className="h-4 w-4" />
          </Toolbar.Button>

          {isFloated && (
            <>
              <Toolbar.Separator />
              <Toolbar.Button tooltip="Clear float" onClick={handleAddClear}>
                <Baseline className="h-4 w-4" />
              </Toolbar.Button>
            </>
          )}

          <Toolbar.Separator />

          <Toolbar.Button tooltip="Delete table" onClick={handleDeleteTable}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Toolbar.Button>
        </Toolbar.Root>
      </BubbleMenu>
    );
  },
  (prevProps, nextProps) => {
    const isTableActivePrev = prevProps.editor.isActive('table');
    const isTableActiveNext = nextProps.editor.isActive('table');

    if (isTableActivePrev !== isTableActiveNext) {
      return false;
    }

    if (!isTableActiveNext) {
      return true;
    }

    return (
      prevProps.editor.getAttributes('table').align ===
      nextProps.editor.getAttributes('table').align
    );
  }
);

TableBubbleMenu.displayName = 'TableBubbleMenu';
