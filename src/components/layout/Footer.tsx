import { Share2 } from 'lucide-react';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const f = messages.footer;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-coffee text-cream/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Wordmark */}
          <div>
            <p className="font-display italic text-2xl text-cream tracking-wide mb-2">
              Stari Mayr
            </p>
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
              <p className="text-cream/60 text-xs mt-3">{f.hours}</p>
            </div>
          </div>

          {/* Column 3: Social */}
          <div>
            <p className="font-body uppercase text-xs tracking-[0.2em] text-honey mb-4">
              {f.follow}
            </p>
            {/* TODO: Verify exact Facebook URL for Gostilna Stari Mayr */}
            <a
              href="https://www.facebook.com/search/top?q=gostilna%20stari%20mayr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-body hover:text-honey transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {f.facebookLabel}
            </a>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 text-xs font-body text-cream/40">
          © {year} {f.copyright}
        </div>
      </div>
    </footer>
  );
}
