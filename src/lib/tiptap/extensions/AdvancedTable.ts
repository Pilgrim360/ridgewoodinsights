import Table from '@tiptap/extension-table';
import { mergeAttributes } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { CellSelection, cellAround } from '@tiptap/pm/tables';

import { createAdvancedTableNodeView } from '@/components/admin/PostEditor/TableNodeView';

import {
  DEFAULT_BORDER_ATTRIBUTES,
  DEFAULT_BORDER_COLOR,
  findParentTable,
  getTableSelectionType,
  normalizeHexColor,
  type BorderRadius,
  type BorderStyle,
  type BorderWidth,
  type TableBorderPreset,
  type TableTheme,
} from '../utils/tableHelpers';

export type TableCellPadding = 'compact' | 'normal' | 'spacious';
export type TableFloat = 'none' | 'left' | 'right';

export const AdvancedTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderStyle: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderStyle,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderStyle as BorderStyle) || DEFAULT_BORDER_ATTRIBUTES.borderStyle,
      },
      borderTopWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderTopWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderTopWidth as BorderWidth) || DEFAULT_BORDER_ATTRIBUTES.borderTopWidth,
      },
      borderRightWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderRightWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderRightWidth as BorderWidth) ||
          DEFAULT_BORDER_ATTRIBUTES.borderRightWidth,
      },
      borderBottomWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderBottomWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderBottomWidth as BorderWidth) ||
          DEFAULT_BORDER_ATTRIBUTES.borderBottomWidth,
      },
      borderLeftWidth: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderLeftWidth,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderLeftWidth as BorderWidth) || DEFAULT_BORDER_ATTRIBUTES.borderLeftWidth,
      },
      borderColor: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderColor,
        parseHTML: (element) => {
          const el = element as HTMLElement;
          const color = normalizeHexColor(el.style.borderColor);
          return color ?? DEFAULT_BORDER_COLOR;
        },
      },
      borderRadius: {
        default: DEFAULT_BORDER_ATTRIBUTES.borderRadius,
        parseHTML: (element) =>
          ((element as HTMLElement).style.borderRadius as BorderRadius) || DEFAULT_BORDER_ATTRIBUTES.borderRadius,
      },
      borderPreset: {
        default: 'table-borders-thin' as TableBorderPreset,
        parseHTML: (element) => {
          const classList = (element as HTMLElement).classList;
          const presets: TableBorderPreset[] = [
            'table-borders-thin',
            'table-borders-thick',
            'table-borders-dashed',
            'table-borders-none',
            'table-borders-header-only',
          ];
          return presets.find((preset) => classList.contains(preset)) ?? 'table-borders-thin';
        },
      },
      theme: {
        default: 'light' as TableTheme,
        parseHTML: (element) => {
          const theme = (element as HTMLElement).getAttribute('data-rw-table-theme');
          if (theme === 'data' || theme === 'minimal' || theme === 'custom') return theme;
          return 'light';
        },
      },
      alternatingRows: {
        default: false,
        parseHTML: (element) => (element as HTMLElement).getAttribute('data-rw-table-zebra') === 'true',
      },
      cellPadding: {
        default: 'normal' as TableCellPadding,
        parseHTML: (element) => {
          const value = (element as HTMLElement).getAttribute('data-rw-cell-padding');
          if (value === 'compact' || value === 'spacious') return value;
          return 'normal';
        },
      },
      float: {
        default: 'none' as TableFloat,
        parseHTML: (element) => {
          const value = (element as HTMLElement).getAttribute('data-rw-table-float');
          if (value === 'left' || value === 'right') return value;
          return 'none';
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() ?? [];

    return [
      ...parentPlugins,
      new Plugin({
        props: {
          decorations: (state) => {
            const selectionType = getTableSelectionType(state);
            if (!selectionType) return null;

            const table = findParentTable(state);
            if (!table) return null;

            return DecorationSet.create(state.doc, [
              Decoration.node(table.pos, table.pos + table.node.nodeSize, {
                class: `rw-table-selection-${selectionType}`,
              }),
            ]);
          },

          handleDOMEvents: {
            mousedown: (view, event) => {
              const mouseEvent = event as MouseEvent;
              if (mouseEvent.detail < 4) return false;

              const target = mouseEvent.target as HTMLElement | null;
              const cellDom = target?.closest('td,th');
              if (!cellDom) return false;

              const pos = view.posAtDOM(cellDom, 0);
              const $pos = view.state.doc.resolve(pos);
              const $cell = cellAround($pos);
              if (!$cell) return false;

              const tr = view.state.tr.setSelection(CellSelection.create(view.state.doc, $cell.pos));
              view.dispatch(tr);
              view.focus();

              mouseEvent.preventDefault();
              mouseEvent.stopPropagation();

              return true;
            },

            mouseup: (view, event) => {
              const selection =
                'getSelection' in view.root ? view.root.getSelection() : window.getSelection();
              if (!selection || selection.isCollapsed) return false;

              const anchorEl =
                (selection.anchorNode instanceof Element
                  ? selection.anchorNode
                  : selection.anchorNode?.parentElement) ?? null;
              const headEl =
                (selection.focusNode instanceof Element
                  ? selection.focusNode
                  : selection.focusNode?.parentElement) ?? null;

              const anchorCell = anchorEl?.closest?.('td,th') ?? null;
              const headCell = headEl?.closest?.('td,th') ?? null;

              if (!anchorCell || !headCell || anchorCell === headCell) return false;

              const anchorPos = view.posAtDOM(anchorCell, 0);
              const headPos = view.posAtDOM(headCell, 0);

              const $anchor = cellAround(view.state.doc.resolve(anchorPos));
              const $head = cellAround(view.state.doc.resolve(headPos));

              if (!$anchor || !$head) return false;

              const tr = view.state.tr.setSelection(new CellSelection($anchor, $head));
              view.dispatch(tr);
              view.focus();

              selection.removeAllRanges();

              (event as MouseEvent).preventDefault();

              return true;
            },
          },
        },
      }),
    ];
  },

  addNodeView() {
    return ({ node, view, getPos }) =>
      createAdvancedTableNodeView({ cellMinWidth: this.options.cellMinWidth })({
        node,
        view,
        getPos,
      });
  },

  renderHTML({ node, HTMLAttributes }) {
    const {
      borderColor,
      borderRadius,
      borderPreset,
      theme,
      alternatingRows,
      cellPadding,
      float,
    } = node.attrs as {
      borderColor: string;
      borderRadius: BorderRadius;
      borderPreset: TableBorderPreset;
      theme: TableTheme;
      alternatingRows: boolean;
      cellPadding: TableCellPadding;
      float: TableFloat;
    };

    const classes = [
      'rw-table',
      `rw-table-theme-${theme}`,
      `rw-table-padding-${cellPadding}`,
      borderPreset,
      float !== 'none' ? `rw-table-float-${float}` : null,
    ]
      .filter(Boolean)
      .join(' ');

    const outerBorder =
      borderPreset === 'table-borders-none' || borderPreset === 'table-borders-header-only'
        ? `border: 1px solid ${borderColor ?? DEFAULT_BORDER_COLOR};`
        : '';

    const style = [
      HTMLAttributes.style,
      outerBorder,
      `border-radius: ${borderRadius ?? '0px'};`,
      `--rw-table-border-color: ${borderColor ?? DEFAULT_BORDER_COLOR};`,
      `--rw-table-radius: ${borderRadius ?? '0px'};`,
    ]
      .filter(Boolean)
      .join(' ');

    return [
      'div',
      { class: 'tableWrapper rw-table-wrapper' },
      [
        'table',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: classes,
          style,
          'data-rw-table-theme': theme,
          'data-rw-table-zebra': alternatingRows ? 'true' : 'false',
          'data-rw-cell-padding': cellPadding,
          'data-rw-table-float': float,
        }),
        ['tbody', 0],
      ],
    ];
  },
});
