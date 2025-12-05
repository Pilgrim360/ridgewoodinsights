Project Overview
This repository contains the source code for the Ridgewood Insights company website, an accounting and financial insights firm. The design aesthetic should be professional, trustworthy, and clean. The code structure must prioritize maintainability, simplicity, and component reusability.
Company: Ridgewood Insights (Accounting Firm)
Framework: Next.js 14+ with App Router
Language: TypeScript
Styling: Tailwind CSS
Structure: /src directory

Core Principles
Keep it simple — This is a high-performance marketing + client portal site for an accounting firm, not a fintech SaaS.
Favor reusability — Components must be reusable across pages and sections.
No over-engineering — Avoid excessive abstractions, custom hooks for everything, or complex state libraries.
Performance first — All images are optimized (`next/image`), fonts are self-hosted or via `next/font`, and pages use appropriate loading strategies.

Project Structure
src/
├── app/                    # App Router
│   ├── (marketing)/        # Public marketing pages (grouped route)
│   │   ├── page.tsx        # → /
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   └── contact/page.tsx
│   ├── (portal)/           # Future client portal (opt-in route group)
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── globals.css         # Tailwind base + global styles
│   └── favicon.ico
│
├── components/             # Reusable UI components
│   ├── ui/                 # Primitive + shared components (Button, Card, Input, etc.)
│   ├── layout/             # Header, Footer, Navbar, MobileMenu
│   ├── sections/           # Large reusable page sections (Hero, ServicesGrid, Testimonials, CTA, etc.)
│   └── forms/              # ContactForm, NewsletterForm (with validation)
│
├── lib/                    # Utilities & helpers
│   ├── utils.ts            # cn() from clsx + tailwind-merge, formatting helpers
│   └── validations.ts      # Zod schemas (if needed later)
│
├── public/                 # Static assets
│   ├── images/
│   └── icons/
│
├── types/                  # Global TypeScript types
│   └── index.d.ts
│
└── constants/              # Site-wide constants (nav links, metadata, etc.)
└── index.ts

Conventions
File Naming

Components: PascalCase.tsx (e.g., ContactForm.tsx)
Utilities: camelCase.ts (e.g., formatCurrency.ts)
Types: camelCase.ts or PascalCase.ts (e.g., types.ts or Service.ts)

Scripts
JSON"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
  }

  Tailwind Usage
- Prefer utility classes over custom CSS
- Use the `cn()` helper from `lib/utils.ts` for conditional classes
- No inline styles except in rare cases (e.g., dynamic gradients)

TypeScript Usage
Define interfaces for all component props
Use type for unions and intersections, interface for object shapes
Avoid any; use unknown if type is truly unknown

Common Patterns

Reusable UI Components
Store in src/components/ui/:
Button, Card, Input, Badge, Modal, etc.
Keep them generic and configurable

Section Components
Store in src/components/sections/:
Hero, Services, TeamSection, ContactSection, etc.
These compose UI components into page sections

Adding a New Page
Create src/app/[route]/page.tsx
Add metadata export
Build page using existing components
Update navigation if needed

Creating a Reusable Component
Add to src/components/ui/ or src/components/sections/
Define clear TypeScript interface
Use Tailwind for styling
Keep it simple and focused

Adding a Utility Function
Create in src/lib/[name].ts
Export named function with clear types
Add JSDoc comment if logic is complex


Resources
Next.js Docs
Tailwind CSS Docs
TypeScript Docs