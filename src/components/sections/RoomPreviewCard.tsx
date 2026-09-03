'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Info, X } from 'lucide-react';
import { useIsTouchDevice } from '@/hooks/useScrollScrubVideo';

type RoomPreviewCardProps = {
  src: string;
  filterClass: string;
  eyebrow: string;
  name: string;
  description: string;
  imageLabel: string;
  /** Accessible label for the reveal control, e.g. "Show description". */
  revealLabel: string;
};

const HIDDEN = 'max-h-0 opacity-0 -translate-y-1';
const SHOWN = 'max-h-32 opacity-100 translate-y-0';
const ON_HOVER =
  'group-hover:max-h-32 group-hover:opacity-100 group-hover:translate-y-0';

/**
 * The description sits behind :hover on the desktop card. Touch devices never
 * get a persistent hover, so there the same content is put behind a tap, with
 * the hover classes dropped so a browser's transient tap-hover cannot fight the
 * explicit state. Pointer devices keep the original CSS-only behaviour.
 */
export function RoomPreviewCard({
  src,
  filterClass,
  eyebrow,
  name,
  description,
  imageLabel,
  revealLabel,
}: RoomPreviewCardProps) {
  const isTouch = useIsTouchDevice();
  const [tapped, setTapped] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Derived, not stored: if the pointer type changes under us (a tablet gaining
  // a mouse, DevTools emulation toggling), the card falls straight back to the
  // hover behaviour without needing an effect to reset anything.
  const revealed = isTouch && tapped;

  // Tapping anywhere off the card returns it to its default state, so a reveal
  // never gets stranded open.
  useEffect(() => {
    if (!revealed) return;
    const onPointerDown = (event: PointerEvent) => {
      const frame = frameRef.current;
      if (frame && !frame.contains(event.target as Node)) setTapped(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [revealed]);

  const toggle = () => setTapped((open) => !open);

  const interaction = isTouch
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-expanded': revealed,
        'aria-label': revealLabel,
        onClick: toggle,
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        },
      }
    : {};

  return (
    <div
      ref={frameRef}
      data-revealed={revealed ? 'true' : undefined}
      className="room-heritage-frame group relative aspect-[3/4] overflow-hidden border border-sand shadow-sm"
      {...interaction}
    >
      <Image
        src={src}
        alt={imageLabel}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`room-heritage-image ${filterClass} object-cover`}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(44,31,23,0.92) 0%, rgba(44,31,23,0.55) 32%, rgba(44,31,23,0.05) 60%, transparent 75%)',
        }}
      />

      {/* Touch-only hint that there is more behind a tap, and how to close it. */}
      {isTouch && (
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center
            rounded-full border border-honey/45 bg-coffee/55 text-honey
            transition-opacity duration-300"
        >
          {revealed ? (
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          ) : (
            <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-display uppercase tracking-widest text-honey text-xs mb-1">
          {eyebrow}
        </p>
        <h3 className="font-display italic text-2xl text-cream mb-2">{name}</h3>
        <p
          className={`font-body text-sm text-cream/85 leading-relaxed overflow-hidden
            transition-all duration-500 ease-out ${
              revealed ? SHOWN : `${HIDDEN} ${isTouch ? '' : ON_HOVER}`
            }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
