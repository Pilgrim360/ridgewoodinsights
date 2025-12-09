Phase 1: Database & Dependencies
Objective: Prepare the system to store and display raw HTML.

1. Update Supabase Schema
Go to your Supabase Dashboard (SQL Editor).
Run: ALTER TABLE posts RENAME COLUMN content_markdown TO content_html;
(Or drop the column and add a new text column named content_html).

2. Install Packages
Run the following in your terminal:
code
Bash
npm install react-quill isomorphic-dompurify
npm install -D @tailwindcss/typography
react-quill: The editor.
isomorphic-dompurify: Cleans HTML to prevent security hacks (XSS).
@tailwindcss/typography: Makes the HTML look beautiful on the public site.

3. Configure Tailwind
Open tailwind.config.ts.
Add the plugin:
code
Ts
plugins: [
  require('@tailwindcss/typography'),
  // ... other plugins
],
Phase 2: Building the Editor Component
Objective: Create the UI component that administrators will type into.

4. Create the Component File
Create src/components/admin/PostEditor/RichTextEditor.tsx.

5. Handle Next.js SSR (Critical Step)
React-Quill breaks if rendered on the server. You must import it dynamically.
Copy this structure:
code
Tsx
'use client'
import dynamic from 'next/dynamic'
// Import CSS so it looks like an editor
import 'react-quill/dist/quill.snow.css' 

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

// ... Component definition follows

6. Build the Custom Image Handler (Crucial)
Why? By default, Quill converts images to Base64 text (bad for DB). We want to upload to Supabase.
Define a modules object inside your component using useMemo.
Create an imageHandler function that:
Creates a hidden file input.
Triggers a click.
On change, uploads file to Supabase blog-images bucket via a reusable helper (create src/lib/supabase/uploadImage.ts).
Gets the public URL.
Inserts the image into the editor at the cursor position.

Best practice: Keep the image handler logic in a separate utility file (src/lib/admin/imageHandler.ts) to keep the component clean and reusable.

7. Configure Toolbar (Optional but Recommended)
By default, Quill shows many buttons. For accounting blog content, customize the toolbar to include only essential formatting:
Recommended: bold, italic, underline, heading (h2, h3), list, link, blockquote, code.
Omit: code-block, formula, video (unless needed).
Configure via the modules prop in ReactQuill with a toolbar array.

8. Style the Editor Container
Wrap <ReactQuill /> in a div to control height and colors.
Add .ql-editor { min-height: 300px; } to your global CSS or use Tailwind arbitrary values to ensure the writing area isn't tiny.
Phase 3: Integration into the Admin Page
Objective: Connect the editor to your "Create Post" form.

9. Update the Page Logic
In src/app/(admin)/posts/new/page.tsx:
Create state: const [content, setContent] = useState('')
Import your <RichTextEditor /> component.
Pass the state: <RichTextEditor value={content} onChange={setContent} />

10. Implement Auto-Save with Debouncing
Add a useEffect hook that saves the post after 2-3 seconds of inactivity.
Use debounce or a ref-based timer to avoid hammering Supabase during rapid typing.
Show a status indicator: "Saving...", "Saved", or "Unsaved changes".
Example: const debouncedSave = useMemo(() => debounce((html) => savePost(html), 3000), [])

11. Update the Save Function
When the "Save" button is clicked, send content to Supabase.
Ensure your insert or update query maps to the content_html column.
Handle errors gracefully (show toast or error message if save fails).
Phase 4: Displaying Posts (Public Site)
Objective: Render the HTML safely and beautifully to visitors.

12. Sanitize the Data
In your blog post page (src/app/blog/[slug]/page.tsx):
code
Tsx
import DOMPurify from 'isomorphic-dompurify';
// ... inside component
const cleanHTML = DOMPurify.sanitize(post.content_html);

⚠️ CRITICAL: DOMPurify.sanitize() is MANDATORY before rendering. Never skip this step.
Without sanitization, malicious HTML (e.g., <script> tags) could execute on your site (XSS vulnerability).

13. Render & Style
Inject the HTML into a div.
Important: Add the prose class to the parent div.
code
Tsx
<div 
  className="prose prose-lg max-w-none text-gray-800 prose-headings:text-blue-900 prose-img:rounded-xl"
  dangerouslySetInnerHTML={{ __html: cleanHTML }} 
/>

Note: dangerouslySetInnerHTML is only safe here because cleanHTML has been sanitized by DOMPurify.
Phase 5: Verification & Testing

14. Test Image Uploads
Click the image button in the toolbar.
Select a large photo (e.g., 2MB).
Verify it appears in the editor.
Check Supabase Storage: Confirm the file actually exists in your bucket.
Check Database: Confirm the saved HTML contains <img src="https://your-supabase-url..."> and NOT data:image/jpeg;base64....

15. Test Copy/Paste
Open a Microsoft Word doc or a Google Doc.
Copy a paragraph with bold text and a list.
Paste it into your editor.
Verify formatting is preserved.

16. Test Auto-Save
Type quickly for 5 seconds, then pause.
Verify the "Saving..." indicator appears after 3 seconds.
Check the database to confirm changes are saved.
Test that rapid saves don't cause Supabase rate-limit errors.

17. Test Public Display
Publish a post with various formatting (headings, bold, lists, images).
View it on the public blog page (src/app/blog/[slug]/page.tsx).
Verify HTML is rendered correctly with proper styling from the prose class.
Ensure all images display properly.
Verify no malicious content executes (test DOMPurify is working).

18. Mobile Responsiveness
Open your Admin panel on a phone (or DevTools mobile view).
Ensure the toolbar buttons wrap correctly and don't push the layout off-screen.
Verify the editor is usable on mobile (or consider a mobile-friendly toolbar).

Pro-Tip: The "Quill CSS" Issue
If your editor looks like a plain text box with no toolbar icons, you likely forgot this line in your component or layout.tsx:
import 'react-quill/dist/quill.snow.css';

Pro-Tip: Removing "Pasted" Junk
Sometimes pasting from Word adds weird styles. If you want to strip styles and only keep bold/italic:
Add the clipboard module configuration to your ReactQuill component settings (refer to React-Quill docs for matchVisual).