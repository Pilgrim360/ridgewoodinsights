import { ReactRenderer, type Editor } from '@tiptap/react';
import tippy, { type Instance, type Props } from 'tippy.js';
import { SlashCommandList, getSuggestionItems } from '@/components/cms/PostEditor/SlashCommandList';
import { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';

export const slashCommandSuggestion = {
  items: getSuggestionItems,
  render: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let component: ReactRenderer<any, any>;
    let popup: Instance<Props>[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(SlashCommandList, {
          props,
          editor: props.editor as Editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (component.ref as any)?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
