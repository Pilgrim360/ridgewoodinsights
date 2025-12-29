'use client';

import { Editor } from '@tiptap/react';
import { useState } from 'react';

export interface TableControlPopoverProps {
  editor: Editor;
  onClose: () => void;
}

export function TableControlPopover({ editor }: Omit<TableControlPopoverProps, 'onClose'>) {
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState('1');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const applyStyles = () => {
    const { selection } = editor.state;
    if (selection.isNode && selection.node.type.name === 'table') {
      const { from, to } = selection;
      editor.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
          editor
            .chain()
            .focus()
            .setCellAttributeAt(pos, 'borderColor', borderColor)
            .setCellAttributeAt(pos, 'borderWidth', `${borderWidth}px`)
            .setCellAttributeAt(pos, 'borderStyle', borderStyle)
            .setCellAttributeAt(pos, 'backgroundColor', backgroundColor)
            .run();
        }
      });
    } else {
      editor
        .chain()
        .focus()
        .setCellAttribute('borderColor', borderColor)
        .setCellAttribute('borderWidth', `${borderWidth}px`)
        .setCellAttribute('borderStyle', borderStyle)
        .setCellAttribute('backgroundColor', backgroundColor)
        .run();
    }
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Background Color</h4>
        <p className="text-sm text-muted-foreground">
          Select a color for the cell background.
        </p>
      </div>
      <div className="grid gap-2">
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-full h-8"
        />
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Border Style</h4>
        <p className="text-sm text-muted-foreground">
          Select a style for the cell borders.
        </p>
      </div>
      <div className="grid gap-2">
        <select
          value={borderStyle}
          onChange={(e) => setBorderStyle(e.target.value)}
          className="w-full h-8"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Border Width</h4>
        <p className="text-sm text-muted-foreground">
          Set the width of the cell borders.
        </p>
      </div>
      <div className="grid gap-2">
        <input
          type="number"
          value={borderWidth}
          onChange={(e) => setBorderWidth(e.target.value)}
          className="w-full h-8"
        />
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Border Color</h4>
        <p className="text-sm text-muted-foreground">
          Select a color for the cell borders.
        </p>
      </div>
      <div className="grid gap-2">
        <input
          type="color"
          value={borderColor}
          onChange={(e) => setBorderColor(e.target.value)}
          className="w-full h-8"
        />
      </div>
      <button onClick={applyStyles} className="mt-4 px-4 py-2 bg-primary text-white rounded">
        Apply All
      </button>
    </div>
  );
}
