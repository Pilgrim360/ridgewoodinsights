import { Extension } from '@tiptap/core';

export interface LineHeightOptions {
  types: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string | null) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => {
              const lineHeight = (element as HTMLElement).style.lineHeight;
              return lineHeight || null;
            },
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ chain }) => {
          return chain()
            .updateAttributes('paragraph', {
              lineHeight,
            })
            .updateAttributes('heading', {
              lineHeight,
            })
            .run();
        },
      unsetLineHeight:
        () =>
        ({ chain }) => {
          return chain()
            .updateAttributes('paragraph', {
              lineHeight: null,
            })
            .updateAttributes('heading', {
              lineHeight: null,
            })
            .run();
        },
    };
  },
});
