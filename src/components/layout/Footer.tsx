import Link from 'next/link';
import {
  Briefcase,
  Building,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
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
      default: return <Building className="h-5 w-5" />;
    }
  };

  return (
    <footer
      className={cn('bg-secondary text-white pt-16 pb-8', className)}
      {...props}
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Column 1: Company Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{COMPANY_INFO.name}</h2>
              <p className="text-white/80 text-sm leading-relaxed">{COMPANY_INFO.tagline}</p>
            </div>
            
            <address className="space-y-4 not-italic text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="transition-colors hover:text-white"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
            </address>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Our Services
            </h3>
            <ul className="space-y-3">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    className="text-sm text-white/70 transition-colors hover:text-primary hover:translate-x-1 inline-block duration-200"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm font-medium text-primary hover:text-white transition-colors inline-flex items-center gap-1 mt-2"
                >
                  View All Services &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Company
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-primary hover:translate-x-1 inline-block duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/insights"
                  className="text-sm text-white/70 transition-colors hover:text-primary hover:translate-x-1 inline-block duration-200"
                >
                  Insights & News
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/70 transition-colors hover:text-primary hover:translate-x-1 inline-block duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Stay Connected</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Subscribe to our newsletter for the latest financial insights and tax updates.
            </p>
            
            {/* Simple Newsletter Form */}
            <form className="mb-8" onSubmit={(e) => e.preventDefault()}>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-primary w-full"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Join
                </button>
              </div>
            </form>

            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 p-2 rounded-full text-white/70 transition-all hover:bg-primary hover:text-white hover:-translate-y-1"
                  aria-label={link.label}
                >
                  {getSocialIcon(link.label)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
