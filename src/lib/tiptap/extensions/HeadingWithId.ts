import Heading from '@tiptap/extension-heading';
import { Plugin } from '@tiptap/pm/state';
import { slugify } from '../utils';

export const HeadingWithId = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).getAttribute('id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            id: attributes.id,
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const typeName = this.name;

    return [
      ...(this.parent?.() ?? []),
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) return null;

          const tr = newState.tr;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (node.type.name !== typeName) return;

            const text = node.textContent.trim();
            if (!text) return;

            const nextId = slugify(text);
            if (!nextId) return;

            if (node.attrs.id !== nextId) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id: nextId,
              });
              modified = true;
            }
          });

          if (!modified) return null;
          return tr;
        },
      }),
    ];
  },
});
