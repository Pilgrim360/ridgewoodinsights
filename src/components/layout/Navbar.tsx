'use client';

import { useState, useEffect } from 'react';
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
  isHomePage?: boolean;
}

export function Navbar({
  className,
  mobileMenuOpen,
  setMobileMenuOpen,
  isHomePage = false,
  ...props
}: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        setIsScrolled(window.scrollY > 50);
      }
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check on mount
    }

    return () => {
      if (isHomePage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isHomePage]);

  const hasSolidBackground = !isHomePage || isScrolled;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <header
        className={cn(
          'top-0 z-40 w-full transition-all duration-300 ease-in-out',
          isHomePage
            ? isScrolled
              ? 'sticky bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-surface'
              : 'absolute bg-transparent border-b border-transparent'
            : 'sticky bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-surface',
          className
        )}
        {...props}
      >
        <Container>
          <nav className="flex h-20 items-center justify-between" aria-label="Main navigation">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-2 text-2xl font-bold transition-colors',
                hasSolidBackground
                  ? 'text-primary hover:text-primary/80'
                  : 'text-white hover:text-white/80'
              )}
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
                          'text-sm font-medium transition-colors',
                          hasSolidBackground
                            ? isActive
                              ? 'text-primary font-semibold'
                              : 'text-secondary hover:text-primary'
                            : isActive
                              ? 'text-white font-semibold'
                              : 'text-white/80 hover:text-white'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div
                className={cn(
                  'hidden lg:block pl-4 transition-colors',
                  hasSolidBackground ? 'border-l border-surface' : 'border-l border-white/20'
                )}
              >
                <Button
                  variant={hasSolidBackground ? 'primary' : 'outline'}
                  className={
                    !hasSolidBackground
                      ? 'border-white text-white hover:bg-white hover:text-primary'
                      : ''
                  }
                  size="sm"
                  onClick={() => (window.location.href = '/contact')}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={cn(
                'inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden',
                hasSolidBackground
                  ? 'text-secondary hover:bg-background hover:text-primary'
                  : 'text-white hover:bg-white/10'
              )}
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
