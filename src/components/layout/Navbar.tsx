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
}

export function Navbar({ className, mobileMenuOpen, setMobileMenuOpen, ...props }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isHome = pathname === '/';
  // We apply the transparent effect primarily on the home page or pages with Hero. 
  // Since all marketing pages seem to have a Hero, we can apply it globally or just check if we want it everywhere.
  // The user request implies this design is for "the header and the background image/video of the hero component".
  // Assuming all marketing pages have this structure.
  
  // Dynamic classes based on scroll state
  const headerClasses = isScrolled
    ? 'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-surface shadow-sm'
    : 'bg-transparent border-transparent';
    
  const navLinkClass = (active: boolean) => 
    isScrolled
      ? (active ? 'text-primary font-semibold' : 'text-secondary hover:text-primary')
      : (active ? 'text-white font-semibold' : 'text-white/90 hover:text-white');

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
          'fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300 ease-in-out',
          headerClasses,
          className
        )}
        {...props}
      >
        <Container maxWidth="2xl">
          <nav className="flex h-20 items-center justify-between" aria-label="Main navigation">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-2 font-bold transition-colors text-base sm:text-lg md:text-xl lg:text-2xl',
                isScrolled ? 'text-primary hover:text-primary/80' : 'text-white hover:text-white/90'
              )}
            >
              {SITE_NAME}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8 xl:gap-10">
              <ul className="flex items-center gap-6 lg:gap-8 xl:gap-10">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm font-medium transition-colors',
                          navLinkClass(isActive)
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className={cn("hidden lg:block pl-4 border-l", isScrolled ? "border-surface" : "border-white/20")}>
                <Button 
                  variant={isScrolled ? "primary" : "outline"} 
                  className={!isScrolled ? "text-white border-white hover:bg-white/10" : ""}
                  size="sm" 
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset md:hidden transition-colors",
                isScrolled 
                  ? "text-secondary hover:bg-background hover:text-primary focus:ring-primary" 
                  : "text-white hover:bg-white/10 hover:text-white focus:ring-white"
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
