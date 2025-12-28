# TipTap Tables - Quick Reference Guide

## Table Bubble Menu Layout

When you click inside a table, the bubble menu appears with these controls:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [+▼]  [-▼]  │  [HR]  [HC]  [H]  │  [⚟]  [⚏]  │  [🎨]  [⬅]  [⬆]  [➡]  [↔]  │  [🔧]  │
└─────────────────────────────────────────────────────────────────────┘
   Insert  Delete   Headers         Merge/Split   Styling              Advanced
```

### Control Groups

#### 1. Insert [+▼]
- Column Before
- Column After  
- Row Before
- Row After

#### 2. Delete [-▼]
- Delete Column
- Delete Row
- Delete Table

#### 3. Headers
- **HR** = Toggle Header Row (first row becomes headers)
- **HC** = Toggle Header Column (first column becomes headers)
- **H** = Toggle Header Cell (current cell becomes header)
- Buttons highlight when active

#### 4. Merge/Split
- **⚟** = Merge selected cells (disabled if can't merge)
- **⚏** = Split merged cell (disabled if can't split)

#### 5. Styling
- **🎨** = Cell background color picker
  - 12 preset colors
  - Custom hex input
  - Clear button
- **⬅** = Align left
- **⬆** = Align center
- **➡** = Align right
- **↔** = Justify

#### 6. Advanced
- **🔧** = Fix table structure

## Quick Actions

### Create a Table
1. Click Table icon in main toolbar
2. Choose size (default 3x3)
3. Click to insert

### Add Header Row
1. Click any cell in first row
2. Click **HR** button
3. First row becomes bold with distinct styling

### Add Column
1. Click cell where you want to add
2. Click **+** dropdown
3. Choose "Column Before" or "Column After"

### Delete Row
1. Click any cell in row to delete
2. Click **-** dropdown
3. Choose "Delete Row"

### Color a Cell
1. Click cell to color
2. Click **🎨** (palette) icon
3. Choose preset or enter custom hex
4. Click outside to apply

### Merge Cells
1. Click and drag to select cells
2. Click **⚟** (merge) icon
3. Cells combine into one

### Resize Column
1. Hover over right edge of any cell
2. Wait for resize handle (4px blue line)
3. Click and drag to adjust width

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Next cell | `Tab` |
| Previous cell | `Shift + Tab` |
| Close dropdown | `Esc` |
| Undo | `Ctrl/Cmd + Z` |
| Redo | `Ctrl/Cmd + Y` |

## Visual Indicators

### Header Cells
- **Background**: Light blue-gray tint
- **Text**: Bold
- **Borders**: Thicker (2px) dark borders

### Selected Cells
- **Highlight**: Teal-blue background (10% opacity)
- **Header Selected**: Darker teal (20% opacity)

### Resize Handles
- **Location**: Right edge of cells
- **Appearance**: 4px vertical line
- **Hover**: Teal highlight
- **Cursor**: Changes to resize cursor

## Color Presets

The color picker includes these 12 presets:

| Color | Name | Hex |
|-------|------|-----|
| ⬜ | White | #FFFFFF |
| ⬜ | Background | #F8F9FB |
| ⬜ | Surface | #E2E7ED |
| 🔵 | Light Blue | #DBEAFE |
| 🟢 | Light Green | #DCFCE7 |
| 🟡 | Light Yellow | #FEF3C7 |
| 🩷 | Light Pink | #FCE7F3 |
| 🟣 | Light Purple | #F3E8FF |
| 🔷 | Primary (Teal) | #006466 |
| 🔹 | Secondary (Blue) | #2C3E50 |
| ⬛ | Text Gray | #415161 |
| 🔴 | Red | #B42318 |

## Common Workflows

### Simple Data Table
1. Insert 3x3 table
2. Click first row, press **HR** (header row)
3. Type column headers
4. Fill in data rows

### Styled Table
1. Insert table
2. Toggle header row (**HR**)
3. Select cells to highlight
4. Apply background colors with 🎨
5. Adjust alignment as needed

### Complex Layout
1. Insert large table
2. Select multiple cells
3. Click merge (⚟)
4. Create custom layouts
5. Use split (⚏) to undo merges

### Financial Table
1. Create table with headers
2. Align numbers right (➡)
3. Align labels left (⬅)
4. Add light green background to positive values
5. Add light red background to negative values

## Troubleshooting

### Table looks broken
→ Click **🔧** (Fix Tables) button

### Can't merge cells
→ Ensure cells are contiguous (next to each other)
→ Check that **⚟** button is enabled

### Column won't resize
→ Make sure table has `resizable: true` configured
→ Try hovering exactly on the right edge

### Header styling not showing
→ Verify **HR**, **HC**, or **H** button is highlighted
→ Check if custom styles are overriding defaults

### Color not applying
→ Ensure you clicked a color in the picker
→ Verify cell is selected when applying color

## Tips & Tricks

1. **Tab Navigation**: Use Tab key to quickly navigate through cells
2. **Bulk Operations**: Select multiple cells before merging or coloring
3. **Consistent Headers**: Use HR (header row) for top headers, HC (header column) for left headers
4. **Alignment**: Align numbers right for better readability in data tables
5. **Color Coding**: Use light backgrounds to highlight important data without overwhelming
6. **Resize Smartly**: Resize columns to fit content width for cleaner tables
7. **Fix Early**: If table structure looks odd, use Fix Tables immediately
8. **Save Often**: All operations auto-save, but manual save (Ctrl/Cmd+S) is instant

## Accessibility

- All buttons have tooltips (hover to see)
- Use Tab key for keyboard navigation
- Dropdowns close with Escape key
- Screen readers announce all controls
- Color contrast meets WCAG AA standards

## Mobile Usage

- Bubble menu is touch-friendly
- Horizontal scroll on narrow screens
- Color picker works with touch
- All buttons have adequate touch targets (44px+)
- Pinch to zoom supported

## Best Practices

✅ **Do**:
- Use header row for column labels
- Align numbers right, text left
- Keep table width manageable
- Use subtle background colors
- Test on mobile

❌ **Don't**:
- Over-merge cells (makes structure complex)
- Use too many colors (distracting)
- Create extremely wide tables (scroll issues)
- Forget to add headers (accessibility)
- Resize columns too narrow (readability)

## Examples

### Basic Data Table
```
┌──────────┬──────────┬──────────┐
│ Name     │ Age      │ City     │  ← Header Row (HR)
├──────────┼──────────┼──────────┤
│ John     │ 32       │ NYC      │
│ Jane     │ 28       │ LA       │
│ Bob      │ 45       │ Chicago  │
└──────────┴──────────┴──────────┘
```

### Financial Report Table
```
┌──────────┬──────────┬──────────┬──────────┐
│ Quarter  │ Revenue  │ Expenses │ Profit   │  ← Header Row (bold)
├──────────┼──────────┼──────────┼──────────┤
│ Q1 2024  │ $150,000 │ $120,000 │ $30,000  │  ← Light green bg
│ Q2 2024  │ $180,000 │ $150,000 │ $30,000  │  ← Light green bg
│ Q3 2024  │ $165,000 │ $140,000 │ $25,000  │  ← Light green bg
│ Q4 2024  │ $200,000 │ $170,000 │ $30,000  │  ← Light green bg
└──────────┴──────────┴──────────┴──────────┘
                                      ↑ Right-aligned numbers
```

### Complex Layout Table
```
┌────────────────────┬──────────┬──────────┐
│ Company Overview   │ 2023     │ 2024     │  ← Merged cells
│ (Merged header)    │          │          │
├────────────────────┼──────────┼──────────┤
│ Total Revenue      │ $500K    │ $750K    │
│ Total Expenses     │ $400K    │ $550K    │
│ Net Profit         │ $100K    │ $200K    │  ← Light blue bg
└────────────────────┴──────────┴──────────┘
```

## Documentation Links

- **Full Documentation**: `docs/TABLE_FEATURES.md`
- **Implementation Summary**: `TABLES_IMPLEMENTATION_SUMMARY.md`
- **TipTap Table Docs**: https://tiptap.dev/api/nodes/table

## Support

If you encounter issues:
1. Try the **Fix Tables** button first
2. Check this quick reference
3. Read full documentation
4. Check browser console for errors
5. Verify table structure is valid

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Editor**: TipTap with Extended Table Support
