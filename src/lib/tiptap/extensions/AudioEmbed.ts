import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audioEmbed: {
      setAudioEmbed: (options: { src: string; title?: string }) => ReturnType;
    };
  }
}

export const AudioEmbed = Node.create({
  name: 'audioEmbed',

  group: 'block',

  atom: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'audio[data-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'audio',
      mergeAttributes(HTMLAttributes, {
        'data-embed': 'true',
        controls: 'true',
      }),
    ];
  },

  addCommands() {
    return {
      setAudioEmbed:
        ({ src, title }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src,
              title: title ?? null,
            },
          });
        },
    };
  },
});
