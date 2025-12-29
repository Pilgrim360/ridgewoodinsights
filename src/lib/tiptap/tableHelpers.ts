// Table cell background colors following Ridgewood palette
export const TABLE_BG_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Primary Light', value: '#E8F5F5' },
  { name: 'Secondary Light', value: '#E8EAED' },
  { name: 'Surface', value: '#E2E7ED' },
  { name: 'Background', value: '#F8F9FB' },
  { name: 'Yellow Light', value: '#FEF3C7' },
  { name: 'Green Light', value: '#DCFCE7' },
  { name: 'Blue Light', value: '#DBEAFE' },
  { name: 'Pink Light', value: '#FCE7F3' },
  { name: 'Red Light', value: '#FEE2E2' },
];

// Border colors following Ridgewood palette
export const BORDER_COLORS = [
  { name: 'Default', value: '#E2E7ED' },
  { name: 'Primary', value: '#006466' },
  { name: 'Secondary', value: '#2C3E50' },
  { name: 'Text', value: '#415161' },
  { name: 'Dark', value: '#1A1A1A' },
  { name: 'Red', value: '#B42318' },
];

// Border styles
export const BORDER_STYLES = [
  { name: 'Solid', value: 'solid' },
  { name: 'Dashed', value: 'dashed' },
  { name: 'Dotted', value: 'dotted' },
  { name: 'Double', value: 'double' },
  { name: 'None', value: 'none' },
];

// Border widths
export const BORDER_WIDTHS = [
  { name: '1px', value: '1px' },
  { name: '2px', value: '2px' },
  { name: '3px', value: '3px' },
  { name: '4px', value: '4px' },
];

// Cell padding options
export const CELL_PADDING = [
  { name: 'Small', value: '4px' },
  { name: 'Medium', value: '8px' },
  { name: 'Large', value: '12px' },
  { name: 'Extra Large', value: '16px' },
];

// Table dimension presets
export const TABLE_PRESETS = [
  { rows: 2, cols: 2, label: '2×2' },
  { rows: 3, cols: 3, label: '3×3' },
  { rows: 4, cols: 4, label: '4×4' },
  { rows: 5, cols: 5, label: '5×5' },
  { rows: 2, cols: 3, label: '2×3' },
  { rows: 3, cols: 4, label: '3×4' },
  { rows: 4, cols: 5, label: '4×5' },
];

// Get default table attributes
export function getDefaultTableAttributes() {
  return {
    backgroundColor: 'transparent',
    borderColor: '#E2E7ED',
    borderStyle: 'solid',
    borderWidth: '1px',
    cellPadding: '8px',
    width: '100%',
    fixedWidth: false,
    headerRow: true,
    headerColumn: false,
    responsiveMode: 'scroll',
    caption: '',
  };
}

// Get default cell attributes
export function getDefaultCellAttributes() {
  return {
    backgroundColor: 'transparent',
    textAlign: 'left',
    verticalAlign: 'top',
    borderColor: null,
    borderStyle: null,
    borderWidth: null,
    colspan: 1,
    rowspan: 1,
    padding: null,
  };
}

// Get default header cell attributes
export function getDefaultHeaderCellAttributes() {
  return {
    ...getDefaultCellAttributes(),
    backgroundColor: '#E8EAED',
    textAlign: 'center',
    bold: true,
  };
}

// Format cell dimensions for display
export function formatDimension(value: number | null | undefined, unit: 'px' | '%' = 'px'): string {
  if (value === null || value === undefined) return 'Auto';
  return `${value}${unit}`;
}

// Validate table dimensions
export function validateTableDimensions(rows: number, cols: number): boolean {
  return rows >= 1 && rows <= 100 && cols >= 1 && cols <= 50;
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Debounce helper for resize operations
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
