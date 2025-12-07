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
Larger composable units built from primitives; establishes patterns for consistent page structures and user experience.

- **File location:** Implement section components in `src/components/sections/` and form components in `src/components/forms/`.
- **Composition pattern:** Build from primitives (Step 2) and integrate with layouts (Step 3).
- **Data flow:** Props-driven with clear interfaces; use constants from `src/constants/` for static content.

#### 4.1 Hero Section Component

**Purpose:** Above-fold introduction with primary value proposition and main CTA.

**File:** `src/components/sections/Hero.tsx`

**Component Interface:** Define comprehensive props interface including title, optional subtitle and description, primary CTA object with label and href, optional secondary CTA, image source and alt text, background variant options (default/muted/white), and alignment preference (left/center).

**Implementation Guidelines:**
- **Background:** Use `bg-background` (default), `bg-muted` (muted), or `bg-white` based on `backgroundVariant`
- **Typography:** Main title uses `text-secondary`, subtitle and description use `text-text`
- **Layout:** CSS Grid for two-column (text + image) on desktop, stacked on mobile
- **CTA Button:** Primary button uses `bg-primary` with hover state, secondary uses outline variant
- **Image:** Use `next/image` with `placeholder="blur"` for performance
- **Spacing:** Vertical padding using `section` spacing token (`py-16 md:py-24`)

**Accessibility Requirements:**
- Main heading should be `h1` for page hero sections
- Use `aria-labelledby` linking to main heading
- Ensure CTA buttons have descriptive labels
- Image requires descriptive `alt` text
- Maintain proper heading hierarchy (h1 → h2 → h3)

**Responsive Behavior:**
- **Mobile (<md):** Single column, stacked layout
- **Desktop (md+):** Two-column grid with text left, image right (or centered based on `alignment`)
- **Touch targets:** Minimum 44px height for CTA buttons

#### 4.2 Services Overview Section

**Purpose:** Brief showcase of core services with cards and hover effects.

**File:** `src/components/sections/ServicesOverview.tsx`

**Component Interface:** Define Service interface with unique identifier, title, description, optional icon component, link href, and array of features. Create ServicesOverviewProps with title, optional subtitle, services array, maximum display number, optional view-all functionality, and link to view-all page.

**Implementation Guidelines:**
- **Layout:** CSS Grid with responsive columns (1 col mobile, 2 cols tablet, 3 cols desktop)
- **Cards:** Use `Card` component from primitives with `variant="default"`
- **Card Content:** Icon (if provided) + title + description + feature list
- **Hover Effects:** Subtle scale transform and shadow elevation
- **Icons:** Use `text-primary` color, consistent sizing (24px standard)
- **Feature Lists:** Use `text-text` color with subtle bullet points

**Accessibility Requirements:**
- Section should have `aria-labelledby` linking to title
- Cards should be focusable with proper tab order
- Service links should have descriptive text
- Ensure sufficient color contrast for hover states
- For carousel layout: Use `role="region"` with appropriate `aria-label`, implement keyboard navigation with visible focus indicators, provide screen reader announcements for slide changes, and ensure navigation controls are properly labeled with descriptive text

**Data Structure:** Create a services array where each service object includes a unique identifier, descriptive title, detailed explanation of the service, link to the service page, and array of key features or offerings. For example, a tax preparation service would include individual and business return capabilities, quarterly review options, and other relevant tax-related services.

#### 4.3 About/Trust Section Component

**Purpose:** Build credibility and trust through credentials, values, and differentiators.

**File:** `src/components/sections/AboutTrust.tsx`

**Component Interface:** Define TrustSignal interface with type discriminator (credential/statistic/testimonial/certification), title, value, optional description, and optional icon component. Create AboutTrustProps with section title, optional subtitle, descriptive content, trust signals array, layout preference (grid/list), and background variant selection.

**Implementation Guidelines:**
- **Layout:** Two-column with description left, trust signals right (desktop); stacked (mobile)
- **Trust Signals:** Use `Badge` component for credentials, styled cards for statistics
- **Credentials:** Display as badges with `variant="neutral"` or `variant="info"`
- **Statistics:** Large numbers with smaller descriptive text
- **Spacing:** Consistent vertical rhythm using design tokens

**Trust Signal Types:**
- **Credential:** "CPA", "CFA", "QuickBooks ProAdvisor" (use Badge component)
- **Statistic:** "15+ Years Experience", "500+ Clients Served" (use styled numbers)
- **Testimonial:** Client quote with attribution (use Card with special styling)
- **Certification:** Professional certifications with verification badges

#### 4.4 Call-to-Action Components

**Purpose:** Drive conversions with strategic placement and compelling messaging.

**File:** `src/components/sections/CTA.tsx`

**Component Interface:** Define CTAProps with title, optional description, primary action object containing label and link, optional secondary action, variant selection (centered/split/inline layout), background variant choice, and optional urgency messaging for time-sensitive CTAs.

**Implementation Guidelines:**
- **Variant Styles:**
  - **Centered:** Single column, center-aligned (use for page-level CTAs)
  - **Split:** Two columns with actions side by side
  - **Inline:** Horizontal layout with text and actions
- **Primary Button:** Always use `variant="primary"` with `bg-primary`
- **Secondary Button:** Use `variant="outline"` with border
- **Background:** Use `bg-primary` for primary CTAs, `bg-muted` for secondary
- **Typography:** Title in `text-secondary`, description in `text-text`

#### 4.5 Testimonials Section

**Purpose:** Social proof through client testimonials and success stories.

**File:** `src/components/sections/Testimonials.tsx`

**Component Interface:** Define Testimonial interface with unique identifier, quoted testimonial text, author name, job title, optional company name, optional avatar image path, optional 1-5 star rating, and optional service reference. Create TestimonialsProps with section title, optional subtitle, testimonials array, layout selection (grid/carousel/featured), and maximum number to display.

**Implementation Guidelines:**
- **Layout Options:** Grid layout for multiple testimonials in responsive columns, carousel layout for horizontal scrolling with navigation dots, or featured layout highlighting a single prominent testimonial. Use Card component with special testimonial styling, circular avatar images with Next.js Image component, star ratings using primary color for filled stars, and proper attribution with author name in secondary color and title/company in text color.

**Accessibility Requirements:**
- Ensure testimonials are properly attributed
- Use `blockquote` and `cite` elements appropriately
- Maintain reading order for carousel navigation
- For carousel layouts: Implement keyboard navigation with left/right arrow keys, provide clear focus indicators for active slides, use proper ARIA roles and labels for carousel controls, and ensure screen reader users can navigate through all carousel content

#### 4.6 Insights/News Section

**Purpose:** Latest articles, financial tips, and thought leadership content.

**File:** `src/components/sections/Insights.tsx`

**Component Interface:** Define Insight interface with unique identifier, article title, preview excerpt text, publication date, optional estimated read time, category tag, author name, optional featured image, and link to full article. Create InsightsProps with section title, optional subtitle, insights array, maximum display number, optional load more functionality, and layout selection including carousel option (grid/list/carousel).

**Implementation Guidelines:**
- **Layout Options:** Grid layout for multiple insights in responsive columns, list layout for detailed vertical presentation, or carousel layout for horizontal scrolling with navigation controls
- **Cards:** Use `Card` component with image, title, excerpt, and meta information
- **Meta Information:** Date, read time, category (use `text-text` color)
- **Images:** Use `next/image` with consistent aspect ratios
- **Categories:** Use `Badge` component with `variant="neutral"`
- **Date Formatting:** Use consistent date format from utils
- **Carousel Functionality:** Implement horizontal scrolling with navigation dots or arrows, touch/swipe support for mobile devices, keyboard navigation with left/right arrows, and proper focus management for accessibility. Consider implementing lazy loading for carousel items to improve performance, automatic advance with user control to disable, smooth transitions between slides, and responsive behavior that shows different numbers of items per slide based on screen size (1 item on mobile, 2-3 on tablet, 3-4 on desktop).

**Data Structure:** Create insights array where each insight includes a unique identifier, compelling article title, preview excerpt that encourages reading, publication date, relevant category (such as Tax Planning, Financial Strategy, etc.), author attribution with credentials, and link to the full article. For example, a tax planning article would cover recent changes, their implications, and practical advice.

#### 4.7 Contact Form Component

**Purpose:** Lead capture and client inquiry collection with validation.

**File:** `src/components/forms/ContactForm.tsx`

**Component Interface:** Define ContactFormProps with optional title and subtitle, submit handler function, customizable submit button label, form variant selection (default/compact/detailed), and customizable field configuration. Create ContactFormData interface with required first and last name, email address, optional phone number, optional company name, optional service interest selection, required message, optional newsletter signup, and required terms agreement checkbox. Include ContactFormField interface for configurable form fields with field type (text/email/tel/textarea/select/checkbox), label, required flag, placeholder text, and select options.

**Implementation Guidelines:**
- **Validation:** Use React Hook Form with Zod schema validation
- **Form Fields:** Use primitive components (Input, Textarea, Select, Checkbox)
- **Error Handling:** Display errors with proper ARIA attributes
- **Loading State:** Disable form and show loading spinner during submission
- **Success State:** Show success message with option to submit another
- **Layout:** Single column on mobile, two columns for name fields on desktop

**Validation Schema:** Implement comprehensive form validation using Zod library. Define required fields with appropriate validation rules: first and last name must be non-empty strings, email must be valid email format, phone and company are optional fields, message must be at least 10 characters, newsletter defaults to false, and terms agreement must be explicitly checked. Include custom error messages for each validation rule to guide users.

**Accessibility Requirements:**
- All inputs must have associated labels
- Use `aria-invalid` and `aria-describedby` for errors
- Ensure keyboard navigation works for all form elements
- Screen reader announcements for validation errors
- Proper form labels and descriptions

#### 4.8 Image Handling and Optimization

**Implementation Guidelines:**
- **Next/Image:** Always use `next/image` for performance
- **Placeholder Strategy:** Use `placeholder="blur"` for content images
- **Responsive Images:** Define multiple sizes for different breakpoints
- **Loading States:** Implement skeleton loading for better UX
- **Error Handling:** Fallback images for failed loads

**Implementation Pattern:** Use Next.js Image component with proper optimization settings. Include image source and descriptive alt text, fill container for responsive sizing, object-cover for proper image cropping, blur placeholder for improved loading experience, and responsive size attributes that define different image dimensions for various breakpoints (100vw for mobile, 50vw for tablet, 33vw for desktop).

#### 4.9 Component Composition Patterns

**Composition Strategy:**
- **Atomic Design:** Compose sections from atoms (primitives) and molecules
- **Prop-Driven:** All content should be configurable via props
- **Consistent Styling:** Use design tokens and palette colors consistently
- **Reusable Logic:** Extract common patterns to custom hooks

**Composition Pattern:** Create section components by composing primitive elements from Step 2. For example, a Hero section combines a heading component for the title, text component for the subtitle, description text, primary action button, and image element. Pass all content as props to make components fully configurable and reusable across different pages with varied content.

#### 4.10 Performance and Loading Patterns

**Performance Guidelines:**
- **Server Components:** Use React Server Components where possible
- **Lazy Loading:** Implement lazy loading for below-fold sections
- **Image Optimization:** Optimize all images with Next.js Image component
- **Code Splitting:** Use dynamic imports for large components
- **Loading States:** Implement proper loading skeletons

**Loading State Implementation:** Create skeleton loading components that provide visual feedback while content loads. Use animated pulse effects with placeholder rectangles that match the dimensions of the content being loaded. For example, a section skeleton might include a large placeholder for headings, medium placeholders for content paragraphs, and smaller placeholders for supporting elements, all using surface color with subtle animation.

#### 4.11 Error Handling and Fallbacks

**Error Boundary Implementation:**
- Wrap dynamic content in error boundaries
- Provide fallback UI for failed components
- Log errors appropriately for debugging
- Maintain graceful degradation

**Error Handling Pattern:** Implement error boundary components that gracefully handle component failures. Display user-friendly error messages with appropriate styling (such as light red background with red text) instead of breaking the entire page. Include retry mechanisms or contact information for persistent issues, and log technical details for debugging purposes.

#### 4.12 Testing Strategy

**Component Testing:**
- **Unit Tests:** Test component rendering with different props
- **Accessibility Tests:** Use jest-axe for accessibility testing
- **Visual Tests:** Screenshot testing for responsive behavior
- **Integration Tests:** Test form submission and validation

**Testing Structure:** Implement comprehensive test suites for section components. Include unit tests that verify component rendering with different prop combinations, accessibility tests using testing libraries that check for WCAG compliance, and integration tests that verify form submission and validation logic. Test both success and failure scenarios, ensuring components handle edge cases gracefully.

**Time estimate:** 2–3 hours per section component, 1–2 hours for ContactForm.

**Best practice:** 
- Build sections iteratively (one complete section at a time)
- Test each section thoroughly before moving to the next
- Use consistent prop patterns and naming conventions
- Implement proper TypeScript interfaces for all props
- Follow accessibility guidelines from Step 2
- Use design tokens and palette colors consistently
- Optimize for performance with Next.js features
- Write comprehensive tests for complex interactions

### Step 5: Assemble Pages (Full Compositions - In Order of Importance)

### Why later?
Pages are thin containers that orchestrate section components; build once foundational components are ready. Follow the logical user journey: Home → Services → About → Contact, prioritizing pages that drive conversions and provide essential information.

#### Page Assembly Philosophy
Pages should serve as composition containers that orchestrate section components without containing complex business logic. Each page acts as a conductor, passing data and configuration to reusable sections while maintaining clean separation of concerns. This approach ensures consistency across the site while allowing individual pages to have unique content and layout requirements.

### Step 5.1: Home Page Assembly (src/app/(marketing)/page.tsx)

#### Purpose and Strategy
The home page serves as the primary conversion funnel, introducing visitors to Ridgewood Insights' value proposition and guiding them toward key actions. This page should establish immediate credibility while presenting a clear path to engagement.

#### Page Structure and Composition
- **Section Stack Order**: Hero section for immediate impact, followed by Services overview for quick understanding, About/Trust section for credibility building, Call-to-Action for conversion, and Insights section for thought leadership
- **Background Strategy**: Use background color from the Ridgewood Palette as the main page canvas, with individual sections maintaining consistent vertical spacing
- **Content Density**: Balance promotional content with valuable information to avoid overwhelming visitors while maintaining engagement

#### Implementation Approach
Import section components and arrange them in a logical flow that matches user decision-making patterns. Pass content as props from constants or data files rather than hardcoding within the page component. Ensure each section receives appropriate configuration for its display variant and responsive behavior.

#### SEO and Performance Considerations
Implement comprehensive metadata including page title, description, and relevant keywords. Use structured data markup for organization information and key services. Optimize for Core Web Vitals by ensuring above-the-fold content loads quickly and implementing proper image optimization throughout sections.

#### Accessibility and User Experience
Maintain proper heading hierarchy throughout the page composition. Ensure keyboard navigation flows logically between sections. Implement skip links and proper ARIA labeling for complex interactive elements within sections.

### Step 5.2: Services Page Assembly (src/app/(marketing)/services/page.tsx)

#### Purpose and Strategy
The services page provides detailed information about Ridgewood Insights' offerings, helping potential clients understand specific service capabilities and encouraging consultation requests.

#### Page Structure and Composition
- **Service Presentation**: Use card-based layouts with white backgrounds to create clear visual separation between services. Maintain consistent typography with headings in secondary color and body text in readable slate gray
- **Content Organization**: Group related services logically, potentially using subheadings or category divisions for complex service portfolios
- **Interactive Elements**: Include service-specific CTAs that connect to contact forms or consultation booking systems

#### Implementation Approach
Compose service detail sections that provide comprehensive information without overwhelming users. Use progressive disclosure patterns where appropriate, allowing users to explore services at their own pace. Integrate contact elements strategically throughout the page rather than concentrating them at the bottom.

#### Content Strategy and Trust Building
Present services with clear explanations of processes, benefits, and typical client outcomes. Include relevant credentials and certifications for each service area. Use case studies or success stories to demonstrate real-world application of services.

### Step 5.3: About Page Assembly (src/app/(marketing)/about/page.tsx)

#### Purpose and Strategy
The about page builds personal connection and trust by showcasing the team, company history, values, and professional credentials that differentiate Ridgewood Insights.

#### Page Structure and Composition
- **Team Presentation**: Use card-based layouts for team members with professional styling. Ensure consistent visual treatment while allowing individual personality to show through
- **Company Story**: Organize historical information chronologically with clear visual breaks and compelling narrative flow
- **Values and Mission**: Present core values with supporting explanations and real-world applications

#### Implementation Approach
Create dedicated sections for different aspects of the company story. Use timeline components for company history and achievement sections for individual team member highlights. Maintain consistent use of the Ridgewood Palette throughout, with secondary color for headings and body text in readable slate gray.

#### Trust and Credibility Enhancement
Highlight professional certifications prominently using badge components. Include client testimonials or success metrics where appropriate. Ensure all claims are substantiated with verifiable information or professional credentials.

### Step 5.4: Contact Page Assembly (src/app/(marketing)/contact/page.tsx)

#### Purpose and Strategy
The contact page serves as the primary conversion point, making it easy for potential clients to reach out while providing necessary company information and multiple communication channels.

#### Page Structure and Composition
- **Form Integration**: Position the contact form prominently using the palette colors for form elements. Ensure form fields follow accessibility best practices with proper labeling and error handling
- **Contact Information**: Present company details in a clearly organized layout with consistent typography and visual hierarchy
- **Location and Accessibility**: If applicable, include location information and accessibility details for in-person meetings

#### Implementation Approach
Integrate the comprehensive contact form component while ensuring proper data handling and validation. Include alternative contact methods and emergency contact procedures where relevant. Use the full range of form components to create a professional, accessible experience.

#### User Experience and Conversion Optimization
Streamline the contact process by minimizing required fields while capturing essential information. Provide clear expectations for response times and next steps. Include trust signals such as security certifications or privacy policy links.

### Step 5.5: Future Portal Integration (Optional)

#### Strategic Considerations
If a client portal is planned, stub the route group structure while maintaining focus on the primary marketing site. Ensure any portal infrastructure doesn't interfere with the main site's performance or user experience.

#### Implementation Approach
Create placeholder routes that can be developed later without disrupting the core marketing site functionality. Plan for potential integration points where portal services might complement marketing content.

### Step 5.6: SEO and Metadata Implementation

#### Page-Level SEO Strategy
Implement comprehensive metadata for each page using generateMetadata, including unique titles, descriptions, and relevant keywords. Ensure metadata reflects the specific content and value proposition of each page while maintaining consistency with overall site branding.

#### Technical SEO Considerations
Create proper URL structures that reflect the logical site hierarchy. Implement breadcrumb navigation where appropriate. Ensure all pages have unique content to avoid duplicate content issues and maintain proper indexing.

#### Performance and Monitoring
Monitor page load times and user engagement metrics. Implement proper error boundaries and loading states for each page. Use analytics to understand user behavior patterns and optimize page compositions accordingly.

#### Best Practice Guidelines
- **Page Composition**: Keep page components thin by delegating complex logic to section components
- **Loading Strategy**: Implement Suspense boundaries for progressive loading of page sections
- **Error Handling**: Use error boundaries at the page level to prevent site-wide failures
- **Content Management**: Source page content from constants or data files rather than hardcoding
- **Responsive Design**: Ensure all pages maintain functionality and visual appeal across device types
- **Quality Assurance**: Test each page thoroughly before proceeding to polish phase

#### Development Workflow
Follow the vertical slice methodology: assemble basic structures for all key pages before returning to polish individual pages. This approach ensures consistent user experience across the site while allowing for iterative improvement based on real usage patterns.

**Time estimate:** 45-90 minutes per page, with additional time for SEO implementation and testing.

**Quality Standard:** Each page should achieve 70% completion before moving to the final polish phase, with full functionality, proper SEO implementation, and responsive design across all device types.

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