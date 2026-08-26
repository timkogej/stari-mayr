'use client';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useMessages } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { cn } from '@/lib/utils';

export function Header() {
  const messages = useMessages();
  const nav = messages.nav;

  const links = [
    { label: nav.home, href: '/' as const },
    { label: nav.ponudba, href: '/ponudba' as const },
    { label: nav.about, href: '/o-nas' as const },
    { label: nav.rooms, href: '/sobe' as const },
    { label: nav.contact, href: '/kontakt' as const },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-cream/95 backdrop-blur-sm border-b border-sand'
          : 'bg-transparent'
      )}
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          className={cn(
            'font-display italic text-xl tracking-wide shrink-0 transition-colors duration-500',
            scrolled ? 'text-coffee' : 'text-cream'
          )}
        >
          Stari Mayr
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 items-center gap-8"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-body uppercase text-[11px] tracking-[0.2em] transition-colors duration-500 relative group',
                scrolled ? 'text-coffee hover:text-bronze' : 'text-cream/90 hover:text-cream'
              )}
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-current w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Desktop language switcher + reservation button */}
        <div className="hidden lg:flex items-center gap-6 pr-1">
          <LanguageSwitcher />
          <ReservationButtons />
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                className={cn(
                  'lg:hidden transition-colors duration-500',
                  scrolled ? 'text-coffee' : 'text-cream'
                )}
                aria-label={nav.openMenu}
              >
                <Menu className="w-6 h-6" />
              </button>
            }
          />
          <SheetContent side="right" className="bg-cream border-sand w-[min(22rem,92vw)]">
            <div className="flex flex-col h-full pt-8 px-6 pb-6">
              <p className="font-display italic text-2xl text-coffee mb-2">Stari Mayr</p>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-walnut/60 mb-8">{nav.menuLabel}</p>
              <nav className="flex flex-col gap-3 flex-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-body uppercase text-xs tracking-[0.2em] text-coffee hover:text-bronze transition-colors px-4 py-3 rounded-sm border border-sand/70 bg-parchment/45"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="pt-6 border-t border-sand/80 flex flex-col items-center gap-6 py-6">
                <LanguageSwitcher />
                <ReservationButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
