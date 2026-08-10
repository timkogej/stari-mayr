import { ExternalLink } from 'lucide-react';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const rating = messages.bookingRating;

// TODO: potrdi točno oceno in število mnenj ter dodaj pravi Booking.com URL
const BOOKING_URL = '#';

export function BookingRating() {
  return (
    <div className="inline-flex items-center gap-4 bg-parchment border border-sand rounded-sm px-6 py-5">
      <span className="font-display italic text-4xl text-bronze">{rating.score}</span>
      <div className="space-y-1">
        <p className="font-body uppercase tracking-widest text-xs text-walnut">{rating.label}</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-body text-sm text-walnut hover:text-terracotta transition-colors"
        >
          {rating.reviewsText}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
