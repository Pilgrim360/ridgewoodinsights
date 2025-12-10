# Ridgewood Insights Admin CMS Technical Guide

## Architecture Overview

### System Components
- **Frontend**: Next.js 14+ with App Router
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage for media files
- **Authentication**: Supabase Auth with email/password
- **State Management**: React hooks and context API
- **Styling**: Tailwind CSS with custom design tokens

### Component Hierarchy

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout wrapper
│   │   ├── page.tsx            # Dashboard
│   │   ├── posts/              # Post management
│   │   ├── categories/         # Category management
│   │   ├── media/              # Media library
│   │   └── settings/           # Site settings
│
├── components/
│   ├── admin/                  # Admin-specific components
│   │   ├── Posts/              # Post management components
│   │   ├── Categories/         # Category components
│   │   ├── Media/              # Media library components
│   │   └── PostEditor/         # Post editor components
│
├── lib/
│   ├── admin/                  # Admin utility functions
│   │   ├── posts.ts            # Post CRUD operations
│   │   ├── categories.ts       # Category operations
│   │   ├── media.ts            # Media management
│   │   └── supabase.ts         # Supabase client
│
├── hooks/                     # Custom React hooks
│   ├── usePostEditor.ts        # Post editor state management
│   └── useAdminMutation.ts     # Mutation handling
│
└── contexts/                  # React contexts
    ├── AdminAuthContext.tsx    # Authentication context
    └── AdminErrorContext.tsx   # Error handling context
```

### Data Flow

1. **User Interaction** → 2. **React Components** → 3. **Custom Hooks** → 4. **Library Functions** → 5. **Supabase API** → 6. **Database/Storage**

### State Management Patterns

- **Local Component State**: `useState` for UI state
- **Global State**: Context API for auth and errors
- **Server State**: Supabase queries with React Query patterns
- **Form State**: Custom hooks with debounced auto-save

## Core Utilities and Patterns

### `useAdminMutation` Hook

```typescript
// Usage example
const { mutate, isLoading, error } = useAdminMutation(
  async () => {
    await deletePost(postId);
    return postId;
  },
  {
    onSuccess: () => showSuccess('Post deleted'),
    onError: (error) => showError(error.message),
    autoShowSuccess: true
  }
);
```

**Features**:
- Automatic error handling
- Loading state management
- Success/error notifications
- Type-safe mutation functions
- Integration with error context

### `usePostEditor` Hook

```typescript
// Usage example
const {
  state,
  updateField,
  isDirty,
  isSaving,
  lastSaved,
  saveError,
  explicitSave
} = usePostEditor({
  postId,
  initialState,
  onError: (error) => showError(error),
  onSuccess: (message) => showSuccess(message)
});
```

**Features**:
- Debounced auto-save (2 second delay)
- Manual save with Ctrl+S shortcut
- Field-level updates
- Dirty state tracking
- Error handling and recovery
- Type-safe state management

### Error Handling System

```typescript
// Error types
type AdminErrorType =
  | 'RLS_VIOLATION'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'CONFLICT'
  | 'UNKNOWN';

// Error context usage
const { showError, showSuccess, clearMessages } = useAdminError();
```

**Features**:
- Consistent error formatting
- User-friendly messages
- Error type classification
- Automatic error display
- Success notifications
- Global error state

## Database Schema

### Posts Table

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  content_html TEXT,
  excerpt TEXT,
  cover_image TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'scheduled')),
  disclaimer_type TEXT CHECK (disclaimer_type IN ('none', 'general', 'legal')),
  published_at TIMESTAMPTZ,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  revision_history JSONB DEFAULT '[]'
);
```

### Categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

### Posts Table Policies

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow admins full access
CREATE POLICY "Admins can manage all posts"
ON posts FOR ALL
USING (auth.uid() = author_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Allow authors to manage their own posts
CREATE POLICY "Authors can manage their own posts"
ON posts FOR ALL
USING (auth.uid() = author_id);
```

### Categories Table Policies

```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow admins full access
CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));
```

## API Endpoints

### Post Management

- `GET /api/posts` - List posts with filtering
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish post
- `POST /api/posts/:id/schedule` - Schedule post

### Category Management

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Media Management

- `GET /api/media` - List media files
- `POST /api/media/upload` - Upload media
- `DELETE /api/media/:path` - Delete media
- `GET /api/media/search` - Search media

## Common Issues and Solutions

### RLS Policy Troubleshooting

**Symptoms**:
- Users can't access data they should see
- "RLS Violation" errors
- Missing data in queries

**Solutions**:
1. Verify policies are correctly defined
2. Check user authentication status
3. Test with admin account
4. Review policy conditions
5. Check Supabase logs for details

```sql
-- Check current policies
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts';

-- Test policy with specific user
SELECT * FROM posts WHERE (auth.uid() = author_id);
```

### Supabase Query Debugging

**Techniques**:
1. Use `.explain()` to analyze queries
2. Check query execution plans
3. Monitor query performance
4. Review network requests
5. Examine error responses

```javascript
// Debug query example
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .explain({ analyze: true });
```

### Authentication Problems

**Common Issues**:
- Session not persisting
- User roles not recognized
- Login failures
- Permission errors

**Debugging Steps**:
1. Verify JWT token
2. Check user profile data
3. Test authentication flow
4. Review RLS policies
5. Examine auth logs

```javascript
// Check current user
const { data: { user } } = await supabase.auth.getUser();

// Get user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

## Performance Optimization

### Query Optimization

**Best Practices**:
- Use `.select()` to specify only needed columns
- Add appropriate indexes
- Limit result sets with `.limit()`
- Use proper filtering with `.eq()`, `.neq()`, etc.
- Avoid `*` selections in production

```javascript
// Optimized query example
const { data } = await supabase
  .from('posts')
  .select('id, title, slug, status, created_at')
  .eq('status', 'published')
  .order('created_at', { ascending: false })
  .limit(10);
```

### Database Indexes

**Recommended Indexes**:

```sql
-- Posts table indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published_at) WHERE status = 'published';

-- Categories table indexes
CREATE INDEX idx_categories_slug ON categories(slug);
```

### Caching Strategies

**Implementation Options**:
- Browser caching for static assets
- Server-side caching with Redis
- Query caching with React Query
- CDN caching for media files
- Service worker for offline support

```javascript
// React Query caching example
import { useQuery } from '@tanstack/react-query';

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });
}
```

## Deployment Process

### Deployment Checklist

1. [ ] Verify all tests pass
2. [ ] Run `npm run build` locally
3. [ ] Test staging environment
4. [ ] Set production environment variables
5. [ ] Configure Supabase backups
6. [ ] Set up monitoring
7. [ ] Deploy to production
8. [ ] Smoke test production
9. [ ] Monitor for issues
10. [ ] Document deployment

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_API_URL=https://your-site.com/api

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Vercel Deployment

1. Connect GitHub repository
2. Set environment variables in Vercel
3. Configure build settings
4. Set up automatic deployments
5. Configure domain and SSL
6. Enable preview deployments
7. Set up monitoring and alerts

## Maintenance Procedures

### Regular Maintenance Tasks

**Weekly**:
- Review error logs
- Check database performance
- Monitor storage usage
- Test backup restoration
- Update dependencies

**Monthly**:
- Review RLS policies
- Audit user permissions
- Clean up unused media
- Archive old content
- Review security settings

**Quarterly**:
- Performance optimization
- Database maintenance
- Security audit
- Feature review
- Documentation update

### Backup Procedures

```bash
# Supabase backup command
supabase db dump --db-url postgresql://postgres:password@localhost:5432/postgres -f backup.sql

# Restore from backup
supabase db restore --db-url postgresql://postgres:password@localhost:5432/postgres backup.sql
```

### Database Migration

```sql
-- Example migration: Add revision_history column
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS revision_history JSONB DEFAULT '[]';

-- Create migration script
CREATE TABLE post_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id),
  title TEXT NOT NULL,
  content TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);
```

## Security Best Practices

### Authentication Security

- Use strong password policies
- Implement rate limiting
- Enable two-factor authentication
- Monitor failed login attempts
- Regularly rotate API keys

### Data Protection

- Encrypt sensitive data
- Use HTTPS for all communications
- Implement proper CORS policies
- Sanitize user input
- Validate all API requests

### RLS Policy Security

- Follow principle of least privilege
- Test policies thoroughly
- Review policies regularly
- Document policy logic
- Monitor policy changes

## Monitoring and Analytics

### Error Tracking

```javascript
// Sentry integration example
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Performance Monitoring

```javascript
// Performance monitoring example
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function usePageViewTracking() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Track page view
      analytics.track('page_view', { url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);
}
```

### Logging Strategy

```javascript
// Structured logging example
import { logger } from '@/lib/logger';

logger.info('User logged in', {
  userId: user.id,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});

logger.error('Post creation failed', {
  error: error.message,
  postData: { title, slug },
  stack: error.stack
});
```

## Advanced Customization

### Extending the Post Editor

```typescript
// Add custom editor plugins
import { usePostEditor } from '@/hooks/usePostEditor';

function CustomEditor() {
  const { state, updateField } = usePostEditor({ ... });

  // Add custom field
  const handleCustomFieldChange = (value) => {
    updateField('custom_field', value);
  };

  return (
    <div>
      {/* Existing editor */}
      <input
        value={state.custom_field || ''}
        onChange={(e) => handleCustomFieldChange(e.target.value)}
      />
    </div>
  );
}
```

### Adding New Content Types

```typescript
// Extend PostData interface
export interface PostData {
  // ... existing fields
  custom_field?: string;
  related_posts?: string[];
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
}
```

### Custom API Endpoints

```typescript
// pages/api/custom-endpoint.ts
import { supabase } from '@/lib/admin/supabase';
import { withAdminAuth } from '@/lib/admin/auth';

export default withAdminAuth(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('custom_table')
      .select('*');

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Integration Guide

### Third-Party Services

**Analytics**:
- Google Analytics
- Mixpanel
- Amplitude
- Hotjar

**Email**:
- SendGrid
- Mailchimp
- Postmark
- AWS SES

**Payments**:
- Stripe
- PayPal
- Square

### Webhook Integration

```javascript
// Webhook handler example
export default async function handler(req, res) {
  // Verify webhook signature
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Handle successful payment
      break;
    // ... other event types
  }

  res.json({ received: true });
}
```

## Future Enhancements

### Planned Features

1. **Real-time Subscriptions**
   - Live updates for posts and comments
   - Collaborative editing
   - Notification system

2. **Comment Moderation**
   - Comment management interface
   - Spam filtering
   - Approval workflows

3. **Advanced Analytics**
   - Detailed post metrics
   - User engagement tracking
   - Export capabilities

4. **Multi-language Support**
   - Content translation
   - Locale management
   - Language switching

5. **Content Approval Workflow**
   - Draft submission
   - Review and approval
   - Version comparison

### Architecture Improvements

1. **Microservices Migration**
   - Separate auth service
   - Dedicated media service
   - API gateway

2. **Enhanced Caching**
   - Redis integration
   - Query caching
   - CDN optimization

3. **Search Functionality**
   - Full-text search
   - Elasticsearch integration
   - Advanced filtering

4. **Performance Optimization**
   - Database sharding
   - Query optimization
   - Load balancing

## Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Check linting
npm run lint

# Type checking
npm run typecheck

# Build for production
npm run build
```

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release candidates

### Commit Guidelines

- Use conventional commits
- Keep commits focused
- Write descriptive messages
- Reference issues when applicable
- Include relevant changes only

### Pull Request Process

1. Create feature branch
2. Implement changes
3. Write tests
4. Update documentation
5. Create pull request
6. Request reviews
7. Address feedback
8. Merge to develop
9. Deploy to staging
10. Test thoroughly

## Code Quality Standards

### TypeScript Best Practices

- Use strict typing
- Avoid `any` type
- Define interfaces for complex types
- Use type guards
- Leverage generics appropriately

### React Best Practices

- Use functional components
- Implement proper hooks usage
- Follow component composition
- Use memoization when needed
- Implement error boundaries

### Security Practices

- Sanitize all user input
- Use prepared statements
- Implement CSRF protection
- Set secure headers
- Follow OWASP guidelines

## Testing Strategy

### Unit Testing

```typescript
// Example unit test
import { render, screen } from '@testing-library/react';
import { PostRow } from '@/components/admin/Posts/PostRow';

test('renders post title', () => {
  const post = {
    id: '1',
    title: 'Test Post',
    status: 'draft',
    created_at: '2023-01-01'
  };

  render(<PostRow post={post} categories={[]} onDelete={jest.fn()} />);
  expect(screen.getByText('Test Post')).toBeInTheDocument();
});
```

### Integration Testing

```typescript
// Example integration test
import { renderHook, act } from '@testing-library/react-hooks';
import { usePostEditor } from '@/hooks/usePostEditor';

test('updates field correctly', () => {
  const { result } = renderHook(() =>
    usePostEditor({
      postId: '1',
      initialState: { title: '', slug: '', content: '', status: 'draft' }
    })
  );

  act(() => {
    result.current.updateField('title', 'New Title');
  });

  expect(result.current.state.title).toBe('New Title');
});
```

### End-to-End Testing

```typescript
// Example E2E test
describe('Post creation', () => {
  it('creates a new post', () => {
    cy.login('admin@example.com', 'password');
    cy.visit('/admin/posts/new');

    cy.get('#title').type('Test Post');
    cy.get('#content').type('Post content');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/admin/posts');
    cy.contains('Test Post').should('be.visible');
  });
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Check linting
        run: npm run lint

      - name: Type checking
        run: npm run typecheck

      - name: Build
        run: npm run build
```

### Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Monitoring and Alerting

### Error Monitoring Setup

```javascript
// Sentry configuration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
});
```

### Performance Monitoring

```javascript
// Performance monitoring
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function usePerformanceMonitoring() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      const [entries] = performance.getEntriesByType('navigation');
      if (entries) {
        const timing = {
          loadTime: entries.loadEventEnd - entries.startTime,
          domTime: entries.domComplete - entries.domLoading,
          ttfb: entries.responseStart - entries.requestStart
        };

        // Send to analytics
        analytics.track('page_performance', timing);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);
}
```

### Alerting Configuration

```yaml
# Example alert configuration
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    duration: 5m
    notification:
      - email: admin@example.com
      - slack: '#alerts'

  - name: SlowResponse
    condition: avg_response_time > 2000ms
    duration: 10m
    notification:
      - email: dev-team@example.com
      - pagerduty: critical
```

## Disaster Recovery

### Backup Strategy

1. **Database Backups**
   - Daily automated backups
   - Weekly full backups
   - Point-in-time recovery
   - Offsite storage

2. **Media Backups**
   - Storage bucket versioning
   - Cross-region replication
   - Regular integrity checks
   - Restoration testing

3. **Code Backups**
   - Git repository backups
   - Multiple remote origins
   - Regular clone testing
   - Dependency backup

### Recovery Procedures

**Database Recovery**:
1. Identify backup to restore
2. Verify backup integrity
3. Restore to staging environment
4. Test restored data
5. Apply to production

**Media Recovery**:
1. Identify affected files
2. Restore from version history
3. Verify file integrity
4. Update references
5. Test accessibility

**Full System Recovery**:
1. Restore database
2. Restore media files
3. Redeploy application
4. Test all functionality
5. Monitor for issues

### Recovery Time Objectives

- **Database**: < 1 hour for critical data
- **Media Files**: < 2 hours for recent files
- **Full System**: < 4 hours for complete recovery
- **Individual Posts**: < 30 minutes for single post recovery

## Conclusion

This technical guide provides comprehensive documentation for the Ridgewood Insights Admin CMS architecture, implementation details, and maintenance procedures. The system is designed with scalability, security, and maintainability in mind, following modern web development best practices.

For additional support or advanced customization needs, refer to the official documentation of the technologies used or consult with experienced developers familiar with the Next.js and Supabase ecosystem.