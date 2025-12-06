# AGENTS.md: Hierarchical Build Plan for Ridgewood Insights Website

## Project Overview

This document outlines a step-by-step, hierarchical plan for building the Ridgewood Insights company website—an accounting and financial insights firm. The site will feature professional, trustworthy, and clean design aesthetics, focusing on marketing pages (Home, Services, About, Contact) and a potential future client portal.

We use Next.js 14+ with the App Router, TypeScript, and Tailwind CSS. The approach follows a bottom-up, component-driven methodology inspired by Atomic Design principles: start with foundational setup, build reusable primitives (atoms/molecules), compose them into layouts and sections (organisms), assemble pages, and finalize with polish and deployment.

This plan consolidates best practices for reusability, maintainability, simplicity, and performance. Build mobile-first, commit often with meaningful messages, and iterate in vertical slices: get basic structures of key pages to 70% before refining the remaining 30% for consistency.

## Ridgewood Palette Strategy

The color palette consists of 5 Core Colors plus White, each assigned specific roles to ensure consistency across the website. These colors should be defined as design tokens in Tailwind CSS configuration and used consistently in components and styles to maintain brand identity, readability, and visual hierarchy.

### Primary (Brand Identity)
- **Hex:** #006466 (Teal)
- **Role:** The main character. Use this for your Logo, Primary Buttons, Active Links, and Key Icons.
- **Note:** A "Hover State" for buttons can be created by darkening this primary color by 10% in the CSS.

### Secondary (Headings & Dark Accents)
- **Hex:** #2C3E50 (Midnight Blue)
- **Role:** Strong contrast. Use this for H1-H6 Headings, Navigation Text, and Footer Backgrounds.
- **Why:** This is a deep "midnight blue" that pairs beautifully with the teal. It is softer than pure black but dark enough to be authoritative.

### Body Text (Readability)
- **Hex:** #415161 (Slate Gray)
- **Role:** Softer reading. Use this for Paragraphs, Subtitles, and Body Text.
- **Why:** Reading pure black text on white screens causes eye strain. This slate gray is perfect for long-form content.

### Surface & Borders (Structure)
- **Hex:** #E2E7ED (Light Gray)
- **Role:** Separation. Use this for Borders, Horizontal Rules (dividers), and Table Headers.
- **Why:** This provides a subtle structure without drawing attention away from the content.

### Backgrounds (Depth)
- **Hex:** #F8F9FB (Off White)
- **Role:** The canvas. Useful for Page Backgrounds or "Card" Backgrounds to separate them from pure white.

### Pure White
- **Hex:** #FFFFFF (Pure White)
- **Role:** The standard background for cards or the main content area.

## Core Principles

- **Keep it simple:** This is a high-performance marketing site, not a complex SaaS. Avoid over-engineering (e.g., no excessive abstractions or state libraries unless needed).
- **Favor reusability:** Extract components when code is repeated, exceeds 50 lines, or has clear boundaries. Always ask: "Can this be a prop on an existing component?"
- **Performance first:** Optimize images with next/image, self-host fonts via next/font, and use server components for static content.
- **Build hierarchically:** Bottom-up construction (primitives > sections > pages) with top-down planning (wireframe sketches first).
- **Mobile-first:** Start with mobile styles in Tailwind, then add breakpoints (e.g., px-4 md:px-8 lg:px-12).
- **Establish standards early:** Define consistent spacing, sizing, and design tokens in tailwind.config.ts (e.g., brand colors from the Ridgewood Palette Strategy, fonts).
- **Accounting firm specifics:** Prioritize trust signals (professional design, credentials), clear CTAs (contact/schedule), service clarity (what, who, how), and social proof (testimonials, certifications). Focus on content and conversion paths over flashy features.
- **Work in vertical slices:** Don't fully complete one page before others—build basics across pages first, then polish.
- **Content before features:** Use real/near-real content early; don't build extras (e.g., blog) until content is ready.

## Project Structure

Adopt this folder structure for maintainability:

```
src/
├── app/                    # App Router
│   ├── (marketing)/        # Public marketing pages (route group)
│   │   ├── page.tsx        # → /
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   └── contact/page.tsx
│   ├── (portal)/           # Future client portal (opt-in route group, stub as placeholder)
│   ├── layout.tsx          # Root layout (includes Navbar + Footer)
│   ├── globals.css         # Tailwind base + global styles
│   └── favicon.ico
│
├── components/             # Reusable UI components
│   ├── ui/                 # Primitives (Button, Card, Input, Badge, etc.)
│   ├── layout/             # Shared structure (Header/Navbar, Footer, MobileMenu)
│   ├── sections/           # Larger blocks (Hero, ServicesGrid, Testimonials, CTA, etc.)
│   └── forms/              # Form components (ContactForm, with validation via React Hook Form)
│
├── lib/                    # Utilities & helpers
│   ├── utils.ts            # cn() for conditional classes (clsx + tailwind-merge), formatting helpers
│   └── validations.ts      # Zod schemas (if needed for forms)
│
├── public/                 # Static assets
│   ├── images/             # Optimized images
│   └── icons/              # Favicons, logos
│
├── types/                  # Global TypeScript types
│   └── index.d.ts          # e.g., interfaces for props
│
└── constants/              # Site-wide constants
    └── index.ts            # Nav links, metadata, etc. (e.g., export const NAV_LINKS = [{ href: '/', label: 'Home' }, ...];)
```

## Conventions

- **File Naming:** Components as PascalCase.tsx (e.g., HeroSection.tsx); utilities as camelCase.ts (e.g., formatCurrency.ts); types as camelCase.ts or PascalCase.ts.
- **Tailwind Usage:** Prefer utility classes; use cn() for conditionals; no inline styles except rare cases. Apply colors from the Ridgewood Palette Strategy (e.g., bg-primary for #006466, text-secondary for #2C3E50).
- **TypeScript Usage:** Define interfaces for all props (e.g., interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary'; }); avoid any; use unknown if needed.
- **Accessibility:** Add ARIA roles and keyboard nav (e.g., via @headlessui/react).

## Scripts (in package.json)

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

## Step-by-Step Build Plan

Follow this hierarchical order: foundation first, then build up to pages and polish. Assume you've run npx create-next-app@latest with App Router, /src dir, TypeScript, and Tailwind enabled. Time estimates are approximate for a solo developer.

### Step 1: Foundation Layer (Setup & Core Infrastructure)

#### Why first?
Establishes the base to avoid rework; gets the project running quickly.

- Initialize project: Add dependencies (e.g., npm i clsx tailwind-merge @headlessui/react react-hook-form if needed for forms).
- Configure Tailwind: Extend tailwind.config.ts with the colors from the Ridgewood Palette Strategy (e.g., colors: { primary: '#006466', secondary: '#2C3E50', text: '#415161', surface: '#E2E7ED', background: '#F8F9FB', white: '#FFFFFF' }), fonts, and design tokens (e.g., spacing: { section: 'py-16 md:py-24', container: 'max-w-7xl mx-auto px-4' }). For hover states, use Tailwind's hover modifier (e.g., hover:bg-primary-dark where primary-dark is a custom shade darkened by 10%).
- Set up root layout (src/app/layout.tsx): Include HTML structure, global metadata, font imports (e.g., Inter via next/font/google), analytics scripts if any. Apply background color (e.g., bg-background).
- Create globals.css: Import Tailwind layers and add base styles/resets (e.g., smooth scrolling, body { color: text; }).
- Configure TypeScript: Enable strict mode in tsconfig.json.
- Set up environment variables: Add .env.local for site URL, form endpoints.
- Create constants: In src/constants/index.ts, define site-wide data (e.g., NAV_LINKS).

**Time estimate:** 30-60 minutes.  
**Best practice:** Keep configs minimal; test with npm run dev.

### Step 2: Design System (Reusable UI Primitives – Atoms/Molecules)

#### Why next?
These are the building blocks for every page. Getting them right early enforces consistent use of the Ridgewood Palette and typography, and reduces duplication later.

- **File location:** Implement primitives in `src/components/ui/` and shared utility helpers in `src/lib/`.

#### 2.1 Core Utilities

- **`src/lib/utils.ts`**
  - Add `cn()` helper for conditional classes, wrapping `clsx` and `tailwind-merge`. Accepts any number of class inputs and returns a merged, deduplicated class string.

#### 2.2 Typography Primitives

- **`Heading.tsx`**
  - Semantic heading wrapper using `text-secondary` for titles
  - Props: `as` (heading level 1-6, defaults to 2), extends `HTMLAttributes<HTMLHeadingElement>`
  - Render dynamic `<h1>`–`<h6>` with responsive font sizes (e.g., larger for h1/h2)

- **`Text.tsx`**
  - Body text component using `text-text` color for readability
  - Props: `as` (p, span, or div), `muted` boolean for lighter secondary text
  - Extends `HTMLAttributes<HTMLParagraphElement>`

#### 2.3 Layout Primitives

- **`Container.tsx`**
  - Centers content with horizontal padding
  - Props: `maxWidth` (lg, xl, 2xl, or full; defaults to xl)
  - Extends `HTMLAttributes<HTMLDivElement>`

- **`Section.tsx`**
  - Semantic wrapper for major page sections with consistent vertical spacing
  - Props: `id`, `bg` (default, muted, or white), `as` (section or div), `aria-labelledby`
  - Extends `HTMLAttributes<HTMLElement>`
  - Background variants map to palette tokens: default → `bg-background`, muted → with border accents, white → `bg-white`

#### 2.4 Interactive Primitives

- **`Button.tsx`**
  - Primary CTA for conversions; secondary for less prominent actions
  - Props: `variant` (primary, secondary, outline, ghost), `size` (sm, md, lg), `fullWidth`, `isLoading`
  - Extends `ButtonHTMLAttributes<HTMLButtonElement>`
  - Variant styling uses palette tokens (no raw hex): primary uses `bg-primary`, secondary uses `bg-secondary`, outline has `border-surface`, ghost is transparent
  - Handle `disabled` and `isLoading` states with appropriate ARIA attributes
  - Implement with `React.forwardRef` for focus management

- **`LinkButton.tsx`** (optional)
  - Wraps `next/link` with Button styling for navigation CTAs

- **`Badge.tsx`**
  - Small labels for credentials (e.g., "CFA", "CPA") or status indicators
  - Props: `variant` (neutral, success, info), extends `HTMLAttributes<HTMLSpanElement>`
  - Neutral uses `bg-surface text-secondary`, info uses `bg-primary/10 text-primary`

#### 2.5 Card & Surface Primitives

- **`Card.tsx`**
  - Container for services, team members, testimonials
  - Props: `variant` (default, bordered, outlined), `as` (div or article)
  - Extends `HTMLAttributes<HTMLDivElement>`
  - Base styling: white background, text color, rounded corners, optional light shadow or border

- **`Divider.tsx`**
  - Simple horizontal rule using `border-surface` color with vertical margin

#### 2.6 Form Primitives

These are **presentational only**; validation and form logic live in Step 4 (React Hook Form).

- **`Label.tsx`**
  - Extends `LabelHTMLAttributes<HTMLLabelElement>`
  - Styled with `text-secondary`, small font, medium weight

- **`Input.tsx`**
  - Props: `hasError` boolean, extends `InputHTMLAttributes<HTMLInputElement>`
  - Base styling: full width, rounded, `border-surface`, `text-text`, focus ring in primary color
  - Error state: red border with `aria-invalid`

- **`Textarea.tsx`** and **`Select.tsx`**
  - Same props pattern as Input (`hasError` boolean)
  - Use native elements for accessibility; match Input styling

- **`FormField.tsx`** (optional molecule)
  - Wraps Label, form control, and error message
  - Props: `id`, `label`, `error`, `children`, optional `hint`
  - Associates label via `htmlFor`, links error to input via `aria-describedby`

- **`Checkbox.tsx`**
  - Native checkbox with visible label, for "Subscribe" or "Agree to terms" patterns

#### 2.7 Accessibility Expectations

- Use **semantic elements**: `<button>`, `<a>`, `<input>`, `<section>`, `<article>`, `<label>`.
- For inputs:
  - Always pair with visible `Label`.
  - Use `aria-invalid`, `aria-describedby` for errors and hints.
- For `Section`:
  - Use `aria-labelledby` linking to a `Heading` for landmark navigation.
- Ensure **focus styles** are never removed; customize with Tailwind but keep them clearly visible.
- Keep placeholder text as supplementary, not as the only label.

#### 2.8 TypeScript Patterns

- For every component:
  - Define a `Props` interface extending the relevant native HTML attributes (e.g., `ButtonHTMLAttributes`, `InputHTMLAttributes`).
  - Use discriminated unions for variants (`'primary' | 'secondary' | ...`).
  - Export types (e.g., `ButtonVariant`) from the component file or `types/` if shared.
  - Use `React.forwardRef` for focusable elements (buttons, inputs, selects, textareas).

#### 2.9 Testing & Sandbox

- Add a simple `src/app/(marketing)/components-preview/page.tsx` (or similar) that:
  - Renders each primitive with different variants.
  - Lets you visually verify palette usage and responsive behavior.
- Rely on:
  - `npm run lint` + `npm run typecheck` to catch TS/JS issues.
  - Optionally, add 1–2 unit tests with React Testing Library for `Button` and `Input` (variant classes and `hasError` behavior) if you already have a test runner; otherwise defer detailed tests to Step 7.
- Remove or hide the preview route in production if desired.

**Time estimate:** 1–2 hours.

**Best practice:** Implement only the primitives you need for Steps 3–5 (buttons, cards, basic form fields, typography, section/container) and expand later if real content demands it. Ensure all components use the Tailwind color tokens from the Ridgewood Palette Strategy (`primary`, `secondary`, `text`, `surface`, `background`, `white`) rather than raw hex values.

### Step 3: Layout Components (Shared Across Pages)

#### Why now?
Frames every page; reuse primitives inside them.

- **File location:** Implement layout components in `src/components/layout/` and integrate with root layout.

#### 3.1 Core Layout Components

- **`Navbar.tsx`**
  - Main navigation with logo and menu items
  - Mobile-responsive with hamburger menu
  - Uses `text-primary` for logo, `text-secondary` for nav links
  - Active link styling with `text-primary` and border accents

- **`Footer.tsx`**
  - Site footer with company info, quick links, and social media
  - Background: `bg-secondary` with white text
  - Responsive grid layout (4-col desktop → 1-col mobile)

- **`MobileMenu.tsx`**
  - Collapsible navigation drawer for mobile devices
  - Slide-down animation with focus management
  - Keyboard navigation support (Escape to close)

#### 3.2 TypeScript Interfaces

Define the following interfaces:

- **`NavLink`**: Core navigation item with `href`, `label`, and optional `isActive` flag
- **`NavbarProps`**: Extends `HTMLAttributes<HTMLElement>` with `logo` (ReactNode), `navLinks` array, `mobileMenuOpen` state, and `onMobileMenuToggle` callback
- **`FooterProps`**: Extends `HTMLAttributes<HTMLElement>` with `companyInfo` object (name, tagline, address, phone, email), `quickLinks` array, and `socialLinks` array (href, label, icon)
- **`MobileMenuProps`**: Include `isOpen` boolean, `onClose` callback, and `navLinks` array

#### 3.3 Implementation Guidelines

- **Logo styling:** `text-primary` color with proper contrast
- **Navigation links:** `text-secondary` with hover states in `text-primary`
- **Mobile menu toggle:** Hamburger icon with `aria-expanded` and `aria-controls`
- **Footer content:** Company info, navigation links, contact details, social media
- **Responsive behavior:** Desktop horizontal nav, mobile collapsible menu

#### 3.4 Accessibility Requirements

- Use semantic `<nav>` and `<footer>` elements with proper ARIA labels
- Include a "Skip to main content" link as the first focusable element
- Ensure keyboard navigation works (Tab, Enter, Escape)
- Mobile menu: Focus management and screen reader announcements
- Color contrast: Verify white text on dark footer meets WCAG AA standards
- Interactive elements must have visible focus indicators

#### 3.5 TypeScript Patterns

- Define Props interfaces extending relevant HTML attributes
- Use discriminated unions for component variants where applicable
- Export component types for external use
- Implement with `React.forwardRef` for focusable elements

#### 3.6 Integration & Constants

- Import components in `src/app/layout.tsx`
- Use `NAV_LINKS` and `COMPANY_INFO` constants from `src/constants/index.ts`
- Pass navigation and company data as props
- Ensure consistent data structure across components

#### 3.7 Responsive Design

- **Desktop (md+):** Horizontal navigation, full footer grid
- **Mobile (<md):** Hamburger menu, stacked footer layout
- **Breakpoints:** Use Tailwind's `md:` and `sm:` prefixes consistently
- **Touch targets:** Minimum 44px for mobile interactive elements

#### 3.8 State Management

- Manage `mobileMenuOpen` state in root layout using `useState`
- Pass state and toggle callback as props to Navbar and MobileMenu
- Keep layout components stateless ("dumb") — state lives in the parent

**Time estimate:** 45-90 minutes.  
**Best practice:** Keep layouts "dumb" (props-driven, no heavy logic). Use palette colors consistently (nav: `text-secondary`/`text-primary`, footer: `bg-secondary`). Test keyboard navigation and mobile menu functionality. Ensure proper focus management for accessibility.

### Step 4: Section Components (Organisms - Reusable Page Blocks)

#### Why here?
Larger composable units built from primitives; establishes patterns.

- In src/components/sections/: Build Hero.tsx (above-fold with bg-background, headings in secondary, main CTA button in primary), ServicesOverview.tsx (brief showcase with Cards in white on background), AboutTrust.tsx (why choose us, text in text color), CTA.tsx (contact/consultation button in primary), Testimonials.tsx, Inights/Latestnews.tsx, etc.
- In src/components/forms/: Build ContactForm.tsx (with React Hook Form, validation; inputs in text color with borders in surface).
- Handle images: Use next/image with placeholders.
- Compose with primitives (e.g., Hero includes heading, text, Button).

**Best practice:** Prop-driven for reusability (e.g., Hero props: title, subtitle, imageSrc). Use grids/flex for layouts. Apply palette roles strictly (e.g., borders in surface, backgrounds in off-white).

### Step 5: Assemble Pages (Full Compositions - In Order of Importance)

#### Why later?
Pages are thin containers; build once components are ready. Follow user journey: Home → Services → About → Contact.

- Start with Home (src/app/(marketing)/page.tsx): Stack sections (Hero > Services > About/Trust > CTA > Insights), using background as page bg.
- Services (/services): Detail offerings (use Cards with white bg, text in text color).
- About (/about): Team, history, values (headings in secondary).
- Contact (/contact): Form, info, map (form elements in palette colors).
- Stub portal if needed.
- Add metadata per page for SEO (use generateMetadata).
 
**Best practice:** Keep pages thin—no inline logic; use Suspense for loading. Get to 70% across pages before polishing.

### Step 6: Polish & Optimization (Cross-Cutting Refinements)

#### Why throughout, but finalize here?
Refine globally after structure is in place.

- Add responsive refinements, loading states, error boundaries.
- Optimize: Compress images, self-host fonts, enable Next.js optimizations.
- Add animations/transitions sparingly (e.g., Tailwind or Framer Motion on primary elements).
- Implement SEO: Proper metadata, alt text.
- Accessibility: Run Lighthouse audits; ensure color contrast meets standards (e.g., text on white).

**Best practice:** Test on mobile/desktop; avoid custom CSS—stick to Tailwind. Verify palette usage for consistency and readability.

### Step 7: Testing, Additional Features, and Deployment (Wrap-Up)

#### Why last?
Ensure end-to-end functionality; add extras only as needed.

- Test: Run npm run lint && npm run typecheck; manual QA for forms (e.g., submit to Formspree). Check color application across devices.
- Add features: Blog, case studies, resources (slot in without disrupting core; maintain palette).
- Optimize performance: Analyze with next build.
- Deploy: GitHub + Vercel for auto-deploys; add analytics (Google or Vercel).

**Best practice:** Write minimal tests (e.g., for forms); iterate based on real content.

## Quick Start Checklist

- Project setup + Tailwind config with Ridgewood Palette Strategy colors
- Root layout with Header & Footer (using secondary for nav)
- Design system: Button (primary/secondary variants), Card (white with surface borders), Container components
- Section components: Hero (primary CTA), Services, CTA
- Home page assembly
- Content pages: Services, About, Contact with form
- Mobile responsive testing
- SEO metadata for all pages
- Final polish, testing, & deployment

## Resources

- Next.js Docs
- Tailwind CSS Docs
- TypeScript Docs