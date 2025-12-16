import type { Editor } from '@tiptap/react';

export interface TocHeading {
  id: string | null;
  level: number;
  text: string;
  pos: number;
}

export function getTocHeadings(editor: Editor): TocHeading[] {
  const headings: TocHeading[] = [];

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'heading') return;

    headings.push({
      id: typeof node.attrs.id === 'string' ? (node.attrs.id as string) : null,
      level: typeof node.attrs.level === 'number' ? (node.attrs.level as number) : 1,
      text: node.textContent,
      pos,
    });
  });

  return headings;
}
