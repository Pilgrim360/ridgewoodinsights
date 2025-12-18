/**
 * Admin CMS Type Definitions
 * Comprehensive interfaces for all admin portal data structures
 */

// ============================================================================
// Post-Related Types
// ============================================================================

export interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  content_html?: string;
  cover_image?: string | null;
  category_id?: string | null;
  status: 'draft' | 'published' | 'scheduled';
  disclaimer_type?: 'none' | 'general' | 'legal';
  published_at?: string;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PostFormState extends PostData {
  isDirty: boolean;
  lastSaved?: Date;
  isSaving?: boolean;
  saveError?: string;
}

export interface PostWithAuthor extends PostData {
  author?: {
    id: string;
    email: string;
  };
}

// ============================================================================
// Category-Related Types
// ============================================================================

export interface CategoryData {
  id?: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface CategoryWithPostCount extends CategoryData {
  post_count: number;
}

// ============================================================================
// Dashboard & Statistics Types
// ============================================================================

export interface DashboardStats {
  total_posts: number;
  published_count: number;
  draft_count: number;
  scheduled_count: number;
  total_page_views: number;
}

export interface RecentActivity {
  id: string;
  type: 'post_published' | 'post_drafted' | 'post_updated';
  post_title: string;
  post_id: string;
  created_at: string;
}

// ============================================================================
// Context & Global State Types
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface AdminContextType {
  user: AdminUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export interface AdminErrorContextType {
  error: string | null;
  success: string | null;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  clearMessages: () => void;
}

// ============================================================================
// Filter & Query Types
// ============================================================================

export interface PostFilters {
  search?: string;
  status?: 'all' | 'draft' | 'published' | 'scheduled';
  category_id?: string;
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============================================================================
// Upload & File Types
// ============================================================================

export interface UploadProgress {
  isUploading: boolean;
  progress: number; // 0-100
  error?: string;
}

export interface ImageUploadResult {
  url: string;
  size: number;
  type: string;
}

// ============================================================================
// Sidebar Navigation Types
// ============================================================================

export interface SidebarState {
  isExpanded: boolean;
  isMobileOpen: boolean;
  expandedGroups: Set<string>;
  toggleExpand: () => void;
  toggleMobileMenu: () => void;
  toggleGroup: (groupId: string) => void;
  closeMobileMenu: () => void;
}

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

// ============================================================================
// Modal & Dialog Types
// ============================================================================

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // red styling for destructive actions
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface SiteSettings {
  site_title: string;
  site_tagline: string;
  contact_email: string;
}

// ============================================================================
// Error Types
// ============================================================================

export type AdminErrorType =
  | 'RLS_VIOLATION'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'CONFLICT'
  | 'UNKNOWN';

export interface AdminError {
  type: AdminErrorType;
  message: string;
  originalError?: Error;
  retryable?: boolean;
}

// ============================================================================
// Form Validation Types
// ============================================================================

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}
