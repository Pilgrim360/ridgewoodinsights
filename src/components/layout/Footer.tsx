import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui';
import { COMPANY_INFO, QUICK_LINKS, SOCIAL_LINKS } from '@/constants';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

export function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn('bg-secondary text-white', className)}
      {...props}
    >
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white">{COMPANY_INFO.name}</h2>
            <p className="mt-2 text-sm text-white/80">{COMPANY_INFO.tagline}</p>
            <address className="mt-4 space-y-1 text-sm not-italic text-white/70">
              <p>{COMPANY_INFO.address}</p>
              <p>
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="transition-colors hover:text-white"
                >
                  {COMPANY_INFO.email}
                </a>
              </p>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Connect With Us
            </h3>
            <ul className="mt-4 space-y-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-6">
          <p className="text-center text-sm text-white/60">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
