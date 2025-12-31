import { Extension } from '@tiptap/core';

export const TableKeyboardCommands = Extension.create({
  name: 'tableKeyboardCommands',

  addKeyboardShortcuts() {
    return {
      'Tab': () => {
        if (this.editor.isActive('table')) {
          return this.editor.commands.goToNextCell();
        }
        return false;
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('table')) {
          return this.editor.commands.goToPreviousCell();
        }
        return false;
      },
      // Add more as needed
    };
  },
});
