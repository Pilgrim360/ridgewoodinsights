import TiptapImage from '@tiptap/extension-image';

export const ImageExtended = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).getAttribute('height'),
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
    };
  },
});
