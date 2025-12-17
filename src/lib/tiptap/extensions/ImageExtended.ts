import TiptapImage from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ResizableImageNodeView } from '../nodeViews/ResizableImageNodeView';

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
      class: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).getAttribute('class'),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});
