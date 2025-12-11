import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found - Ridgewood Insights',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4">
            <svg
              className="h-12 w-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Large 404 */}
        <h1 className="mb-2 text-6xl font-bold text-secondary">404</h1>

        {/* Heading */}
        <h2 className="mb-2 text-2xl font-bold text-secondary">Page not found</h2>

        {/* Description */}
        <p className="mb-8 text-text">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Go home
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border-2 border-primary px-6 py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Contact us
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-sm text-text">
          <p className="mb-2">Looking for something specific?</p>
          <Link href="/services" className="block font-medium text-primary hover:underline">
            Browse our services
          </Link>
        </div>
      </div>
    </div>
  );
}
