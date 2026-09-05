'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import mainHeroImage from '../../../public/images/stari-mayr-main-hero.jpeg';
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

  // The scroll-scrubbed video does not hold up on touch devices, and cropping
  // its landscape frames into a portrait phone viewport read poorly. Mobile
  // gets a still photograph with the same overlay choreography over it.
  if (isTouch) {
    return <MobileStaticHero />;
  }

  return <ScrubHero />;
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
      // Gentle, elegant exit: a longer fade with a soft upward lift as you scroll.
      const introLeave = smooth(ramp(p, 0.04, 0.2));
      const introOpacity = 1 - introLeave;
      const introY = -introLeave * 52;
      if (introRef.current) {
        introRef.current.style.opacity = String(introOpacity);
        introRef.current.style.transform = `translate3d(0, ${introY}px, 0)`;
        introRef.current.style.pointerEvents = introOpacity < 0.05 ? 'none' : 'auto';
      }

      // --- Final overlay + CTA -------------------------------------------
      // Fade in over the last stretch of the scrub, then hold through the tail.
      const finalEnter = smooth(ramp(p, SCRUB_END - 0.06, SCRUB_END));
      const finalY = (1 - finalEnter) * 28;
      if (finalRef.current) {
        finalRef.current.style.opacity = String(finalEnter);
        finalRef.current.style.transform = `translate3d(0, ${finalY}px, 0)`;
        finalRef.current.style.pointerEvents = finalEnter > 0.5 ? 'auto' : 'none';
      }

      // --- Readability gradient strength ---------------------------------
      if (gradientRef.current) {
        const boost = Math.max(introOpacity, finalEnter);
        gradientRef.current.style.opacity = String(0.34 + 0.34 * boost);
      }

      // --- Scroll hint ----------------------------------------------------
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - smooth(ramp(p, 0.02, 0.1)));
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
    const initVideo = (v: HTMLVideoElement) => {
      const onMeta = () => {
        try {
          v.currentTime = 0;
        } catch {
          /* seeking before ready — ignored */
        }
      };
      if (v.readyState >= 1) onMeta();
      else v.addEventListener('loadedmetadata', onMeta, { once: true });
    };
    initVideo(video);

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
      io.disconnect();
      stop();
    };
  }, []);

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

function MobileStaticHero() {
  const messages = useMessages();
  const c = messages.home.scrollHero;
  const sectionRef = useRef<HTMLElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Mobile timeline (fraction of total section scroll). The background is a
    // still photograph, so any stretch where neither overlay is moving reads as
    // scrolling gone dead — there is no animating image to confirm the gesture
    // did anything. The section is therefore shorter than the desktop scrub
    // (240svh, was 330svh) and the reveal lands earlier, which cuts that idle
    // middle from ~124svh of travel to ~48svh.
    //  0.04 - 0.24  intro clears
    //  0.24 - 0.58  image holds (the short remaining gap)
    //  0.58 - 0.68  final overlay + CTA reveal
    //  0.68 - 1.00  hold the CTA through the tail
    // Thresholds widen as the section shrinks: the fades are tuned in absolute
    // scroll distance, and a fraction of a shorter section is fewer pixels.
    const INTRO_LEAVE_END = 0.24;
    const REVEAL_AT = 0.68;
    const REVEAL_FADE = 0.1;

    let rafId = 0;
    let active = false;

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return clamp(-rect.top / scrollable);
    };

    // Last values handed to the compositor. Rewriting a style property with the
    // string it already holds still dirties the element, so each is written only
    // when it has actually moved.
    let lastIntroOpacity = -1;
    let lastFinalEnter = -1;
    let lastGradient = -1;
    let lastHint = -1;
    let lastProgress = -1;
    /** Below this, a change is far too small to be visible. */
    const STYLE_EPSILON = 0.002;
    const moved = (next: number, prev: number) =>
      Math.abs(next - prev) > STYLE_EPSILON;

    /**
     * A panel that is fully faded out still costs the compositor its
     * backdrop-filter blur on every repaint underneath it. Dropping the filter
     * while it is invisible is free visually.
     */
    const setPanelVisibility = (el: HTMLElement, opacity: number, y: number) => {
      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      const hidden = opacity < 0.05;
      el.style.pointerEvents = hidden ? 'none' : 'auto';
      el.style.backdropFilter = hidden ? 'none' : '';
    };

    const render = () => {
      const p = computeProgress();

      // Parked mid-hero - nothing downstream of progress can have changed.
      if (p !== lastProgress) {
        lastProgress = p;

        const introLeave = smooth(ramp(p, 0.04, INTRO_LEAVE_END));
        const introOpacity = 1 - introLeave;
        if (introRef.current && moved(introOpacity, lastIntroOpacity)) {
          lastIntroOpacity = introOpacity;
          setPanelVisibility(introRef.current, introOpacity, -introLeave * 42);
        }

        const finalEnter = smooth(ramp(p, REVEAL_AT - REVEAL_FADE, REVEAL_AT));
        if (finalRef.current && moved(finalEnter, lastFinalEnter)) {
          lastFinalEnter = finalEnter;
          setPanelVisibility(finalRef.current, finalEnter, (1 - finalEnter) * 24);
        }

        const gradient = 0.36 + 0.36 * Math.max(introOpacity, finalEnter);
        if (gradientRef.current && moved(gradient, lastGradient)) {
          lastGradient = gradient;
          gradientRef.current.style.opacity = String(gradient);
        }

        const hint = 1 - smooth(ramp(p, 0.02, 0.1));
        if (hintRef.current && moved(hint, lastHint)) {
          lastHint = hint;
          hintRef.current.style.opacity = String(hint);
        }
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
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[240svh] bg-coffee"
      aria-label={`${c.introTitle}. ${c.finalTitle}.`}
    >
      <div className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden bg-coffee">
        {/* CROP POSITION — wide landscape source cropped into a portrait phone
            viewport. Currently 14%: the church steeple whole (finial, clock
            face and roof, which 15% clipped on its left edge), the sunlit
            cobbled street and its pastel houses, and the left half of the
            hanging sign — cutlery mark and 'Stari M', the rest of the
            lettering running off the right edge.
            The tower occupies 10.5-15.5% of the source, so 14% is the highest
            value that clears it; below ~13% the sign starts losing letters for
            nothing but extra sky. Direction matters: street and tower live at
            0-22% of the source and the sign at 27-42%, so LOWER values pan
            toward the town, higher ones toward the sign and then bare wall
            (45% loses the town entirely and still clips the sign). The
            viewport shows only ~26% of the source width while tower and sign
            together span ~31%, so no value fits both whole — 20% is the
            nearest alternative, trading the steeple for the full 'Stari Mayr'
            lettering. Adjust just this. */}
        <Image
          className="object-cover"
          style={{ objectPosition: '14% center' }}
          src={mainHeroImage}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          aria-hidden="true"
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
