# Ridgewood Insights Admin CMS User Guide

## Getting Started

### Login URL
Access the admin portal at: `/admin`

### Credentials Management
- Use your registered email and password to log in
- Contact your administrator if you need to reset your password
- Only users with admin privileges (`is_admin = true`) can access the admin portal

### Dashboard Overview
The dashboard provides a quick overview of your content:
- **Stats**: Total posts, published/draft/scheduled counts, and page views
- **Activity Feed**: Recent post activity (published, drafted, updated)
- **Quick Actions**: Fast access to common tasks like creating new posts

## Creating Content

### New Post Workflow
1. Click "Create New" button on the Posts page or use the Quick Actions on the dashboard
2. Fill in the post details:
   - **Title**: Clear, descriptive title for your post
   - **Slug**: URL-friendly version of your title (auto-generated)
   - **Content**: Use the rich text editor for formatting
   - **Category**: Select an appropriate category or create a new one
   - **Excerpt**: Brief summary (200 characters max)
   - **Featured Image**: Upload an eye-catching image
   - **Status**: Choose Draft, Published, or Scheduled

### Image Upload Guidelines
- **Supported Formats**: JPG, PNG, GIF, WEBP, SVG
- **Maximum Size**: 5MB per file
- **Recommended Dimensions**: 1200x630px for featured images
- **Alt Text**: Always include descriptive alt text for accessibility

### Category Management
1. Navigate to Categories page
2. Click "Add Category" to create new categories
3. Edit or delete existing categories as needed
4. Categories help organize your content and improve navigation

### Publishing vs. Drafting
- **Draft**: Save work in progress, not visible to public
- **Published**: Immediately visible on the website
- **Scheduled**: Set a future date/time for automatic publishing

## Advanced Features

### Scheduled Posts
1. In the post editor, select "Scheduled" status
2. Choose a publication date and time using the datetime picker
3. The post will automatically publish at the scheduled time
4. Scheduled posts appear in the posts list with a "Scheduled" badge

### Bulk Operations
1. On the Posts page, use checkboxes to select multiple posts
2. Use the bulk actions toolbar to:
   - **Delete Selected**: Remove multiple posts at once
   - **Publish Selected**: Publish multiple drafts simultaneously
   - **Clear Selection**: Deselect all posts

### Media Library Usage
1. Access the Media Library at `/admin/media`
2. Upload files using drag-and-drop or the upload button
3. View all media in a grid layout with thumbnails
4. Search and filter media by name
5. Delete unwanted media files
6. Media files are organized by user and can be used across posts

### Settings Configuration
1. Navigate to the Settings page
2. Configure site-wide settings:
   - **Site Title**: Your website name
   - **Site Tagline**: Brief description of your site
   - **Contact Email**: Primary contact for inquiries
3. Save changes to apply settings immediately

## Content Management Best Practices

### Writing Effective Posts
- Use clear, descriptive titles
- Break content into readable paragraphs
- Use headings (H2, H3) to organize content
- Include relevant images and media
- Add internal links to related content
- Use categories and tags appropriately

### SEO Optimization
- Include target keywords in titles and content
- Write compelling meta descriptions (excerpts)
- Use descriptive alt text for images
- Create URL-friendly slugs
- Link to related content within your site

### Content Workflow
1. **Draft**: Create and save initial content
2. **Review**: Check for accuracy, grammar, and formatting
3. **Schedule/Publish**: Set publication timing
4. **Promote**: Share on social media and newsletters
5. **Monitor**: Track performance and engagement

## Troubleshooting

### Common Issues
- **Login Problems**: Verify credentials, check caps lock, reset password if needed
- **Upload Failures**: Check file size/format, ensure stable internet connection
- **Saving Errors**: Refresh page, check for network issues, try again
- **Permission Errors**: Contact administrator to verify your access level

### Error Messages
- **RLS Violation**: You don't have permission for this action
- **Network Error**: Check your internet connection
- **Validation Error**: Fix the highlighted fields
- **Not Found**: The requested item doesn't exist

### Getting Help
- Contact your site administrator
- Refer to this user guide
- Check the admin interface for error details

## Keyboard Shortcuts
- **Ctrl+S / Cmd+S**: Save post (manual save)
- **Tab**: Navigate between form fields
- **Escape**: Close modals and dropdowns

## Security Best Practices
- Always log out when using shared computers
- Use strong, unique passwords
- Never share your login credentials
- Report suspicious activity immediately
- Keep your browser and operating system updated

## Mobile Usage
The admin interface is fully responsive:
- Use pinch-to-zoom for detailed views
- Tap and hold for context menus
- Swipe gestures for navigation where available
- Mobile-optimized forms and controls

## Accessibility Features
- Keyboard navigation support throughout
- Screen reader compatible
- High contrast color schemes
- Focus indicators for interactive elements
- ARIA labels for better accessibility

## Performance Tips
- Optimize images before uploading
- Use appropriate image dimensions
- Limit use of large media files
- Break long posts into multiple parts
- Use excerpts for preview content

## Revision History
- View post revision history in the post editor
- Restore previous versions if needed
- Track changes over time
- Compare different revisions

## User Roles and Permissions
- **Admin**: Full access to all features
- **Editor**: Can create/edit content but not manage users
- **Author**: Can manage own posts only
- **Contributor**: Can draft posts but not publish

Note: Current implementation supports admin users only. Additional roles can be added in future updates.