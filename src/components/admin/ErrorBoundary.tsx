'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * Catches component rendering errors and displays a fallback UI.
 * Logs errors for debugging.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-surface">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-secondary mb-2">
                Something went wrong
              </h1>
              <p className="text-text mb-4">
                An unexpected error occurred. Please try refreshing the page.
              </p>

              {this.state.error && (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-sm text-text hover:text-secondary">
                    Error details
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32 text-red-600">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
