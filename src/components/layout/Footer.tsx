import Link from 'next/link';
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui';
import { COMPANY_INFO, QUICK_LINKS, SOCIAL_LINKS, SERVICES } from '@/constants';

export type FooterProps = React.HTMLAttributes<HTMLElement>;

export function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Helper to get icon for social link
  const getSocialIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <footer
      className={cn('bg-secondary text-white pt-20 pb-10', className)}
      {...props}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="text-2xl font-bold tracking-tight text-white inline-block">
                {COMPANY_INFO.name}
              </Link>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                {COMPANY_INFO.tagline}. Professional accounting and financial insights for businesses and individuals seeking growth and stability.
              </p>
            </div>
            
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 transition-colors hover:text-primary"
                  aria-label={link.label}
                >
                  {getSocialIcon(link.label)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
              Services
            </h3>
            <ul className="space-y-4">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    className="text-sm text-white/60 transition-colors hover:text-white flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0 text-primary" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/insights"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
                >
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
                >
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>{COMPANY_INFO.phone}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/40 font-medium">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-white/40">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
