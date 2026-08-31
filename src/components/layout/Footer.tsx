import { Share2 } from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { CookieSettingsButton } from '@/components/shared/CookieSettingsButton';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/shared/Logo';

export async function Footer() {
  const messages = await getMessages();
  const f = messages.footer;
  const year = new Date().getFullYear();
  return (
    <footer className="bg-coffee text-cream/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Column 1: Wordmark */}
          <div>
            {/* Footer sits on bg-coffee (#2C1F17), so the beige variant is the legible one. */}
            <Logo variant="beige" className="h-12 lg:h-14 w-auto mb-4" sizes="(min-width: 1024px) 222px, 190px" />
            <p className="font-script text-honey text-lg">{f.tagline}</p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <p className="font-body uppercase text-xs tracking-[0.2em] text-honey mb-4">
              {f.contact}
            </p>
            <div className="space-y-2 text-sm font-body">
              <p>{f.address}</p>
              <p>{f.phone}</p>
              <p>{f.email}</p>
            </div>
          </div>

          {/* Column 3: Social */}
          <div>
            <p className="font-body uppercase text-xs tracking-[0.2em] text-honey mb-4">
              {f.follow}
            </p>
            {/* TODO: Verify exact Facebook URL for Stari Mayr */}
            <a
              href="https://www.facebook.com/search/top?q=stari%20mayr%20kranj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-body hover:text-honey transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {f.facebookLabel}
            </a>
          </div>
        </div>

        {/* Reservation button row */}
        <div className="mt-8 lg:mt-10 flex justify-center lg:justify-start mb-10">
          <ReservationButtons />
        </div>

        <div className="border-t border-cream/10 pt-6 text-xs font-body text-cream/40">
          © {year} {f.copyright}
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-cream/50">
          <Link href="/pogoji-poslovanja" className="hover:text-cream/80 transition-colors">
            {f.terms}
          </Link>
          <Link href="/politika-zasebnosti" className="hover:text-cream/80 transition-colors">
            {f.privacy}
          </Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
