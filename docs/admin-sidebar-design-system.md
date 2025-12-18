# Admin Sidebar Design System

## Design Philosophy

The new admin sidebar follows a **modern minimalist** approach with:
- **Clarity over decoration**: Every element serves a purpose
- **Professional polish**: Subtle details that elevate the experience
- **Brand alignment**: Uses Ridgewood's color palette thoughtfully
- **Performance first**: Smooth 60fps animations

## Visual Design Tokens

### Colors

```typescript
// Active State (selected navigation item)
background: 'bg-primary/10'           // rgba(0, 100, 102, 0.1)
text: 'text-primary'                  // #006466
border: 'w-1 bg-primary rounded-r-full' // Left accent bar

// Hover State
background: 'bg-gray-100'             // #F3F4F6
text: 'text-gray-900'                 // #111827

// Default State
background: 'transparent'
text: 'text-gray-700'                 // #374151
icon: 'text-gray-500'                 // #6B7280

// Borders & Dividers
border: 'border-gray-200'             // #E5E7EB

// Surface
background: 'bg-white'                // #FFFFFF
shadow: 'shadow-2xl' (mobile only)    // Large shadow for drawer
```

### Spacing Scale

```typescript
// Container spacing
paddingHorizontal: 'px-3'             // 12px (nav items container)
paddingVertical: 'py-4'               // 16px (nav sections)

// Item spacing
itemPadding: 'px-3 py-2.5'            // 12px horizontal, 10px vertical
itemGap: 'gap-3'                      // 12px between icon and text
itemSpacing: 'space-y-1'              // 4px between nav items

// Section spacing
sectionGap: 'space-y-6'               // 24px between main nav and settings
sectionPadding: 'px-4 py-5'           // 16px/20px (brand/footer)

// Submenu indentation
submenuMargin: 'ml-3 pl-6'            // 12px + 24px indent
```

### Typography

```typescript
// Brand text
brandName: {
  size: 'text-sm',                    // 14px
  weight: 'font-semibold',            // 600
  color: 'text-gray-900',             // #111827
}

brandSubtitle: {
  size: 'text-xs',                    // 12px
  color: 'text-gray-500',             // #6B7280
}

// Navigation items
navLabel: {
  size: 'text-sm',                    // 14px
  weight: 'font-medium',              // 500
  color: 'text-gray-700' | 'text-primary', // Dynamic based on state
}

// User info
userEmail: {
  size: 'text-sm',                    // 14px
  weight: 'font-medium',              // 500
  color: 'text-gray-900',             // #111827
}

userRole: {
  size: 'text-xs',                    // 12px
  color: 'text-gray-500',             // #6B7280
}

// Badges
badge: {
  size: 'text-xs',                    // 12px
  weight: 'font-medium',              // 500
  padding: 'px-2 py-0.5',             // 8px/2px
  background: 'bg-gray-200',          // #E5E7EB
  color: 'text-gray-700',             // #374151
}
```

### Border Radius

```typescript
// Components
container: 'rounded-lg'               // 8px (nav items, buttons, cards)
logo: 'rounded-lg'                    // 8px (brand icon)
avatar: 'rounded-full'                // Circle (user avatar)
activeIndicator: 'rounded-r-full'     // Right-side rounded (left accent bar)
badge: 'rounded-full'                 // Pill shape
```

### Shadows

```typescript
// Desktop sidebar
shadow: 'none'                        // No shadow on fixed sidebar

// Mobile drawer
shadow: 'shadow-2xl'                  // Large shadow for depth

// Component elevations
focusRing: 'ring-2 ring-primary/20'   // Subtle outline on focus
```

## Component Patterns

### 1. Navigation Item States

#### Default State
```
┌─────────────────────────────┐
│  [Icon]  Label              │  ← Transparent bg, gray text
└─────────────────────────────┘
```

#### Hover State
```
┌─────────────────────────────┐
│  [Icon]  Label              │  ← Light gray bg, darker text
└─────────────────────────────┘
```

#### Active State
```
│┌────────────────────────────┐
││ [Icon]  Label              │  ← Primary tint bg, primary text, left bar
│└────────────────────────────┘
```

#### Collapsed State
```
┌─────┐
│[Icon]│  ← Tooltip on hover
└─────┘
```

### 2. Expandable Items

#### Collapsed Submenu
```
┌─────────────────────────────┐
│  [Icon]  Posts         [>]  │  ← Chevron points right
└─────────────────────────────┘
```

#### Expanded Submenu
```
┌─────────────────────────────┐
│  [Icon]  Posts         [v]  │  ← Chevron points down
│                             │
│  │  [○] All Posts          │  ← Indented with border
│  │  [+] New Post           │
│  │  [✎] Drafts             │
│  │  [○] Scheduled          │
└─────────────────────────────┘
```

### 3. Sidebar Width States

#### Expanded (Desktop)
```
┌────────────────────┐  ┌─────────────────────────────┐
│  [R] Ridgewood [<] │  │                             │
│      Admin         │  │   Main Content Area         │
│                    │  │                             │
│  [≣] Dashboard     │  │   Adjusts with smooth       │
│  [□] Posts      [v]│  │   transition (300ms)        │
│    │ [□] All       │  │                             │
│    │ [+] New       │  │                             │
│  [□] Categories    │  │                             │
│  [□] Media         │  │                             │
│  ─────────────────│  │                             │
│  [⚙] Settings      │  │                             │
│                    │  │                             │
│  ┌──────────────┐ │  │                             │
│  │ [JD] john.do…│ │  │                             │
│  └──────────────┘ │  │                             │
│  [<] Collapse [→] │  │                             │
└────────────────────┘  └─────────────────────────────┘
     16rem (256px)
```

#### Collapsed (Desktop)
```
┌──────┐  ┌─────────────────────────────────────┐
│  [R] │  │                                     │
│      │  │                                     │
│ [<]  │  │   Main Content Area                 │
│      │  │                                     │
│ [≣]  │  │   Expands to fill space             │
│ [□]  │  │   with smooth transition            │
│ [□]  │  │                                     │
│ [□]  │  │                                     │
│ ──── │  │                                     │
│ [⚙]  │  │                                     │
│      │  │                                     │
│ [JD] │  │                                     │
│      │  │                                     │
│ [>]  │  │                                     │
└──────┘  └─────────────────────────────────────┘
 5rem (80px)
```

#### Mobile Drawer
```
Full Screen Overlay

┌──[×]───────────────┐
│ Backdrop (dark)    │  ← Tap to close
│                    │
│ ┌────────────────┐ │
│ │ [R] Ridgewood X││ │  ← Slide from left
│ │      Admin     ││ │
│ │                ││ │
│ │ [≣] Dashboard  ││ │  ← Auto-close on nav
│ │ [□] Posts   [v]││ │
│ │   │ [□] All    ││ │
│ │   │ [+] New    ││ │
│ │ [□] Categories ││ │
│ │                ││ │
│ │ ┌────────────┐ ││ │
│ │ │[JD] User   │ ││ │
│ │ │[→] Logout  │ ││ │
│ │ └────────────┘ ││ │
│ └────────────────┘ │
└────────────────────┘
     18rem (288px)
```

## Animation Specifications

### Transition Durations
```typescript
// Sidebar expand/collapse
sidebarWidth: 'transition-all duration-300 ease-in-out'

// Content area margin
contentOffset: 'transition-all duration-300'

// Item hover
itemHover: 'transition-all duration-200'

// Chevron rotation
chevronRotate: 'transition-transform duration-200'

// Mobile drawer
drawerSlide: 'animate-in slide-in-from-left duration-300'
backdropFade: 'transition-opacity'
```

### Easing Functions
```typescript
// Sidebar width change
easing: 'ease-in-out'          // Smooth acceleration and deceleration

// Item interactions
easing: 'ease-out'             // Quick start, smooth end (not explicitly set, browser default)
```

### Animation Properties
```typescript
// Hardware accelerated transforms
transform: 'translateX(-100%)' → 'translateX(0)'  // Mobile drawer
transform: 'rotate(0deg)' → 'rotate(90deg)'       // Chevron

// Width transitions
width: '80px' → '256px'                           // Desktop sidebar
marginLeft: '80px' → '256px'                      // Content offset
```

## Icon Guidelines

### Size Standards
```typescript
// Parent navigation items
iconSize: 'w-5 h-5'                // 20px × 20px

// Submenu items
iconSize: 'w-4 h-4'                // 16px × 16px

// Action buttons (collapse, close)
iconSize: 'w-5 h-5'                // 20px × 20px

// Chevron indicators
iconSize: 'w-4 h-4'                // 16px × 16px
```

### Icon Colors
```typescript
// Default state
icon: 'text-gray-500'              // Subtle gray

// Hover state
icon: 'text-gray-700'              // Darker on hover

// Active state
icon: 'text-primary'               // Brand primary

// Disabled state
icon: 'text-gray-300'              // Very light gray
```

### Icon Library
All icons from **lucide-react** for consistency:
- Outline style (not filled)
- 2px stroke width
- 24px viewBox
- Tree-shakeable imports

## Responsive Breakpoints

```typescript
// Mobile
mobile: 'default (< 768px)'
- Full-width drawer overlay
- Hamburger menu trigger
- Auto-close on navigation

// Desktop
desktop: 'md: (≥ 768px)'
- Fixed sidebar visible
- Collapse/expand toggle
- Smooth width transitions
- State persists in localStorage
```

## Accessibility Standards

### Color Contrast
```typescript
// Text on white background
gray900: 16.08:1 ratio  // AAA (body text)
gray700: 8.59:1 ratio   // AA Large (nav labels)
gray500: 4.61:1 ratio   // AA (icons, secondary)

// Primary on light tint
primary: 7.8:1 ratio    // AA (active text on bg-primary/10)
```

### Focus Indicators
```typescript
focusVisible: {
  outline: 'focus:outline-none',
  ring: 'focus:ring-2',
  ringColor: 'focus:ring-primary/20',
  ringOffset: 'focus:ring-offset-2',
}

// Minimum size
minTouchTarget: '44px × 44px'      // WCAG 2.5.5 Level AAA
```

### Keyboard Navigation
```
Tab         → Focus next interactive element
Shift+Tab   → Focus previous interactive element
Enter       → Activate focused link/button
Space       → Toggle submenu expansion
Escape      → Close mobile drawer
```

## Layout Specifications

### Desktop Layout
```css
/* Sidebar */
position: fixed
left: 0
top: 0
height: 100vh
width: 80px (collapsed) | 256px (expanded)
z-index: 30

/* Content Area */
margin-left: 80px (collapsed) | 256px (expanded)
min-height: 100vh
transition: margin-left 300ms ease-in-out
```

### Mobile Layout
```css
/* Sidebar Hidden */
sidebar: display: none (on desktop breakpoint)

/* Sidebar Visible (drawer) */
position: fixed
left: 0
top: 0
height: 100vh
width: 288px
z-index: 50
transform: translateX(-100%) → translateX(0)

/* Backdrop */
position: fixed
inset: 0
background: rgba(0, 0, 0, 0.5)
z-index: 40
```

## Best Practices

### Do's ✅
- Use semantic HTML (`<nav>`, `<aside>`, `<button>`)
- Provide ARIA labels for screen readers
- Maintain visible focus indicators
- Keep animations under 300ms
- Use hardware-accelerated transforms
- Persist user preferences to localStorage
- Test with keyboard navigation
- Ensure color contrast meets WCAG AA

### Don'ts ❌
- Don't remove focus outlines without replacements
- Don't use only color to convey state (add icons/text)
- Don't animate height (use transform/opacity instead)
- Don't block scrolling on desktop
- Don't hide critical actions when collapsed
- Don't use generic link text ("Click here")
- Don't ignore mobile touch target sizes
- Don't use more than 3 levels of nesting

## Component Composition Example

```tsx
<AdminSidebar>
  <SidebarBrand>
    <Logo />
    <CollapseToggle />
  </SidebarBrand>

  <SidebarNav>
    <NavSection>
      <NavItem href="/admin">Dashboard</NavItem>
      <NavItem expandable>
        Posts
        <Submenu>
          <SubNavItem>All Posts</SubNavItem>
          <SubNavItem>New Post</SubNavItem>
        </Submenu>
      </NavItem>
    </NavSection>
    
    <Divider />
    
    <NavSection>
      <NavItem>Settings</NavItem>
    </NavSection>
  </SidebarNav>

  <SidebarUserMenu>
    <UserAvatar />
    <UserInfo />
    <LogoutButton />
  </SidebarUserMenu>
</AdminSidebar>
```

## Future Considerations

### Theming
- Support dark mode
- Customizable accent colors
- User preference storage

### Advanced Features
- Drag-to-reorder nav items
- Collapsible nav sections
- Pinned/favorite pages
- Recent pages list
- Search/command palette integration

### Performance
- Lazy load submenu content
- Virtual scrolling for long lists
- Optimize re-renders with React.memo
- Use CSS containment for animations

---

**Design System Version**: 1.0.0  
**Component Library**: Ridgewood Admin v2  
**Last Updated**: December 2024
