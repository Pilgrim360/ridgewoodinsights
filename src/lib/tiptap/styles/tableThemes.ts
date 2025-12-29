// Table Theme Definitions matching Ridgewood Design System
// Ridgewood Palette: Primary #006466, Secondary #2C3E50, Text #415161, Surface #E2E7ED, Background #F8F9FB

export type BorderStyle = 'solid' | 'dashed' | 'dotted';

export interface TableTheme {
  id: string;
  name: string;
  description: string;
  config: {
    borderColor: string;
    borderWidth: number;
    borderStyle: BorderStyle;
    headerBg: string;
    headerText: string;
    rowBg?: string;
    rowBgAlternate?: string;
    cellPadding: string;
  };
}

export const TABLE_THEMES: TableTheme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, simple styling with subtle borders',
    config: {
      borderColor: '#E2E7ED',
      borderWidth: 1,
      borderStyle: 'solid',
      headerBg: '#F8F9FB',
      headerText: '#2C3E50',
      cellPadding: '12px 16px',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Professional look with slate blue accents',
    config: {
      borderColor: '#415161',
      borderWidth: 1,
      borderStyle: 'solid',
      headerBg: '#415161',
      headerText: '#FFFFFF',
      cellPadding: '12px 16px',
    },
  },
  {
    id: 'header-blue',
    name: 'Header Blue',
    description: 'Primary brand color for headers',
    config: {
      borderColor: '#006466',
      borderWidth: 1,
      borderStyle: 'solid',
      headerBg: '#006466',
      headerText: '#FFFFFF',
      cellPadding: '12px 16px',
    },
  },
  {
    id: 'header-green',
    name: 'Header Green',
    description: 'Fresh green header accent',
    config: {
      borderColor: '#0B4F6C',
      borderWidth: 1,
      borderStyle: 'solid',
      headerBg: '#0B4F6C',
      headerText: '#FFFFFF',
      cellPadding: '12px 16px',
    },
  },
  {
    id: 'banded-rows',
    name: 'Banded Rows',
    description: 'Alternating row colors for readability',
    config: {
      borderColor: '#E2E7ED',
      borderWidth: 1,
      borderStyle: 'solid',
      headerBg: '#F8F9FB',
      headerText: '#2C3E50',
      rowBg: '#FFFFFF',
      rowBgAlternate: '#F8F9FB',
      cellPadding: '10px 14px',
    },
  },
  {
    id: 'alternating-blue',
    name: 'Alternating Blue',
    description: 'Blue tint for alternate rows',
    config: {
      borderColor: '#006466',
      borderWidth: 1,
      borderStyle: 'solid',
      headerBg: '#006466',
      headerText: '#FFFFFF',
      rowBg: '#FFFFFF',
      rowBgAlternate: '#E8F5F5',
      cellPadding: '10px 14px',
    },
  },
  {
    id: 'alternating-gray',
    name: 'Alternating Gray',
    description: 'Subtle gray alternating rows',
    config: {
      borderColor: '#415161',
      borderWidth: 1,
      borderStyle: 'solid',
      headerBg: '#415161',
      headerText: '#FFFFFF',
      rowBg: '#FFFFFF',
      rowBgAlternate: '#F8F9FB',
      cellPadding: '10px 14px',
    },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong visual impact with bold borders',
    config: {
      borderColor: '#2C3E50',
      borderWidth: 2,
      borderStyle: 'solid',
      headerBg: '#2C3E50',
      headerText: '#FFFFFF',
      cellPadding: '12px 16px',
    },
  },
  {
    id: 'dashed-modern',
    name: 'Dashed Modern',
    description: 'Contemporary look with dashed borders',
    config: {
      borderColor: '#006466',
      borderWidth: 1,
      borderStyle: 'dashed',
      headerBg: '#E8F5F5',
      headerText: '#006466',
      cellPadding: '12px 16px',
    },
  },
];

// Color Palette for styling
export const RIDGEWOOD_PALETTE = {
  primary: '#006466',
  primaryDark: '#004d4f',
  primaryLight: '#0B4F6C',
  secondary: '#2C3E50',
  text: '#415161',
  surface: '#E2E7ED',
  background: '#F8F9FB',
  white: '#FFFFFF',
  error: '#B42318',
  success: '#166534',
  warning: '#92400E',
  info: '#1E40AF',
};

export const BORDER_COLOR_PRESETS = [
  RIDGEWOOD_PALETTE.surface,
  RIDGEWOOD_PALETTE.primary,
  RIDGEWOOD_PALETTE.primaryLight,
  RIDGEWOOD_PALETTE.secondary,
  RIDGEWOOD_PALETTE.text,
  RIDGEWOOD_PALETTE.error,
  RIDGEWOOD_PALETTE.success,
  '#000000',
  '#FFFFFF',
];

export const BACKGROUND_COLOR_PRESETS = [
  'transparent',
  RIDGEWOOD_PALETTE.white,
  RIDGEWOOD_PALETTE.background,
  RIDGEWOOD_PALETTE.primary,
  '#E8F5F5',
  '#FEF3C7',
  '#DCFCE7',
  '#DBEAFE',
  '#FCE7F3',
  '#F3E8FF',
];

export const TEXT_COLOR_PRESETS = [
  RIDGEWOOD_PALETTE.text,
  RIDGEWOOD_PALETTE.secondary,
  RIDGEWOOD_PALETTE.primary,
  '#000000',
  '#FFFFFF',
  RIDGEWOOD_PALETTE.error,
  RIDGEWOOD_PALETTE.success,
];

export const BORDER_WIDTH_PRESETS = [1, 2, 3];

export const BORDER_STYLES: { label: string; value: BorderStyle }[] = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
];

// Function to get theme by ID
export function getThemeById(themeId: string): TableTheme | undefined {
  return TABLE_THEMES.find((theme) => theme.id === themeId);
}

// Function to apply theme to all cells in a table
export function applyThemeToCells(
  editor: { chain: () => { focus: () => { setCellBackground: (c: string) => { run: () => void }; setCellTextColor: (c: string) => { run: () => void }; run: () => void } } },
  theme: TableTheme
): void {
  // This is a placeholder - actual implementation will be in tableCommands.ts
  editor.chain().focus().run();
}

// Default theme
export const DEFAULT_THEME = getThemeById('minimal')!;
