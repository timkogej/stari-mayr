'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

/**
 * Returns whether the user has requested reduced motion.
 * Used to swap the cinematic scroll-scrub hero for a calm static fallback.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

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
