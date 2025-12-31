'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Editor } from '@tiptap/react';

import { cn } from '@/lib/utils';
import {
  applyBorderPresetToActiveTable,
  selectActiveColumn,
  selectActiveRow,
  selectActiveTable,
  type TableBorderPreset,
} from '@/lib/tiptap/utils/tableHelpers';

interface MenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

export interface TableContextMenuProps {
  editor: Editor;
  disabled?: boolean;
}

const BORDER_PRESETS: Array<{ label: string; value: TableBorderPreset }> = [
  { label: 'Thin borders', value: 'table-borders-thin' },
  { label: 'Thick borders', value: 'table-borders-thick' },
  { label: 'Dashed borders', value: 'table-borders-dashed' },
  { label: 'Outer border only', value: 'table-borders-none' },
  { label: 'Header-only borders', value: 'table-borders-header-only' },
];

export function TableContextMenu({ editor, disabled }: TableContextMenuProps) {
  const [state, setState] = useState<MenuState>({ isOpen: false, x: 0, y: 0 });

  useEffect(() => {
    const root = editor.view.dom;

    const onContextMenu = (event: MouseEvent) => {
      if (disabled) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (!target.closest('table')) return;

      event.preventDefault();
      event.stopPropagation();

      setState({ isOpen: true, x: event.clientX, y: event.clientY });
    };

    const onMouseDown = (event: MouseEvent) => {
      if (!state.isOpen) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-rw-table-context-menu]')) return;
      setState((prev) => ({ ...prev, isOpen: false }));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    root.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      root.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [disabled, editor, state.isOpen]);

  const menu = useMemo(() => {
    if (!state.isOpen) return null;

    const run = (fn: () => void) => {
      fn();
      setState((prev) => ({ ...prev, isOpen: false }));
    };

    return (
      <div
        data-rw-table-context-menu
        role="menu"
        aria-label="Table context menu"
        className={cn(
          'fixed z-50 w-56 rounded-lg border border-surface bg-white p-1 shadow-lg',
          'text-sm text-secondary'
        )}
        style={{ top: state.y, left: state.x }}
      >
        <MenuItem label="Insert row above" onClick={() => run(() => editor.chain().focus().addRowBefore().run())} />
        <MenuItem label="Insert row below" onClick={() => run(() => editor.chain().focus().addRowAfter().run())} />
        <MenuItem label="Insert column left" onClick={() => run(() => editor.chain().focus().addColumnBefore().run())} />
        <MenuItem label="Insert column right" onClick={() => run(() => editor.chain().focus().addColumnAfter().run())} />

        <Separator />

        <MenuItem label="Delete row" onClick={() => run(() => editor.chain().focus().deleteRow().run())} />
        <MenuItem label="Delete column" onClick={() => run(() => editor.chain().focus().deleteColumn().run())} />

        <Separator />

        <MenuItem label="Select row" onClick={() => run(() => selectActiveRow(editor))} />
        <MenuItem label="Select column" onClick={() => run(() => selectActiveColumn(editor))} />
        <MenuItem label="Select table" onClick={() => run(() => selectActiveTable(editor))} />

        <Separator />

        {BORDER_PRESETS.map((preset) => (
          <MenuItem
            key={preset.value}
            label={preset.label}
            onClick={() => run(() => applyBorderPresetToActiveTable(editor, preset.value))}
          />
        ))}

        <Separator />

        <MenuItem label="Merge cells" onClick={() => run(() => editor.chain().focus().mergeCells().run())} />
        <MenuItem label="Split cell" onClick={() => run(() => editor.chain().focus().splitCell().run())} />

        <Separator />

        <MenuItem
          label="Delete table"
          destructive
          onClick={() => run(() => editor.chain().focus().deleteTable().run())}
        />
      </div>
    );
  }, [editor, state.isOpen, state.x, state.y]);

  if (!menu) return null;
  return createPortal(menu, document.body);
}

function Separator() {
  return <div className="my-1 h-px bg-surface" role="separator" aria-hidden />;
}

function MenuItem({
  label,
  onClick,
  destructive,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'w-full rounded-md px-2 py-2 text-left',
        'hover:bg-primary/10 focus:bg-primary/10 focus:outline-none',
        destructive && 'text-red-700 hover:bg-red-50 focus:bg-red-50'
      )}
    >
      {label}
    </button>
  );
}
