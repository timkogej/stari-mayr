'use client';

import { Star } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const reviews = messages.reviews;

type ReviewItem = {
  text: string;
  author: string;
  tag: string;
};

function getReviewsByPathname(pathname: string): { sectionTitle: string; items: ReviewItem[] } {
  if (pathname.startsWith('/sobe')) {
    return { sectionTitle: 'Mnenja o sobah', items: reviews.byPage.rooms };
  }
  if (pathname.startsWith('/meni')) {
    return { sectionTitle: 'Mnenja o hrani', items: reviews.byPage.menu };
  }
  if (pathname.startsWith('/o-nas')) {
    return { sectionTitle: 'Mnenja o ambientu in ekipi', items: reviews.byPage.about };
  }
  return { sectionTitle: 'Izbrana mnenja', items: reviews.byPage.mix };
}

export function TestimonialsMarquee() {
  const pathname = usePathname();
  const { sectionTitle, items } = getReviewsByPathname(pathname);
  const marqueeItems = [...items, ...items];

  return (
    <section className="bg-parchment border-y border-sand/70 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <p className="font-display uppercase tracking-[0.3em] text-xs text-bronze text-center mb-3">
          {reviews.eyebrow}
        </p>
        <h2 className="font-display italic text-3xl md:text-4xl text-coffee text-center mb-2">
          {reviews.title}
        </h2>
        <p className="font-body text-sm text-walnut/70 text-center mb-8">{sectionTitle}</p>
      </div>

      <div className="relative">
        <div className="mayr-marquee">
          {marqueeItems.map((review, idx) => (
            <article
              key={`${review.author}-${idx}`}
              className="mx-3 min-w-[22rem] md:min-w-[30rem] max-w-[30rem] rounded-md border border-sand/90 bg-gradient-to-b from-cream to-[#f7f0e4] px-5 py-5 shadow-[0_5px_18px_rgba(44,31,23,0.08)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-honey text-honey" />
                  ))}
                </div>
                <span className="rounded-full border border-sand bg-parchment px-2.5 py-1 font-body text-[11px] uppercase tracking-wider text-walnut/70">
                  {review.tag}
                </span>
              </div>
              <p className="font-body text-sm text-walnut leading-relaxed mb-4">
                “{review.text}”
              </p>
              <p className="font-display italic text-base text-coffee">— {review.author}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
