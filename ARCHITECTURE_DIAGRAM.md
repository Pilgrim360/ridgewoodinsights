# Toolbar Repositioning - Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Web Application                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            CmsLayout (Flex Container)                  │   │
│  │                                                         │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │  CmsSidebar (Fixed Left)                      │    │   │
│  │  │  z-20                                         │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  │                                                         │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │  Main Container (Flex Column)                 │    │   │
│  │  │                                               │    │   │
│  │  │  ┌──────────────────────────────────────┐    │    │   │
│  │  │  │ CmsHeader (Sticky, Mobile only)     │    │    │   │
│  │  │  │ z-30                                │    │    │   │
│  │  │  └──────────────────────────────────────┘    │    │   │
│  │  │                                               │    │   │
│  │  │  ┌──────────────────────────────────────┐    │    │   │
│  │  │  │ CmsSubHeader (Optional)              │    │    │   │
│  │  │  │ z-auto                               │    │    │   │
│  │  │  └──────────────────────────────────────┘    │    │   │
│  │  │                                               │    │   │
│  │  │  ┌──────────────────────────────────────┐    │    │   │
│  │  │  │ CmsToolbarSlot ← NEW                │    │    │   │
│  │  │  │ ┌────────────────────────────────┐ │    │    │   │
│  │  │  │ │  EditorToolbar Component       │ │    │    │   │
│  │  │  │ │  (from EditorToolbarGlobal)    │ │    │    │   │
│  │  │  │ └────────────────────────────────┘ │    │    │   │
│  │  │  │ z-40 (sticky position)             │    │    │   │
│  │  │  └──────────────────────────────────────┘    │    │   │
│  │  │                                               │    │   │
│  │  │  ┌──────────────────────────────────────┐    │    │   │
│  │  │  │ Main Content (overflow-y-auto)      │    │    │   │
│  │  │  │                                     │    │    │   │
│  │  │  │ ┌─────────────────────────────┐    │    │    │   │
│  │  │  │ │ Editor Page                 │    │    │    │   │
│  │  │  │ │                             │    │    │    │   │
│  │  │  │ │ ┌───────────────────────┐  │    │    │    │   │
│  │  │  │ │ │ EditorToolbarGlobal  │  │    │    │    │   │
│  │  │  │ │ │ (Context Injector)   │  │    │    │    │   │
│  │  │  │ │ │ Injects toolbar into │  │    │    │    │   │
│  │  │  │ │ │ context on mount     │  │    │    │    │   │
│  │  │  │ │ └───────────────────────┘  │    │    │    │   │
│  │  │  │ │                             │    │    │    │   │
│  │  │  │ │ ┌───────────────────────┐  │    │    │    │   │
│  │  │  │ │ │ TipTapEditor          │  │    │    │    │   │
│  │  │  │ │ │ - EditorContent       │  │    │    │    │   │
│  │  │  │ │ │ - Title Input         │  │    │    │    │   │
│  │  │  │ │ │ - Editor Instance     │  │    │    │    │   │
│  │  │  │ │ └───────────────────────┘  │    │    │    │   │
│  │  │  │ └─────────────────────────────┘    │    │    │   │
│  │  │  └──────────────────────────────────────┘    │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
DashboardLayout (Main App Layout)
│
├── CmsHeaderSlotsProvider (Context Provider)
│   │
│   └── div#flex.h-screen
│       │
│       ├── CmsSidebar (Fixed Width)
│       │   └── Navigation items
│       │
│       └── div#main-container.flex-1.flex.flex-col
│           │
│           ├── CmsHeader
│           │   ├── Logo
│           │   ├── Navigation
│           │   └── Search
│           │
│           ├── CmsSubHeader
│           │   └── Conditional sub-navigation
│           │
│           ├── CmsToolbarSlot ← NEW
│           │   └── (Renders toolbar from context)
│           │
│           └── main.flex-1.overflow-y-auto
│               │
│               └── {children} (Page content)
│                   │
│                   └── EditorPage
│                       │
│                       ├── EditorToolbarGlobal ← NEW
│                       │   └── Injects toolbar into context
│                       │
│                       └── TipTapEditor
│                           ├── EditorImageBubbleMenu
│                           ├── EditorContent
│                           ├── Title Input
│                           └── Word Count
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                           │
│              (Navigate to Editor Page)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EditorPage Renders                             │
│  (src/app/cms/posts/new/page.tsx)                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│               TipTapEditor Component Mounts                     │
│  • useEditor() creates Tiptap instance                         │
│  • Editor ready                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│          EditorToolbarGlobal Component Mounts                   │
│  • Receives editor instance as prop                            │
│  • useEffect hook triggers                                      │
│  • Extracts setToolbar from context                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            setToolbar() Called with JSX Element                │
│  • Creates EditorToolbar JSX wrapped in div                    │
│  • Passes to CmsHeaderSlotsContext                             │
│  • Updates context state                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│        CmsToolbarSlot Component Re-renders                      │
│  (Listening to context changes)                                │
│  • Reads slots.toolbar from context                            │
│  • Renders toolbar JSX in sticky container                     │
│  • Applies z-40 positioning                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            Toolbar Visible on Screen                            │
│  • Positioned below header                                      │
│  • Sticky to top during scroll                                 │
│  • User can interact with toolbar buttons                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         User Leaves Editor / Page Unmounts                      │
│  • EditorToolbarGlobal.useEffect cleanup runs                  │
│  • setToolbar(null) called                                      │
│  • Context updated                                              │
│  • CmsToolbarSlot renders null                                 │
│  • Toolbar removed from DOM                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Z-Index Stack Visualization

```
                           VIEWPORT
   ┌────────────────────────────────────────┐
   │                                        │
   │  z-50  ┌──────────────────────────┐   │  Modal/Popovers
   │        │                          │   │  (if needed)
   │        └──────────────────────────┘   │
   │                                        │
   │  z-40  ┌──────────────────────────┐   │  CmsToolbarSlot
   │        │   EditorToolbar          │   │  ← Fixed Toolbar
   │        │  (Sticky to top)         │   │
   │        └──────────────────────────┘   │
   │                                        │
   │  z-30  ┌──────────────────────────┐   │  CmsHeader
   │        │  Header                  │   │  (Mobile only)
   │        └──────────────────────────┘   │
   │                                        │
   │  z-20  ┌──────────────────────────┐   │  CmsSidebar
   │        │  Sidebar (Fixed)         │   │
   │        │                          │   │
   │        │                          │   │
   │        │                          │   │
   │        └──────────────────────────┘   │
   │                                        │
   │  z-0   ┌──────────────────────────┐   │  Main Content
   │        │  Editor Content          │   │  (Scrollable)
   │        │  (Scrolls under toolbar) │   │
   │        │                          │   │
   │        │                          │   │
   │        └──────────────────────────┘   │
   │                                        │
   └────────────────────────────────────────┘
```

## Context Flow Diagram

```
┌────────────────────────────────────────┐
│  CmsHeaderSlotsContext                 │
│                                        │
│  State:                                │
│  {                                     │
│    title: ReactNode | null             │
│    actions: ReactNode | null           │
│    subHeader: ReactNode | null         │
│    toolbar: ReactNode | null ← NEW     │
│  }                                     │
│                                        │
│  Methods:                              │
│  • setTitle()                          │
│  • setActions()                        │
│  • setSubHeader()                      │
│  • setToolbar() ← NEW                  │
│  • clear()                             │
└────────────────────────────────────────┘
         ▲              │
         │              │
    PROVIDES      PROVIDES
         │              │
         │              ▼
    ┌────────────────────────────────────┐
    │ EditorToolbarGlobal                │
    │ (Consumer)                         │
    │                                    │
    │ const { setToolbar } =             │
    │   useCmsHeaderSlots()              │
    │                                    │
    │ useEffect(() => {                 │
    │   setToolbar(<EditorToolbar />)   │
    │   return () => setToolbar(null)   │
    │ }, [editor, disabled, onError])   │
    └────────────────────────────────────┘
```

## File Structure

```
src/
├── app/
│   ├── cms/
│   │   └── (console)/
│   │       ├── layout.tsx (MODIFIED)
│   │       │   └── Added <CmsToolbarSlot />
│   │       │
│   │       └── posts/
│   │           └── new/
│   │               └── page.tsx
│   │
│   └── globals.css (MODIFIED)
│       └── Added .cms-toolbar-slot CSS
│
├── components/
│   └── cms/
│       └── PostEditor/
│           ├── EditorToolbarGlobal.tsx (NEW)
│           ├── EditorToolbar.tsx
│           ├── TipTapEditor.tsx (MODIFIED)
│           └── EditorContent.tsx
│
└── contexts/
    └── CmsHeaderSlotsContext.tsx (MODIFIED)
        └── Added toolbar slot support
```

## Responsive Behavior Diagram

### Desktop (md and above - 768px+)
```
┌─────────────────────────────────────────────┐
│ ┌──────────┐ ┌──────────────────────────┐  │
│ │ Sidebar  │ │  Header                  │  │
│ │ (Fixed)  │ ├──────────────────────────┤  │
│ │          │ │  Toolbar (Sticky)        │  │
│ │          │ ├──────────────────────────┤  │
│ │          │ │                          │  │
│ │          │ │  Editor Content          │  │
│ │          │ │  (Scrollable)            │  │
│ │          │ │                          │  │
│ │          │ │  (Toolbar stays visible) │  │
│ │          │ │                          │  │
│ │          │ └──────────────────────────┘  │
│ └──────────┘                                 │
└─────────────────────────────────────────────┘
```

### Tablet (sm to md - 640px to 767px)
```
┌──────────────────────────────┐
│ ┌──────┐ ┌──────────────────┐│
│ │      │ │ Header           ││
│ │ Side │ ├──────────────────┤│
│ │ bar  │ │ Toolbar (Sticky) ││
│ │      │ ├──────────────────┤│
│ │      │ │ Editor Content   ││
│ │      │ │ (Scrollable)     ││
│ │      │ │ (Toolbar visible)││
│ │      │ │                  ││
│ │      │ └──────────────────┘│
│ └──────┘                       │
└──────────────────────────────┘
```

### Mobile (xs to sm - below 640px)
```
┌──────────────────────┐
│ Header (Mobile)      │
├──────────────────────┤
│ Toolbar (Sticky)     │
│ (May wrap items)     │
├──────────────────────┤
│ Editor Content       │
│ (Scrollable)         │
│ (Toolbar visible)    │
│                      │
│                      │
│                      │
│                      │
│                      │
│                      │
│                      │
└──────────────────────┘
```

## State Transition Diagram

```
START (Page Not Loaded)
    │
    ▼
MOUNTING: EditorPage Component
    │
    ├─ TipTapEditor mounts
    ├─ Editor instance created
    │
    ▼
TOOLBAR_INJECTION: EditorToolbarGlobal mounts
    │
    ├─ useEffect triggers
    ├─ Calls setToolbar(toolbarComponent)
    │
    ▼
TOOLBAR_ACTIVE: Toolbar visible on screen
    │
    ├─ User interacts with editor
    ├─ Toolbar buttons functional
    ├─ Toolbar stays visible on scroll
    │
    ├─ Navigation triggered OR
    ├─ Page unmounts
    │
    ▼
TOOLBAR_CLEANUP: useEffect cleanup runs
    │
    ├─ Calls setToolbar(null)
    ├─ Context updated
    ├─ Toolbar removed from DOM
    │
    ▼
END: Component unmounted
```

## CSS Specificity Diagram

```
Toolbar Styling Cascade
├─ Browser Defaults
│  └─ div { display: block; }
│
├─ Tailwind Base
│  └─ Reset styles
│
├─ Component Classes
│  ├─ .sticky { position: sticky; }
│  ├─ .top-0 { top: 0; }
│  ├─ .z-40 { z-index: 40; }
│  ├─ .border-b { border-bottom: 1px solid; }
│  ├─ .bg-white { background: white; }
│  └─ .backdrop-blur-md { backdrop-filter: blur; }
│
├─ Global CSS Rules
│  └─ .cms-toolbar-slot {
│     position: sticky;
│     top: 0;
│     z-index: 40;
│     }
│
└─ Inline Styles
   └─ (None - not used)
```

---

## Key Architectural Decisions

### 1. Context-Based Injection
**Why:** Avoids prop drilling through multiple component levels  
**Alternative:** Props or Redux - rejected for complexity

### 2. Sticky Positioning
**Why:** Better performance and scrolling behavior than fixed  
**Alternative:** Fixed positioning - rejected for performance

### 3. useEffect Hook Pattern
**Why:** Clean separation of concerns, proper cleanup  
**Alternative:** useMemo/useCallback - rejected for clarity

### 4. Component-Based Toolbar
**Why:** Reuses existing EditorToolbar logic  
**Alternative:** Duplicate code - rejected for maintainability

---

Last Updated: Architecture Finalized  
Status: Ready for Implementation
