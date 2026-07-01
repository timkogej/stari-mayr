'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
// Touch / coarse-pointer devices (phones, most tablets). Scroll-scrubbing a video
// via `currentTime` is unreliable on these — iOS Safari in particular won't paint
// a frame while seeking a non-playing video — so we serve a plain playing video.
const TOUCH_QUERY = '(hover: none), (pointer: coarse), (any-pointer: coarse)';

function makeMediaHook(query: string) {
  return function useMediaQuery(): boolean {
    return useSyncExternalStore(
      (callback) => {
        const mq = window.matchMedia(query);
        mq.addEventListener('change', callback);
        return () => mq.removeEventListener('change', callback);
      },
      () => window.matchMedia(query).matches,
      () => false
    );
  };
}

/**
 * Returns whether the user has requested reduced motion.
 * Used to swap the cinematic scroll-scrub hero for a calm static fallback.
 */
export const usePrefersReducedMotion = makeMediaHook(REDUCED_MOTION_QUERY);

/**
 * Returns whether the device is a touch / coarse-pointer device (phones, tablets),
 * where scroll-scrubbing a video does not work reliably.
 */
export const useIsTouchDevice = makeMediaHook(TOUCH_QUERY);

/** Clamp a number into the [min, max] range. */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Maps `value` from the input range [inMin, inMax] to [0, 1], clamped.
 * Handy for turning a slice of overall scroll progress into a local 0..1 ramp.
 */
export function ramp(value: number, inMin: number, inMax: number): number {
  if (inMax === inMin) return value >= inMax ? 1 : 0;
  return clamp((value - inMin) / (inMax - inMin));
}

/** Smoothstep easing for calm, non-linear fades. */
export function smooth(t: number): number {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

/** Linear interpolation. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}
