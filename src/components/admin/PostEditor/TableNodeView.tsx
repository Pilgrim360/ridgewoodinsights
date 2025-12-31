import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { NodeView, EditorView } from '@tiptap/pm/view';
import { CellSelection, TableMap, TableView } from '@tiptap/pm/tables';

type GetPos = () => number;

export class AdvancedTableView extends TableView implements NodeView {
  private view: EditorView;
  private getPos: GetPos;
  private colGripContainer: HTMLDivElement;
  private rowGripContainer: HTMLDivElement;
  private cornerGrip: HTMLButtonElement;

  constructor(node: ProseMirrorNode, cellMinWidth: number, view: EditorView, getPos: GetPos) {
    // TableView only expects (node, cellMinWidth), but we keep view/getPos for selection interactions.
    super(node, cellMinWidth);

    this.view = view;
    this.getPos = getPos;

    this.dom.classList.add('rw-table-nodeview', 'rw-table-wrapper');
    this.dom.style.position = 'relative';

    this.syncTableDomAttributes();

    this.colGripContainer = document.createElement('div');
    this.colGripContainer.className = 'rw-table-col-grips';
    this.colGripContainer.contentEditable = 'false';

    this.rowGripContainer = document.createElement('div');
    this.rowGripContainer.className = 'rw-table-row-grips';
    this.rowGripContainer.contentEditable = 'false';

    this.cornerGrip = document.createElement('button');
    this.cornerGrip.type = 'button';
    this.cornerGrip.className = 'rw-table-corner-grip';
    this.cornerGrip.contentEditable = 'false';
    this.cornerGrip.setAttribute('aria-label', 'Select table');

    this.cornerGrip.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.selectEntireTable();
    });

    this.dom.appendChild(this.colGripContainer);
    this.dom.appendChild(this.rowGripContainer);
    this.dom.appendChild(this.cornerGrip);

    this.syncGrips();
  }

  update(node: ProseMirrorNode): boolean {
    const updated = super.update(node);
    if (updated) {
      this.syncTableDomAttributes();
      this.syncGrips();
    }
    return updated;
  }

  destroy(): void {
    this.colGripContainer.remove();
    this.rowGripContainer.remove();
    this.cornerGrip.remove();
  }

  private syncTableDomAttributes() {
    const attrs = this.node.attrs as Record<string, unknown>;

    const borderPreset = (attrs.borderPreset as string | undefined) ?? 'table-borders-thin';
    const theme = (attrs.theme as string | undefined) ?? 'light';
    const cellPadding = (attrs.cellPadding as string | undefined) ?? 'normal';
    const float = (attrs.float as string | undefined) ?? 'none';

    this.table.className = [
      'rw-table',
      `rw-table-theme-${theme}`,
      `rw-table-padding-${cellPadding}`,
      borderPreset,
      float !== 'none' ? `rw-table-float-${float}` : null,
    ]
      .filter(Boolean)
      .join(' ');

    this.table.setAttribute('data-rw-table-theme', theme);
    this.table.setAttribute(
      'data-rw-table-zebra',
      (attrs.alternatingRows as boolean | undefined) ? 'true' : 'false'
    );
    this.table.setAttribute('data-rw-cell-padding', cellPadding);
    this.table.setAttribute('data-rw-table-float', float);

    const borderColor = (attrs.borderColor as string | undefined) ?? '#E2E7ED';

    this.table.style.setProperty('--rw-table-border-color', borderColor);

    if (borderPreset === 'table-borders-none' || borderPreset === 'table-borders-header-only') {
      this.table.style.border = `1px solid ${borderColor}`;
    } else {
      this.table.style.border = '';
    }

    const radius = (attrs.borderRadius as string | undefined) ?? '0px';
    this.table.style.borderRadius = radius;
    this.table.style.setProperty('--rw-table-radius', radius);
  }

  private get tableStart() {
    return this.getPos() + 1;
  }

  private selectEntireTable() {
    const map = TableMap.get(this.node);
    const anchor = this.tableStart + map.positionAt(0, 0, this.node);
    const head = this.tableStart + map.positionAt(map.height - 1, map.width - 1, this.node);

    const tr = this.view.state.tr.setSelection(CellSelection.create(this.view.state.doc, anchor, head));
    this.view.dispatch(tr);
    this.view.focus();
  }

  private selectColumn(colIndex: number) {
    const map = TableMap.get(this.node);
    const anchor = this.tableStart + map.positionAt(0, colIndex, this.node);
    const head = this.tableStart + map.positionAt(map.height - 1, colIndex, this.node);

    const $anchor = this.view.state.doc.resolve(anchor);
    const $head = this.view.state.doc.resolve(head);
    const tr = this.view.state.tr.setSelection(CellSelection.colSelection($anchor, $head));
    this.view.dispatch(tr);
    this.view.focus();
  }

  private selectRow(rowIndex: number) {
    const map = TableMap.get(this.node);
    const anchor = this.tableStart + map.positionAt(rowIndex, 0, this.node);
    const head = this.tableStart + map.positionAt(rowIndex, map.width - 1, this.node);

    const $anchor = this.view.state.doc.resolve(anchor);
    const $head = this.view.state.doc.resolve(head);
    const tr = this.view.state.tr.setSelection(CellSelection.rowSelection($anchor, $head));
    this.view.dispatch(tr);
    this.view.focus();
  }

  private syncGrips() {
    const map = TableMap.get(this.node);
    this.syncColumnGrips(map.width);
    this.syncRowGrips(map.height);

    requestAnimationFrame(() => {
      this.layoutColumnGrips(map.width);
      this.layoutRowGrips(map.height);
    });
  }

  private syncColumnGrips(count: number) {
    while (this.colGripContainer.childElementCount > count) {
      this.colGripContainer.lastElementChild?.remove();
    }

    while (this.colGripContainer.childElementCount < count) {
      const idx = this.colGripContainer.childElementCount;
      const grip = document.createElement('button');
      grip.type = 'button';
      grip.className = 'rw-table-col-grip';
      grip.contentEditable = 'false';
      grip.setAttribute('aria-label', `Select column ${idx + 1}`);

      grip.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectColumn(idx);
      });

      this.colGripContainer.appendChild(grip);
    }
  }

  private syncRowGrips(count: number) {
    while (this.rowGripContainer.childElementCount > count) {
      this.rowGripContainer.lastElementChild?.remove();
    }

    while (this.rowGripContainer.childElementCount < count) {
      const idx = this.rowGripContainer.childElementCount;
      const grip = document.createElement('button');
      grip.type = 'button';
      grip.className = 'rw-table-row-grip';
      grip.contentEditable = 'false';
      grip.setAttribute('aria-label', `Select row ${idx + 1}`);

      grip.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectRow(idx);
      });

      this.rowGripContainer.appendChild(grip);
    }
  }

  private layoutColumnGrips(count: number) {
    const colEls = Array.from(this.table.querySelectorAll('col')) as HTMLTableColElement[];

    const widths = colEls.length === count ? colEls.map((col) => col.getBoundingClientRect().width) : [];
    const hasMeasuredWidths = widths.some((w) => w > 0);

    const grips = Array.from(this.colGripContainer.children) as HTMLElement[];
    this.colGripContainer.style.display = 'flex';

    if (!hasMeasuredWidths) {
      grips.forEach((grip) => {
        grip.style.width = `${100 / Math.max(count, 1)}%`;
      });
      return;
    }

    grips.forEach((grip, index) => {
      grip.style.width = `${widths[index]}px`;
    });
  }

  private layoutRowGrips(count: number) {
    const rows = Array.from(this.table.querySelectorAll('tr')) as HTMLTableRowElement[];

    const heights = rows.length === count ? rows.map((row) => row.getBoundingClientRect().height) : [];
    const hasMeasuredHeights = heights.some((h) => h > 0);

    const grips = Array.from(this.rowGripContainer.children) as HTMLElement[];

    if (!hasMeasuredHeights) {
      grips.forEach((grip) => {
        grip.style.height = `${100 / Math.max(count, 1)}%`;
      });
      return;
    }

    grips.forEach((grip, index) => {
      grip.style.height = `${heights[index]}px`;
    });
  }
}

export function createAdvancedTableNodeView({ cellMinWidth }: { cellMinWidth: number }) {
  return ({
    node,
    view,
    getPos,
  }: {
    node: ProseMirrorNode;
    view: EditorView;
    getPos: GetPos;
  }) => new AdvancedTableView(node, cellMinWidth, view, getPos);
}
