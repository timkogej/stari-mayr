'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';
import { cn } from '@/lib/utils';

const messages = getMessages();
const nav = messages.nav;

const links = [
  { label: nav.home, href: '/' },
  { label: nav.menu, href: '/meni' },
  { label: nav.gallery, href: '/galerija' },
  { label: nav.about, href: '/o-nas' },
  { label: nav.rooms, href: '/sobe' },
  { label: nav.contact, href: '/kontakt' },
];

export function Header() {
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
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8">
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
        <nav className="hidden lg:flex items-center gap-8">
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

        {/* Desktop reservation buttons */}
        <div className="hidden lg:flex items-center">
          <ReservationButtons variant="both" context={scrolled ? 'light' : 'dark'} />
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
                aria-label="Odpri meni"
              >
                <Menu className="w-6 h-6" />
              </button>
            }
          />
          <SheetContent side="right" className="bg-cream border-sand w-[min(22rem,92vw)]">
            <div className="flex flex-col h-full pt-8 px-6 pb-6">
              <p className="font-display italic text-2xl text-coffee mb-2">Stari Mayr</p>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-walnut/60 mb-8">Navigacija</p>
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
              <div className="pt-6 border-t border-sand/80 flex flex-col gap-3">
                <ReservationButtons variant="both" context="light" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
