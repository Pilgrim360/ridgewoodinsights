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