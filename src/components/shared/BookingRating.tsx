import { ExternalLink } from 'lucide-react';
import { getMessages } from 'next-intl/server';

// TODO: confirm the exact rating/review count and replace this search URL with
// the direct Booking.com property link once it is available.
const BOOKING_URL =
  'https://www.booking.com/searchresults.html?ss=Guesthouse+Stari+Mayr+Kranj';

export async function BookingRating() {
  const messages = await getMessages();
  const rating = messages.bookingRating;

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
