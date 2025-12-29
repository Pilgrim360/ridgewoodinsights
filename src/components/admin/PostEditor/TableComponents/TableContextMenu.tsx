'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type Editor as EditorType } from '@tiptap/react';
import {
  Trash2,
  Merge,
  Split,
  Columns2,
  Rows2,
  Palette,
  MoreHorizontal,
} from 'lucide-react';

interface TableContextMenuProps {
  editor: EditorType;
}

interface MenuPosition {
  x: number;
  y: number;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
}

export function TableContextMenu({ editor }: TableContextMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();

    // Check if we're in a table
    const { doc, selection } = editor.state;
    const { from } = selection;
    const resolved = doc.resolve(from);

    let isInTable = false;
    for (let i = 0; i < resolved.depth; i++) {
      const node = resolved.node(i);
      if (node && node.type.name.includes('table')) {
        isInTable = true;
        break;
      }
    }

    if (isInTable) {
      setPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
    }
  }, [editor]);

  const closeMenu = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, closeMenu]);

  // Add context menu listener to editor
  useEffect(() => {
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      editorElement.addEventListener('contextmenu', handleContextMenu as EventListener);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('contextmenu', handleContextMenu as EventListener);
      }
    };
  }, [editor, handleContextMenu]);

  const getMenuItems = (): MenuItem[] => {
    return [
      {
        label: 'Insert Row Above',
        icon: <Rows2 className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().addRowBefore().run();
          closeMenu();
        },
      },
      {
        label: 'Insert Row Below',
        icon: <Rows2 className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().addRowAfter().run();
          closeMenu();
        },
      },
      {
        label: 'Insert Column Left',
        icon: <Columns2 className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().addColumnBefore().run();
          closeMenu();
        },
      },
      {
        label: 'Insert Column Right',
        icon: <Columns2 className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().addColumnAfter().run();
          closeMenu();
        },
      },
      {
        label: '',
        icon: null,
        action: () => {},
      },
      {
        label: 'Delete Row',
        icon: <Trash2 className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().deleteRow().run();
          closeMenu();
        },
      },
      {
        label: 'Delete Column',
        icon: <Trash2 className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().deleteColumn().run();
          closeMenu();
        },
      },
      {
        label: 'Delete Table',
        icon: <Trash2 className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().deleteTable().run();
          closeMenu();
        },
      },
      {
        label: '',
        icon: null,
        action: () => {},
      },
      {
        label: 'Merge Cells',
        icon: <Merge className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().mergeCells().run();
          closeMenu();
        },
        shortcut: 'Ctrl+M',
      },
      {
        label: 'Split Cell',
        icon: <Split className="h-4 w-4" />,
        action: () => {
          editor.chain().focus().splitCell().run();
          closeMenu();
        },
        shortcut: 'Ctrl+Shift+S',
      },
      {
        label: '',
        icon: null,
        action: () => {},
      },
      {
        label: 'Cell Styles...',
        icon: <Palette className="h-4 w-4" />,
        action: () => {
          // TODO: Open cell styling panel
          closeMenu();
        },
      },
      {
        label: 'Border Styles...',
        icon: <MoreHorizontal className="h-4 w-4" />,
        action: () => {
          // TODO: Open border styling panel
          closeMenu();
        },
      },
      {
        label: 'Table Theme...',
        icon: <Palette className="h-4 w-4" />,
        action: () => {
          // TODO: Open theme panel
          closeMenu();
        },
      },
    ];
  };

  const adjustPosition = (x: number, y: number): MenuPosition => {
    const menuWidth = 240;
    const menuHeight = 400;
    const padding = 10;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust for right edge
    if (x + menuWidth > window.innerWidth - padding) {
      adjustedX = x - menuWidth;
    }

    // Adjust for bottom edge
    if (y + menuHeight > window.innerHeight - padding) {
      adjustedY = y - menuHeight;
    }

    // Adjust for left edge
    if (adjustedX < padding) {
      adjustedX = padding;
    }

    // Adjust for top edge
    if (adjustedY < padding) {
      adjustedY = padding;
    }

    return { x: adjustedX, y: adjustedY };
  };

  if (!isVisible) return null;

  const adjustedPosition = adjustPosition(position.x, position.y);
  const menuItems = getMenuItems();

  return (
    <div
      ref={menuRef}
      className="table-context-menu"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {menuItems.map((item, index) => {
        // Handle dividers (empty label items)
        if (!item.label && !item.icon) {
          return <div key={index} className="table-context-menu-divider" />;
        }

        return (
          <button
            key={index}
            className="table-context-menu-item"
            onClick={item.action}
            disabled={item.disabled}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.shortcut && <span className="shortcut">{item.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
}
