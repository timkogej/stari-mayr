import Image from 'next/image';
import { cn } from '@/lib/utils';

const SOURCES = {
  beige: '/images/stari-mayr-logo-beige.png',
  black: '/images/stari-mayr-logo-black.png',
} as const;

/**
 * Both variants are normalised to one canvas by scripts/normalize-logo.mjs, so
 * they share these intrinsic dimensions and can be cross-faded without shift.
 */
const LOGO_WIDTH = 2185;
const LOGO_HEIGHT = 552;

export const LOGO_ASPECT = `${LOGO_WIDTH}/${LOGO_HEIGHT}`;
export const LOGO_ALT = 'Stari Mayr — gostišče, 1852';

type LogoProps = {
  variant: 'beige' | 'black';
  className?: string;
  /** Marks this render as an LCP candidate (replaces the deprecated `priority`). */
  preload?: boolean;
  sizes?: string;
  /**
   * Defaults to the descriptive wordmark text. Pass "" for a decorative
   * instance — e.g. the stacked pair of a cross-fade, where the accessible
   * name belongs to the wrapping link instead of being announced twice.
   */
  alt?: string;
};

export function Logo({ variant, className, preload, sizes, alt = LOGO_ALT }: LogoProps) {
  return (
    <Image
      src={SOURCES[variant]}
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      preload={preload}
      sizes={sizes}
      className={cn('object-contain', className)}
    />
  );
}
