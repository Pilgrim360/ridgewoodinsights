'use client';

import { useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import type { ChainedCommands } from '@tiptap/react';

import { cn } from '@/lib/utils';

export interface FloatingToolbarButtonProps {
  editor: Editor;
  action: (chain: ChainedCommands) => ChainedCommands;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

export function FloatingToolbarButton({
  editor,
  action,
  isActive,
  children,
  title,
  disabled,
}: FloatingToolbarButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    action(editor.chain().focus()).run();
  }, [action, editor]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      title={title}
      disabled={disabled}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded px-1.5',
        'text-sm transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-secondary hover:bg-surface/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

export interface FloatingToolbarDividerProps {
  className?: string;
}

export function FloatingToolbarDivider({ className }: FloatingToolbarDividerProps) {
  return (
    <div
      className={cn('mx-1 h-6 w-px bg-surface', className)}
      aria-hidden
    />
  );
}
