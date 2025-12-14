/**
 * Admin CMS Constants
 * Centralized constants to eliminate magic numbers and improve maintainability
 */

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_RECENT_ACTIVITY_LIMIT: 10,
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE_MB: 5,
  MEDIA_LIST_LIMIT: 100,
} as const;

// Content limits
export const CONTENT_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  SLUG_MAX_LENGTH: 100,
  EXCERPT_MAX_LENGTH: 300,
  CONTENT_MIN_LENGTH: 10,
} as const;

// Auto-save configuration
export const AUTO_SAVE = {
  DEBOUNCE_DELAY_MS: 2000,
  TOAST_DURATION_MS: 5000,
} as const;

// Post status options
export const POST_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
] as const;

// Post statuses for database operations
export const POST_STATUSES = ['draft', 'published', 'scheduled'] as const;

// Disclaimer types
export const DISCLAIMER_TYPES = ['none', 'general', 'legal'] as const;

// Error messages
export const ERROR_MESSAGES = {
  SETTINGS_READ_ONLY: 'Settings cannot be updated in MVP. Update environment variables instead.',
  REVISION_DISABLED: 'Post revision functionality is temporarily disabled.',
  MEDIA_USAGE_TRACKING: 'Media usage tracking is not yet implemented.',
} as const;