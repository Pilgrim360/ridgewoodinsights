'use client';

import { useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import { useCmsHeaderSlots } from '@/contexts/CmsHeaderSlotsContext';
import { EditorToolbar } from './EditorToolbar';

export interface EditorToolbarGlobalProps {
  editor: Editor | null;
  disabled?: boolean;
  onError?: (message: string) => void;
}

/**
 * EditorToolbarGlobal
 * 
 * Positions the editor toolbar in a fixed location beneath the CMS header.
 * Uses the CmsHeaderSlotsContext to inject the toolbar into the layout.
 * This ensures the toolbar stays visible while scrolling through content.
 */
export function EditorToolbarGlobal({
  editor,
  disabled,
  onError,
}: EditorToolbarGlobalProps) {
  const { setToolbar } = useCmsHeaderSlots();

  useEffect(() => {
    if (!editor) {
      setToolbar(null);
      return;
    }

    // Create the toolbar component to inject into the header slots
    const toolbarComponent = (
      <div className="border-b border-surface bg-white/95 backdrop-blur-md">
        <EditorToolbar
          editor={editor}
          disabled={disabled}
          onError={onError}
          className="w-full border-0 rounded-none bg-transparent shadow-none"
        />
      </div>
    );

    setToolbar(toolbarComponent);

    // Cleanup: remove toolbar when component unmounts or editor is destroyed
    return () => {
      setToolbar(null);
    };
  }, [editor, disabled, onError, setToolbar]);

  // This component doesn't render anything itself - it just manages the toolbar in context
  return null;
}
