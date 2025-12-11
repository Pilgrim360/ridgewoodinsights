'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MarketingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Marketing section error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-3xl font-bold text-secondary">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mb-8 text-text">
          We encountered an unexpected error on this page. Please try again or
          contact us for assistance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border-2 border-primary px-6 py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Go home
          </Link>
        </div>

        {/* Support CTA */}
        <p className="mt-8 text-sm text-text">
          Need help?{' '}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
