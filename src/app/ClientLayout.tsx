'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, Footer } from '@/components/layout';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <Navbar
        isHomePage={isHomePage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}