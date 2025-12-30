'use client';

import React, { Component, ReactNode } from 'react';
import { isAuthError } from '@/lib/admin/auth-interceptor';

interface Props {
  children: ReactNode;
  onAuthError?: () => void;
}

interface State {
  hasError: boolean;
  isAuthError: boolean;
  error: Error | null;
}

/**
 * AuthErrorBoundary
 * Catches unhandled errors and specifically handles auth-related failures
 * Prevents infinite loading states by showing fallback UI
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isAuthError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Determine if this is an auth error
    const authError = isAuthError(error);

    return {
      hasError: true,
      isAuthError: authError,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // If it's an auth error, trigger the callback
    if (this.state.isAuthError && this.props.onAuthError) {
      this.props.onAuthError();
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleLogin = (): void => {
    window.location.href = '/admin/login';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Auth-specific error UI
      if (this.state.isAuthError) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Session Expired
              </h1>
              <p className="text-gray-600 mb-6">
                Your session has expired or is no longer valid. Please log in again to continue.
              </p>
              <div className="space-y-3">
                <button
                  onClick={this.handleLogin}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Go to Login
                </button>
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reload Page
                </button>
              </div>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Error details
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      }

      // Generic error UI for non-auth errors
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
