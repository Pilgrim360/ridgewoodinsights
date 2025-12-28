# TipTap Table Features Documentation

## Overview

The TipTap post editor now includes a comprehensive, fully-featured table implementation that matches the capabilities of professional editors like Google Docs, MS Word, and Notion.

## Features

### 1. Enhanced Table Bubble Menu

When you click inside a table, a comprehensive bubble menu appears with organized controls:

#### Insert Operations (Dropdown)
- **Insert Column Before** - Add a new column to the left of the current column
- **Insert Column After** - Add a new column to the right of the current column
- **Insert Row Before** - Add a new row above the current row
- **Insert Row After** - Add a new row below the current row

#### Delete Operations (Dropdown)
- **Delete Column** - Remove the current column
- **Delete Row** - Remove the current row
- **Delete Table** - Remove the entire table

#### Header Controls
- **Toggle Header Row (HR)** - Convert the first row to header cells with distinct styling
- **Toggle Header Column (HC)** - Convert the first column to header cells
- **Toggle Header Cell (H)** - Convert the current cell to a header cell
- Visual indicators show when headers are active (button highlights)

#### Merge & Split Operations
- **Merge Cells** - Combine selected cells into one (disabled if not applicable)
- **Split Cell** - Divide a merged cell back into separate cells (disabled if not applicable)

#### Cell Styling
- **Background Color Picker** - 
  - 12 preset colors including Ridgewood brand colors
  - Custom color input support
  - Visual preview of current color
  - Clear button to remove background color
  
- **Text Alignment Controls** -
  - Align Left
  - Align Center
  - Align Right
  - Justify
  - Active alignment is highlighted

#### Advanced Operations
- **Fix Tables** - Repair corrupted table structures

### 2. Visual Styling

#### Header Cells
- **Distinct background color** - Light secondary color (#2C3E50 at 5% opacity)
- **Bold text weight** - Headers are automatically bold
- **Enhanced borders** - 2px borders with secondary color (#2C3E50)
- Applied when using Toggle Header Row/Column/Cell

#### Cell Backgrounds
- Support for custom background colors via the color picker
- Colors persist across editor updates
- Properly handles both `<th>` and `<td>` elements

#### Selected Cells
- Primary color highlight (10% opacity) for selected regular cells
- Enhanced highlight (20% opacity) for selected header cells
- Clear visual feedback during selection

#### Table Structure
- Clean gridline styling with surface color borders
- Consistent padding and spacing
- Minimum cell width of 60px
- Responsive horizontal scrolling on mobile

### 3. Column Resizing

#### Visual Feedback
- Resize handles appear on column edges (4px wide)
- Handles highlight on hover with primary color
- Cursor changes to `col-resize` during resize operations
- Built-in TipTap resizable support enabled

#### How to Resize
1. Hover over the right edge of any cell
2. When the resize handle appears, click and drag
3. Column width adjusts in real-time
4. Release to set the new width
5. Width persists across editor updates

### 4. Keyboard Navigation

#### Tab Navigation
- **Tab** - Move to next cell (right, then down to next row)
- **Shift+Tab** - Move to previous cell (left, then up to previous row)
- Automatically handles table boundaries

#### Standard Shortcuts
- **Ctrl/Cmd+Z** - Undo table operations
- **Ctrl/Cmd+Y** - Redo table operations
- **Delete/Backspace** - Clear cell content

### 5. Integration Features

#### Autosave
- All table operations trigger the autosave mechanism
- Background color changes are saved
- Structure changes (add/delete rows/columns) are saved
- Content edits within cells are saved with debouncing

#### Character Count
- Table content is included in the post character count
- Counts text within all table cells
- Respects character limit configuration

#### Content Editing
- Smooth inline editing within cells
- No page jumps during operations
- Proper focus management after operations
- Supports all text formatting within cells (bold, italic, links, etc.)

## Usage Guide

### Creating a Table

1. Click the **Table** icon in the main toolbar
2. Choose table dimensions (default: 3x3)
3. Table is inserted at cursor position
4. Click inside to access the bubble menu

### Formatting Headers

**To create a header row:**
1. Click in any cell of the first row
2. Click the **HR** (Header Row) button in the bubble menu
3. All cells in the first row become headers

**To create a header column:**
1. Click in any cell of the first column
2. Click the **HC** (Header Column) button
3. All cells in the first column become headers

**To create individual header cells:**
1. Click in the desired cell
2. Click the **H** (Header Cell) button
3. Only that cell becomes a header

### Adding Colors

1. Click in the cell you want to color
2. Click the **Palette** icon in the bubble menu
3. Choose from:
   - Preset colors (12 options)
   - Custom color (enter hex code)
4. Click **Clear** to remove background color

### Merging Cells

1. Select multiple cells (click and drag)
2. Click the **Merge** icon in the bubble menu
3. Selected cells combine into one
4. To split back, click **Split** icon

### Inserting Rows/Columns

1. Click in a cell near where you want to insert
2. Click the **+** (Insert) dropdown in the bubble menu
3. Choose the appropriate option:
   - Column Before/After
   - Row Before/After

### Deleting Rows/Columns

1. Click in the row/column you want to delete
2. Click the **-** (Delete) dropdown in the bubble menu
3. Choose:
   - Delete Column
   - Delete Row
   - Delete Table (removes entire table)

## Technical Details

### Extended Table Cell Attributes

The table cell and header extensions now support:

```typescript
{
  backgroundColor: string | null  // Hex color code or null
  // ... all standard TipTap table cell attributes
}
```

### Color Picker Component

Reusable component for selecting colors:
- Located: `src/components/admin/PostEditor/ColorPicker.tsx`
- Props: `value`, `presets`, `onChange`, `disabled`, `allowCustom`
- Used for cell background colors (can be reused for other features)

### Toolbar Dropdown Component

Reusable dropdown for grouped toolbar actions:
- Located: `src/components/admin/PostEditor/ToolbarDropdown.tsx`
- Props: `title`, `icon`, `items`, `disabled`
- Used for Insert and Delete operations

### CSS Classes

Custom styling in `src/app/globals.css`:

```css
/* Header cells */
.ProseMirror th { ... }

/* Selected cells */
.ProseMirror .selectedCell { ... }

/* Column resize handles */
.ProseMirror .column-resize-handle { ... }
```

### Files Modified/Created

**Created:**
- `src/lib/tiptap/extensions/TableCellExtended.ts`
- `src/lib/tiptap/extensions/TableHeaderExtended.ts`
- `src/components/admin/PostEditor/ColorPicker.tsx`
- `src/components/admin/PostEditor/ToolbarDropdown.tsx`

**Modified:**
- `src/lib/tiptap/editorExtensions.ts` - Use extended table cells
- `src/components/admin/PostEditor/EditorTableBubbleMenu.tsx` - Complete rebuild
- `src/app/globals.css` - Enhanced table styling

**Unchanged (but integrated):**
- `src/components/admin/PostEditor/TipTapEditor.tsx` - Uses EditorTableBubbleMenu
- `src/components/admin/PostEditor/ToolbarButton.tsx` - Used by all controls

## Design System Integration

### Ridgewood Color Palette

The table features use the Ridgewood design system:

- **Primary (#006466)** - Active buttons, selected cells, resize handles
- **Secondary (#2C3E50)** - Header text, button text, labels
- **Surface (#E2E7ED)** - Cell borders, dividers
- **Background (#F8F9FB)** - Available as cell background preset
- **White (#FFFFFF)** - Default cell background, toolbar background

### Preset Colors

The color picker includes these presets:
- White, Background, Surface (Ridgewood neutrals)
- Light Blue, Green, Yellow, Pink, Purple (pastels for highlighting)
- Primary, Secondary, Text, Red (Ridgewood brand and accent colors)

## Accessibility

### Keyboard Support
- Full keyboard navigation with Tab/Shift+Tab
- Escape key closes dropdown menus
- Focus management after operations
- ARIA labels on all buttons

### Screen Readers
- Proper ARIA attributes on buttons
- `aria-label` for icon-only buttons
- `aria-expanded` and `aria-haspopup` for dropdowns
- Semantic HTML table structure

### Visual Indicators
- Distinct header styling for clarity
- Clear selected cell highlighting
- Visible focus indicators on buttons
- Color contrast meets WCAG AA standards

## Performance

### Optimizations
- Debounced autosave for content changes
- Efficient color picker dropdown (closes on outside click)
- No unnecessary re-renders
- Smooth resize operations

### Bundle Size
- Minimal additional dependencies
- Reuses existing TipTap extensions
- Shared components (ColorPicker, ToolbarDropdown) for efficiency

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch-friendly controls

## Known Limitations

1. **Column Resizing on Mobile** - Touch-based column resizing may be less precise than mouse-based
2. **Complex Merges** - Very complex merge patterns may require using "Fix Tables" button
3. **Background Colors in Print** - Background colors may not print depending on browser settings

## Future Enhancements

Potential future improvements:
- Table templates (preformatted styles)
- Border styling controls (thickness, style, color)
- Cell padding controls
- Table-wide background/border color
- Import/export table data as CSV
- Right-click context menu
- Drag-to-select multiple cells
- Table caption support

## Support

For issues or questions about table features:
1. Check this documentation
2. Verify browser compatibility
3. Try the "Fix Tables" button for structural issues
4. Check console for error messages
5. Review the TipTap table documentation: https://tiptap.dev/api/nodes/table

## Version History

### v1.0 (Current)
- Initial comprehensive table implementation
- Extended table cell attributes (backgroundColor)
- Enhanced bubble menu with organized controls
- Color picker component
- Toolbar dropdown component
- Professional visual styling
- Column resizing support
- Full keyboard navigation
- Integration with autosave and character count
