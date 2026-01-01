import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { NodeView, EditorView } from '@tiptap/pm/view';
import { CellSelection, TableMap, TableView } from '@tiptap/pm/tables';

type GetPos = () => number;

const MIN_ROW_HEIGHT_PX = 24;
const MIN_COL_WIDTH_PX = 40;

export class AdvancedTableView extends TableView implements NodeView {
  private view: EditorView;
  private getPos: GetPos;
  private colGripContainer: HTMLDivElement;
  private rowGripContainer: HTMLDivElement;
  private cornerGrip: HTMLButtonElement;
  private rowResizeContainer: HTMLDivElement;
  private leftColResizeHandle: HTMLDivElement;

  constructor(node: ProseMirrorNode, cellMinWidth: number, view: EditorView, getPos: GetPos) {
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

    this.rowResizeContainer = document.createElement('div');
    this.rowResizeContainer.className = 'rw-table-row-resize-handles';
    this.rowResizeContainer.contentEditable = 'false';

    this.leftColResizeHandle = document.createElement('div');
    this.leftColResizeHandle.className = 'rw-table-col-resize-handle-left';
    this.leftColResizeHandle.contentEditable = 'false';
    this.leftColResizeHandle.setAttribute('aria-label', 'Resize first column');

    this.leftColResizeHandle.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.startColumnResize({ event, colIndex: 0, fromLeftEdge: true });
    });

    this.cornerGrip = document.createElement('button');
    this.cornerGrip.type = 'button';
    this.cornerGrip.className = 'rw-table-corner-grip';
    this.cornerGrip.contentEditable = 'false';
    this.cornerGrip.setAttribute('aria-label', 'Select table');

    this.cornerGrip.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.selectEntireTable();
    });

    this.dom.appendChild(this.colGripContainer);
    this.dom.appendChild(this.rowGripContainer);
    this.dom.appendChild(this.rowResizeContainer);
    this.dom.appendChild(this.leftColResizeHandle);
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
    this.rowResizeContainer.remove();
    this.leftColResizeHandle.remove();
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

  private get tablePos() {
    return this.getPos();
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
    this.syncRowResizeHandles(map.height);

    requestAnimationFrame(() => {
      this.layoutColumnGrips(map.width);
      this.layoutRowGrips(map.height);
      this.layoutRowResizeHandles(map.height);
      this.layoutLeftColResizeHandle(map.height);
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

      grip.addEventListener('mousedown', (event) => {
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

      grip.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectRow(idx);
      });

      this.rowGripContainer.appendChild(grip);
    }
  }

  private syncRowResizeHandles(rowCount: number) {
    while (this.rowResizeContainer.childElementCount > rowCount) {
      this.rowResizeContainer.lastElementChild?.remove();
    }

    while (this.rowResizeContainer.childElementCount < rowCount) {
      const idx = this.rowResizeContainer.childElementCount;
      const handle = document.createElement('div');
      handle.className = 'rw-table-row-resize-handle';
      handle.contentEditable = 'false';
      handle.setAttribute('role', 'separator');
      handle.setAttribute('aria-orientation', 'horizontal');

      handle.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.startRowResize({ event, rowIndex: idx });
      });

      this.rowResizeContainer.appendChild(handle);
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

  private layoutRowResizeHandles(rowCount: number) {
    const rows = Array.from(this.table.querySelectorAll('tr')) as HTMLTableRowElement[];
    const handles = Array.from(this.rowResizeContainer.children) as HTMLElement[];

    if (rows.length !== rowCount) return;

    let offset = 0;
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const height = rows[rowIndex].getBoundingClientRect().height;
      offset += height;
      const handle = handles[rowIndex];
      handle.style.top = `${offset}px`;
    }
  }

  private layoutLeftColResizeHandle(rowCount: number) {
    const rows = Array.from(this.table.querySelectorAll('tr')) as HTMLTableRowElement[];
    if (rows.length !== rowCount) return;

    const totalHeight = rows.reduce((sum, row) => sum + row.getBoundingClientRect().height, 0);
    this.leftColResizeHandle.style.height = `${Math.max(totalHeight, 0)}px`;
  }

  private startRowResize({ event, rowIndex }: { event: MouseEvent; rowIndex: number }) {
    const rows = Array.from(this.table.querySelectorAll('tr')) as HTMLTableRowElement[];
    const row = rows[rowIndex];
    if (!row) return;

    const startY = event.clientY;
    const startHeight = row.getBoundingClientRect().height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const nextHeight = Math.max(MIN_ROW_HEIGHT_PX, Math.round(startHeight + delta));
      row.style.height = `${nextHeight}px`;
      this.layoutRowResizeHandles(rows.length);
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      const delta = upEvent.clientY - startY;
      const nextHeight = Math.max(MIN_ROW_HEIGHT_PX, Math.round(startHeight + delta));

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      this.commitRowHeight(rowIndex, nextHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  private commitRowHeight(rowIndex: number, heightPx: number) {
    const tableNode = this.view.state.doc.nodeAt(this.tablePos);
    if (!tableNode) return;

    let rowPos = this.tableStart;
    for (let i = 0; i < rowIndex; i += 1) {
      rowPos += tableNode.child(i).nodeSize;
    }

    const rowNode = tableNode.child(rowIndex);

    const tr = this.view.state.tr.setNodeMarkup(rowPos, undefined, {
      ...rowNode.attrs,
      rowHeight: `${heightPx}px`,
    });

    if (tr.docChanged) {
      this.view.dispatch(tr);
      this.view.focus();
    }
  }

  private startColumnResize({
    event,
    colIndex,
    fromLeftEdge,
  }: {
    event: MouseEvent;
    colIndex: number;
    fromLeftEdge: boolean;
  }) {
    const colEls = Array.from(this.table.querySelectorAll('col')) as HTMLTableColElement[];
    const colEl = colEls[colIndex];

    const startX = event.clientX;
    const startWidth = colEl?.getBoundingClientRect().width ?? 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.max(
        MIN_COL_WIDTH_PX,
        Math.round(fromLeftEdge ? startWidth - delta : startWidth + delta)
      );

      if (colEl) {
        colEl.style.width = `${nextWidth}px`;
      }
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      const delta = upEvent.clientX - startX;
      const nextWidth = Math.max(
        MIN_COL_WIDTH_PX,
        Math.round(fromLeftEdge ? startWidth - delta : startWidth + delta)
      );

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      this.commitColumnWidth(colIndex, nextWidth);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  private commitColumnWidth(colIndex: number, widthPx: number) {
    const tableNode = this.view.state.doc.nodeAt(this.tablePos);
    if (!tableNode) return;

    const map = TableMap.get(tableNode);
    const start = this.tableStart;

    const tr = this.view.state.tr;

    for (let row = 0; row < map.height; row += 1) {
      const mapIndex = row * map.width + colIndex;
      if (row && map.map[mapIndex] === map.map[mapIndex - map.width]) continue;

      const pos = map.map[mapIndex];
      const cellNode = tableNode.nodeAt(pos);
      if (!cellNode) continue;

      const attrs = cellNode.attrs as Record<string, unknown>;
      const colspan = (attrs.colspan as number | undefined) ?? 1;
      const existing = attrs.colwidth as number[] | null | undefined;
      const colwidth = existing ? existing.slice() : Array.from({ length: colspan }).map(() => 0);

      const index = colspan === 1 ? 0 : colIndex - map.colCount(pos);
      if (index < 0 || index >= colwidth.length) continue;

      colwidth[index] = widthPx;

      tr.setNodeMarkup(start + pos, undefined, {
        ...attrs,
        colwidth,
      });
    }

    if (tr.docChanged) {
      this.view.dispatch(tr);
      this.view.focus();
    }
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
