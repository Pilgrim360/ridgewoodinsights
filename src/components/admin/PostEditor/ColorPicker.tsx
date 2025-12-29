'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { HexColorPicker } from 'react-colorful';

export interface ColorPickerProps {
  color?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ color, onChange, disabled }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton
          title="Color"
          aria-label="Color"
          disabled={disabled}
        >
          <Palette className="h-4 w-4" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
