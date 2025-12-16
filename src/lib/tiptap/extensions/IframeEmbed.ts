import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframeEmbed: {
      setIframeEmbed: (options: { src: string; title?: string }) => ReturnType;
    };
  }
}

export const IframeEmbed = Node.create({
  name: 'iframeEmbed',

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
        tag: 'iframe[data-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'embed-wrapper' },
      [
        'iframe',
        mergeAttributes(HTMLAttributes, {
          'data-embed': 'true',
          loading: 'lazy',
          class: 'embed-iframe',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setIframeEmbed:
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
