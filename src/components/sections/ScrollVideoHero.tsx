'use client';

import { useEffect, useRef, type RefObject } from 'react';
import Image from 'next/image';
import { useMessages } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { ChevronDown } from 'lucide-react';
import {
  usePrefersReducedMotion,
  useIsTouchDevice,
  clamp,
  ramp,
  smooth,
  lerp,
} from '@/hooks/useScrollScrubVideo';

const VIDEO = '/videos/stari-mayr-scroll.mp4';
const VIDEO_POSTER = '/images/stari-mayr-scroll-hero-poster.jpg';

/**
 * Scroll timeline (fraction of total section scroll):
 *  0.00 – 0.80  scrub the video from start to end
 *  0.80 – 1.00  hold the final frame, reveal final overlay + CTA
 */
const SCRUB_END = 0.8;
// Trim a hair off the duration so a finished video never snaps back to frame 0.
const EPSILON = 0.05;
// How quickly each frame eases toward the scroll target (lower = smoother/softer).
const SCRUB_EASE = 0.1;

export function ScrollVideoHero() {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  if (reducedMotion) {
    return <StillHeroFallback />;
  }

  // Both viewports now scrub the same MP4; only the framing and type scale
  // differ. See useScrubTimeline for why the mobile frame sequence is gone.
  if (isTouch) {
    return <MobileScrubHero />;
  }

  return <ScrubHero />;
}

/** Per-viewport tuning of the overlay choreography. Module-level so the
 *  identity stays stable and the timeline effect is not torn down each render. */
type ScrubTuning = {
  /** How far the intro block lifts as it leaves, in px. */
  introLift: number;
  /** How far the final block travels as it settles in, in px. */
  finalLift: number;
  /** Readability gradient at rest, and how much a visible panel strengthens it. */
  gradientBase: number;
  gradientBoost: number;
};

const DESKTOP_TUNING: ScrubTuning = {
  introLift: 52,
  finalLift: 28,
  gradientBase: 0.34,
  gradientBoost: 0.34,
};

const MOBILE_TUNING: ScrubTuning = {
  introLift: 42,
  finalLift: 24,
  gradientBase: 0.36,
  gradientBoost: 0.36,
};

/**
 * Drives a scroll-scrubbed <video> plus the overlay choreography on top of it.
 *
 * Shared by both heroes. Mobile used to paint a 50-frame JPEG sequence into a
 * <canvas> instead, because iOS Safari could not be trusted to paint a frame
 * while seeking a paused video. That workaround cost more than it bought: the
 * canvas backing store is sized in CSS pixels, so on a 3x phone the hero
 * resolved at a third of the screen's pixels and then got upscaled — which is
 * what read as "badly made", far more than the JPEG quality did. It also held
 * ~174MB of decoded bitmaps. A real <video> is composited at native resolution
 * with none of that.
 */
function useScrubTimeline(
  sectionRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  gradientRef: RefObject<HTMLDivElement | null>,
  introRef: RefObject<HTMLDivElement | null>,
  finalRef: RefObject<HTMLDivElement | null>,
  hintRef: RefObject<HTMLDivElement | null>,
  tuning: ScrubTuning
) {
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let rafId = 0;
    let active = false;

    // Smoothed currentTime value we lerp toward the scroll target each frame.
    let smoothed = 0;
    let hasSeekableFrame = false;

    const durationOf = (v: HTMLVideoElement) =>
      Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0;

    const seek = (v: HTMLVideoElement, target: number) => {
      if (v.readyState < 2 || !durationOf(v)) return;
      // Wait for the previous seek to finish before issuing a new one. This keeps
      // seeks from piling up faster than the decoder can serve them, which is the
      // main cause of choppy scrubbing. Each new seek jumps straight to the latest
      // eased target, so we never fall behind.
      if (v.seeking) return;
      // Only seek when it moves at least ~one frame.
      if (Math.abs(v.currentTime - target) > 0.033) {
        v.currentTime = target;
      }
    };

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return clamp(-rect.top / scrollable);
    };

    // Last values handed to the compositor. Rewriting a style property with the
    // string it already holds still dirties the element, so each is written only
    // when it has actually moved. The scrub itself is deliberately not guarded
    // this way: `smoothed` eases toward its target, so it still has ground to
    // cover on frames where scroll position did not change.
    let lastIntroOpacity = -1;
    let lastFinalEnter = -1;
    let lastGradient = -1;
    let lastHint = -1;
    /** Below this, a change is far too small to be visible. */
    const STYLE_EPSILON = 0.002;
    const moved = (next: number, prev: number) =>
      Math.abs(next - prev) > STYLE_EPSILON;

    /**
     * A panel that is fully faded out still costs the compositor its
     * backdrop-filter blur on every repaint underneath it. Dropping the filter
     * while it is invisible is free visually and takes that work out of the
     * middle of the scrub, where neither panel is on screen.
     */
    const setPanel = (
      el: HTMLElement,
      opacity: number,
      y: number,
      interactive: boolean
    ) => {
      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      el.style.pointerEvents = interactive ? 'auto' : 'none';
      el.style.backdropFilter = opacity < 0.05 ? 'none' : '';
    };

    const render = () => {
      const p = computeProgress();
      const dur = durationOf(video);

      // --- Video scrub target ---------------------------------------------
      if (dur) {
        const target = ramp(p, 0, SCRUB_END) * dur;
        const clamped = Math.min(target, dur - EPSILON);
        // If loading finishes after the visitor has already scrolled, begin at
        // the current target instead of visibly catching up from time zero.
        if (!hasSeekableFrame && video.readyState >= 2) {
          smoothed = clamped;
          hasSeekableFrame = true;
        } else if (hasSeekableFrame) {
          smoothed = lerp(smoothed, clamped, SCRUB_EASE);
        }
        seek(video, smoothed);
      }

      // --- Intro overlay ("Stari Mayr") ----------------------------------
      const introLeave = smooth(ramp(p, 0.04, 0.2));
      const introOpacity = 1 - introLeave;
      if (introRef.current && moved(introOpacity, lastIntroOpacity)) {
        lastIntroOpacity = introOpacity;
        setPanel(
          introRef.current,
          introOpacity,
          -introLeave * tuning.introLift,
          introOpacity >= 0.05
        );
      }

      // --- Final overlay + CTA -------------------------------------------
      const finalEnter = smooth(ramp(p, SCRUB_END - 0.06, SCRUB_END));
      if (finalRef.current && moved(finalEnter, lastFinalEnter)) {
        lastFinalEnter = finalEnter;
        setPanel(
          finalRef.current,
          finalEnter,
          (1 - finalEnter) * tuning.finalLift,
          finalEnter > 0.5
        );
      }

      // --- Readability gradient strength ---------------------------------
      const gradient =
        tuning.gradientBase +
        tuning.gradientBoost * Math.max(introOpacity, finalEnter);
      if (gradientRef.current && moved(gradient, lastGradient)) {
        lastGradient = gradient;
        gradientRef.current.style.opacity = String(gradient);
      }

      // --- Scroll hint ----------------------------------------------------
      const hint = 1 - smooth(ramp(p, 0.02, 0.1));
      if (hintRef.current && moved(hint, lastHint)) {
        lastHint = hint;
        hintRef.current.style.opacity = String(hint);
      }

      rafId = requestAnimationFrame(render);
    };

    const start = () => {
      if (active) return;
      active = true;
      rafId = requestAnimationFrame(render);
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(rafId);
    };

    // Initialise the video to its first frame once metadata is ready.
    const onMeta = () => {
      try {
        video.currentTime = 0;
      } catch {
        /* seeking before ready — ignored */
      }
    };
    if (video.readyState >= 1) onMeta();
    else video.addEventListener('loadedmetadata', onMeta, { once: true });

    // Only run the rAF loop while the hero is on (or near) screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(section);

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      io.disconnect();
      stop();
    };
  }, [sectionRef, videoRef, gradientRef, introRef, finalRef, hintRef, tuning]);
}

/* -------------------------------------------------------------------------- */
/*  Cinematic scroll-scrub hero (default experience)                          */
/* -------------------------------------------------------------------------- */

function ScrubHero() {
  const messages = useMessages();
  const c = messages.home.scrollHero;
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const gradientRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useScrubTimeline(
    sectionRef,
    videoRef,
    gradientRef,
    introRef,
    finalRef,
    hintRef,
    DESKTOP_TUNING
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[380vh] bg-coffee"
      aria-label={`${c.introTitle}. ${c.finalTitle}.`}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-coffee"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO}
          poster={VIDEO_POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Readability gradient */}
        <div
          ref={gradientRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.34,
            background:
              'linear-gradient(to top, rgba(44,31,23,0.78) 0%, rgba(44,31,23,0.18) 38%, rgba(44,31,23,0.12) 62%, rgba(44,31,23,0.55) 100%)',
          }}
        />

        {/* Intro overlay — "Stari Mayr", visible at the top of the scroll */}
        <div
          ref={introRef}
          className="absolute inset-0 flex items-center justify-center px-6 text-center will-change-[opacity,transform]"
          style={{ opacity: 1 }}
        >
          <div className="relative max-w-3xl bg-coffee/50 px-10 py-12 backdrop-blur-[2px] sm:px-16 sm:py-16 border border-honey/45">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[9px] border border-cream/20"
            />
            <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-5">
              {c.introEyebrow}
            </p>
            <h1 className="font-display italic font-medium text-cream text-6xl sm:text-8xl lg:text-9xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
              {c.introTitle}
            </h1>
            <p className="font-body text-cream/85 uppercase tracking-[0.2em] text-xs sm:text-sm mt-7">
              {c.introSubtitle}
            </p>
          </div>
        </div>

        {/* Final overlay + CTA */}
        <div
          ref={finalRef}
          className="absolute inset-0 flex items-center justify-center px-6 text-center will-change-[opacity,transform]"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative max-w-2xl bg-coffee/50 px-10 py-12 backdrop-blur-[2px] sm:px-16 sm:py-14 border border-honey/45">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[9px] border border-cream/20"
            />
            <h2 className="font-display italic font-medium text-cream text-4xl sm:text-6xl lg:text-7xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
              {c.finalTitle}
            </h2>
            <p className="font-body text-cream/85 mt-6 text-base sm:text-lg tracking-wide">
              {c.finalSubtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sobe"
                className="font-body uppercase tracking-[0.15em] text-xs px-6 py-3.5 transition-colors duration-300 bg-terracotta hover:bg-terracotta/90 text-cream"
              >
                {c.ctaPrimary}
              </Link>
              <ReservationButtons />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Touch / reduced-motion fallbacks                                          */
/* -------------------------------------------------------------------------- */

function MobileScrubHero() {
  const messages = useMessages();
  const c = messages.home.scrollHero;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useScrubTimeline(
    sectionRef,
    videoRef,
    gradientRef,
    introRef,
    finalRef,
    hintRef,
    MOBILE_TUNING
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[330svh] bg-coffee"
      aria-label={`${c.introTitle}. ${c.finalTitle}.`}
    >
      <div className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden bg-coffee">
        <Image
          className="object-cover"
          src={VIDEO_POSTER}
          alt=""
          fill
          preload
          sizes="100vw"
          aria-hidden="true"
        />
        {/* The poster <Image> above paints immediately and stays underneath, so
            if a device ever refuses to paint a seeked frame the hero degrades
            to that still rather than to a blank panel. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO}
          poster={VIDEO_POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div
          ref={gradientRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.36,
            background:
              'linear-gradient(to top, rgba(44,31,23,0.82) 0%, rgba(44,31,23,0.26) 42%, rgba(44,31,23,0.18) 62%, rgba(44,31,23,0.58) 100%)',
          }}
        />

        <div
          ref={introRef}
          className="absolute inset-0 flex items-center justify-center px-6 text-center will-change-[opacity,transform]"
          style={{ opacity: 1 }}
        >
          <div className="relative w-full max-w-[min(88vw,34rem)] border border-honey/45 bg-coffee/50 px-7 py-9 backdrop-blur-[2px]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[9px] border border-cream/20"
            />
            <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-5">
              {c.introEyebrow}
            </p>
            <h1 className="font-display italic font-medium text-cream text-5xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
              {c.introTitle}
            </h1>
            <p className="font-body text-cream/85 uppercase tracking-[0.18em] text-xs mt-6">
              {c.introSubtitle}
            </p>
          </div>
        </div>

        <div
          ref={finalRef}
          className="absolute inset-0 flex items-center justify-center px-6 text-center will-change-[opacity,transform]"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative w-full max-w-[min(88vw,34rem)] border border-honey/45 bg-coffee/50 px-7 py-9 backdrop-blur-[2px]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[9px] border border-cream/20"
            />
            <h2 className="font-display italic font-medium text-cream text-4xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
              {c.finalTitle}
            </h2>
            <p className="font-body text-cream/85 mt-5 text-base tracking-wide">
              {c.finalSubtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <Link
                href="/sobe"
                className="font-body uppercase tracking-[0.15em] text-xs px-6 py-3.5 transition-colors duration-300 bg-terracotta hover:bg-terracotta/90 text-cream"
              >
                {c.ctaPrimary}
              </Link>
              <ReservationButtons />
            </div>
          </div>
        </div>

        <div
          ref={hintRef}
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function StillHeroFallback() {
  const messages = useMessages();
  const c = messages.home.scrollHero;
  return (
    <section
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-coffee"
      aria-label={`${c.introTitle}. ${c.introSubtitle}.`}
    >
      <Image
        className="object-cover"
        src={VIDEO_POSTER}
        alt=""
        fill
        preload
        sizes="100vw"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(44,31,23,0.82) 0%, rgba(44,31,23,0.3) 50%, rgba(44,31,23,0.55) 100%)',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <IntroFallbackContent />
      </div>
    </section>
  );
}

function IntroFallbackContent() {
  const messages = useMessages();
  const c = messages.home.scrollHero;
  return (
    <div className="relative w-full max-w-[min(90vw,42rem)] border border-honey/45 bg-coffee/50 px-7 py-9 backdrop-blur-[2px] sm:px-16 sm:py-14">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[9px] border border-cream/20"
      />
      <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-5">
        {c.introEyebrow}
      </p>
      <h1 className="font-display italic font-medium text-cream text-5xl sm:text-7xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
        {c.introTitle}
      </h1>
      <p className="font-body text-cream/85 uppercase tracking-[0.18em] text-xs sm:text-sm mt-6">
        {c.introSubtitle}
      </p>
      <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/sobe"
          className="font-body uppercase tracking-[0.15em] text-xs px-6 py-3.5 transition-colors duration-300 bg-terracotta hover:bg-terracotta/90 text-cream"
        >
          {c.ctaPrimary}
        </Link>
        <ReservationButtons />
      </div>
    </div>
  );
}
