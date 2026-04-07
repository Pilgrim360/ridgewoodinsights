'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  ReactNode,
} from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Youtube,
  Type,
} from 'lucide-react';
import { Editor, Range } from '@tiptap/core';
import { cn } from '@/lib/utils';

interface CommandProps {
  editor: Editor;
  range: Range;
}

interface Item {
  title: string;
  description: string;
  searchTerms?: string[];
  icon: ReactNode;
  command: (props: CommandProps) => void;
}

interface SlashCommandListProps {
  items: Item[];
  command: (item: Item) => void;
}

export const SlashCommandList = forwardRef((props: SlashCommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-lg border border-surface bg-white p-1 shadow-md transition-all">
      {props.items.length > 0 ? (
        props.items.map((item: Item, index: number) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-secondary transition-colors',
              index === selectedIndex ? 'bg-surface text-primary' : 'hover:bg-surface'
            )}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-surface bg-white text-text/70">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-text/50">{item.description}</p>
            </div>
          </button>
        ))
      ) : (
        <div className="px-2 py-1.5 text-sm text-text/50">No results</div>
      )}
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';

export const getSuggestionItems = ({ query }: { query: string }): Item[] => {
  return [
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: <Type className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('paragraph').run();
      },
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: <Heading1 className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: <Heading2 className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: <Heading3 className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: <List className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: <ListOrdered className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quotation.',
      searchTerms: ['blockquote'],
      icon: <Quote className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      searchTerms: ['codeblock'],
      icon: <Code className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: 'Image',
      description: 'Insert an image.',
      searchTerms: ['photo', 'picture', 'media'],
      icon: <ImageIcon className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        const event = new CustomEvent('cms:open-media-modal');
        window.dispatchEvent(event);
      },
    },
    {
      title: 'Table',
      description: 'Insert a 3x3 table.',
      searchTerms: ['grid', 'spreadsheet', 'rows'],
      icon: <TableIcon className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
    },
    {
      title: 'Horizontal Rule',
      description: 'Insert a horizontal divider.',
      searchTerms: ['line', 'break', 'divider'],
      icon: <Minus className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: 'YouTube',
      description: 'Embed a YouTube video.',
      searchTerms: ['video', 'youtube', 'embed'],
      icon: <Youtube className="h-4 w-4" />,
      command: ({ editor, range }: CommandProps) => {
        const url = window.prompt('YouTube URL');
        if (url) {
          editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run();
        } else {
          editor.chain().focus().deleteRange(range).run();
        }
      },
    },
  ].filter((item) => {
    if (typeof query === 'string' && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms && item.searchTerms.some((term) => term.includes(search)))
      );
    }
    return true;
  });
};
