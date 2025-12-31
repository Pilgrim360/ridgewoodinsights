export interface TableTheme {
  name: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  borderWidth: number;
  borderColor: string;
  cornerRadius: number;
  backgroundColor: string;
  headerBackgroundColor: string;
  headerTextColor: string;
  rowHoverColor: string;
  cellPadding: number;
}

export const TABLE_THEMES: Record<string, TableTheme> = {
  default: {
    name: 'Default',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E2E7ED', // surface color from palette
    cornerRadius: 0,
    backgroundColor: 'transparent',
    headerBackgroundColor: '#F8F9FB', // background color from palette
    headerTextColor: '#2C3E50', // secondary color
    rowHoverColor: '#F8F9FB',
    cellPadding: 8,
  },
  minimal: {
    name: 'Minimal',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#F8F9FB',
    cornerRadius: 0,
    backgroundColor: 'transparent',
    headerBackgroundColor: 'transparent',
    headerTextColor: '#2C3E50',
    rowHoverColor: '#F8F9FB',
    cellPadding: 12,
  },
  striped: {
    name: 'Striped',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E2E7ED',
    cornerRadius: 0,
    backgroundColor: 'transparent',
    headerBackgroundColor: '#006466', // primary color
    headerTextColor: '#FFFFFF',
    rowHoverColor: '#F8F9FB',
    cellPadding: 8,
  },
  bordered: {
    name: 'Bordered',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#2C3E50', // secondary color
    cornerRadius: 4,
    backgroundColor: 'transparent',
    headerBackgroundColor: '#2C3E50',
    headerTextColor: '#FFFFFF',
    rowHoverColor: 'rgba(44, 62, 80, 0.05)',
    cellPadding: 10,
  },
  dark: {
    name: 'Dark',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#415161',
    cornerRadius: 0,
    backgroundColor: '#2C3E50',
    headerBackgroundColor: '#1a252f',
    headerTextColor: '#FFFFFF',
    rowHoverColor: '#34495e',
    cellPadding: 8,
  },
};
