'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Container, Button } from '@/components/ui';
import { NAV_LINKS, SITE_NAME } from '@/constants';
import { MobileMenu } from './MobileMenu';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function Navbar({ className, mobileMenuOpen, setMobileMenuOpen, ...props }: NavbarProps) {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <header
        className={cn('sticky top-0 z-40 border-b border-surface bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60', className)}
        {...props}
      >
        <Container>
          <nav className="flex h-20 items-center justify-between" aria-label="Main navigation">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-primary transition-colors hover:text-primary/80"
            >
              {SITE_NAME}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-8">
              <ul className="flex items-center gap-8">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm font-medium transition-colors hover:text-primary',
                          isActive
                            ? 'text-primary font-semibold'
                            : 'text-secondary'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="hidden lg:block pl-4 border-l border-surface">
                <Button variant="primary" size="sm" onClick={() => window.location.href = '/contact'}>
                  Get Started
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-secondary hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle main menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </nav>
        </Container>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
      />
    </>
  );
}
