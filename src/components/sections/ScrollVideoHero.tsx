'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { getMessages } from '@/lib/content';
import {
  usePrefersReducedMotion,
  useIsTouchDevice,
  clamp,
  ramp,
  smooth,
  lerp,
} from '@/hooks/useScrollScrubVideo';

const messages = getMessages();
const c = messages.home.scrollHero;

const VIDEO_1 = '/videos/stari-mayr-scroll-01.mp4';
const VIDEO_2 = '/videos/stari-mayr-scroll-02.mp4';

/**
 * Scroll timeline (fraction of total section scroll):
 *  0.00 – 0.35  scrub video 1 from start to end
 *  0.35 – 0.48  hold video 1 final frame, reveal midpoint overlay
 *  0.48 – 0.55  fade out midpoint overlay, crossfade into video 2
 *  0.55 – 0.88  scrub video 2 from start to end
 *  0.88 – 1.00  hold video 2 final frame, reveal final overlay + CTA
 */
const V1_END = 0.35;
const V2_START = 0.55;
const V2_END = 0.88;
// Trim a hair off the duration so a finished video never snaps back to frame 0.
const EPSILON = 0.05;
// How quickly each frame eases toward the scroll target (lower = smoother/softer).
const SCRUB_EASE = 0.1;

export function ScrollVideoHero() {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  // Scroll-scrubbing is desktop-only. On touch devices (and when the user asks
  // for reduced motion) we serve a plain playing video instead.
  if (reducedMotion || isTouch) {
    return <StaticHeroFallback autoPlayLoop={!reducedMotion} />;
  }

  return <ScrubHero />;
}

/* -------------------------------------------------------------------------- */
/*  Cinematic scroll-scrub hero (default experience)                          */
/* -------------------------------------------------------------------------- */

function ScrubHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const gradientRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const midpointRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    if (!section || !video1 || !video2) return;

    let rafId = 0;
    let active = false;

    // Smoothed currentTime values we lerp toward the scroll target each frame.
    let smoothed1 = 0;
    let smoothed2 = 0;

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

      const dur1 = durationOf(video1);
      const dur2 = durationOf(video2);

      // --- Video scrub targets -------------------------------------------
      if (dur1) {
        const target1 = ramp(p, 0, V1_END) * dur1;
        const clamped1 = Math.min(target1, dur1 - EPSILON);
        smoothed1 = lerp(smoothed1, clamped1, SCRUB_EASE);
        seek(video1, smoothed1);
      }
      if (dur2) {
        const target2 = ramp(p, V2_START, V2_END) * dur2;
        const clamped2 = Math.min(target2, dur2 - EPSILON);
        smoothed2 = lerp(smoothed2, clamped2, SCRUB_EASE);
        seek(video2, smoothed2);
      }

      // --- Crossfade video 1 -> video 2 ----------------------------------
      const v2Opacity = smooth(ramp(p, V1_END + 0.13, V2_START));
      if (video2) video2.style.opacity = String(v2Opacity);

      // --- Intro overlay ("Stari Mayr") ----------------------------------
      // Gentle, elegant exit: a longer fade with a soft upward lift as you scroll.
      const introLeave = smooth(ramp(p, 0.04, 0.22));
      const introOpacity = 1 - introLeave;
      const introY = -introLeave * 52;
      if (introRef.current) {
        introRef.current.style.opacity = String(introOpacity);
        introRef.current.style.transform = `translate3d(0, ${introY}px, 0)`;
        introRef.current.style.pointerEvents = introOpacity < 0.05 ? 'none' : 'auto';
      }

      // --- Midpoint overlay ----------------------------------------------
      // Hold the text through the crossfade and a few frames into video 2, then
      // let it fade out while the next clip has already started playing.
      const midEnter = smooth(ramp(p, V1_END, 0.41));
      const midExit = smooth(ramp(p, V2_START, 0.62));
      const midOpacity = midEnter * (1 - midExit);
      const midY = (1 - midEnter) * 28 - midExit * 28;
      if (midpointRef.current) {
        midpointRef.current.style.opacity = String(midOpacity);
        midpointRef.current.style.transform = `translate3d(0, ${midY}px, 0)`;
      }

      // --- Final overlay + CTA -------------------------------------------
      // Reveal earlier and hold the fully-formed final frame for the last ~15%
      // of the scroll so the sequence clearly settles before the page continues.
      const finalEnter = smooth(ramp(p, 0.85, 0.92));
      const finalY = (1 - finalEnter) * 28;
      if (finalRef.current) {
        finalRef.current.style.opacity = String(finalEnter);
        finalRef.current.style.transform = `translate3d(0, ${finalY}px, 0)`;
        finalRef.current.style.pointerEvents = finalEnter > 0.5 ? 'auto' : 'none';
      }

      // --- Readability gradient strength ---------------------------------
      if (gradientRef.current) {
        const boost = Math.max(introOpacity, midOpacity, finalEnter);
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

    // Initialise both videos to their first frame once metadata is ready.
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
    initVideo(video1);
    initVideo(video2);

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
      className="relative h-[650vh] bg-coffee"
      aria-label={`${c.midpointTitle}. ${c.finalTitle}.`}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-coffee"
      >
        {/* Video 1 — base layer */}
        <video
          ref={video1Ref}
          className="warm-analog absolute inset-0 h-full w-full object-cover"
          src={VIDEO_1}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        {/* Video 2 — crossfaded above video 1 */}
        <video
          ref={video2Ref}
          className="warm-analog absolute inset-0 h-full w-full object-cover opacity-0 will-change-[opacity]"
          src={VIDEO_2}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Warm analog grade: warm wash, then subtle grain + soft vignette */}
        <div className="warm-analog-wash absolute inset-0" aria-hidden="true" />
        <div className="warm-analog-grain absolute inset-0" aria-hidden="true" />

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
            <p className="font-script text-honey text-xl sm:text-2xl mb-5">
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

        {/* Midpoint overlay */}
        <div
          ref={midpointRef}
          className="absolute inset-0 flex items-center justify-center px-6 text-center will-change-[opacity,transform]"
          style={{ opacity: 0 }}
        >
          <div className="relative max-w-2xl bg-coffee/50 px-10 py-12 backdrop-blur-[2px] sm:px-16 sm:py-14 border border-honey/45">
            {/* Inner frame line for a classic, framed look */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[9px] border border-cream/20"
            />
            <h2 className="font-display italic font-medium text-cream text-4xl sm:text-6xl lg:text-7xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
              {c.midpointTitle}
            </h2>
            <p className="font-body text-cream/85 mt-6 text-base sm:text-lg tracking-wide">
              {c.midpointSubtitle}
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
              <Link
                href="/kontakt"
                className="font-body uppercase tracking-[0.15em] text-xs px-6 py-3.5 transition-colors duration-300 border border-cream/50 text-cream hover:bg-cream/10"
              >
                {c.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60"
        >
          <span className="font-script text-sm">{c.scrollLabel}</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Static fallback for prefers-reduced-motion                                */
/* -------------------------------------------------------------------------- */

function StaticHeroFallback({ autoPlayLoop = false }: { autoPlayLoop?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (autoPlayLoop) {
      // Muted + playsInline autoplay is allowed inline on iOS/Android. Kick it
      // off explicitly too, since some browsers ignore the autoplay attribute
      // when it's set after hydration.
      const tryPlay = () => v.play().catch(() => {});
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener('canplay', tryPlay, { once: true });
      return () => v.removeEventListener('canplay', tryPlay);
    }
    const onMeta = () => {
      try {
        v.currentTime = 0;
      } catch {
        /* ignored */
      }
    };
    if (v.readyState >= 1) onMeta();
    else v.addEventListener('loadedmetadata', onMeta, { once: true });
  }, [autoPlayLoop]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-coffee">
      <video
        ref={videoRef}
        className="warm-analog absolute inset-0 h-full w-full object-cover"
        src={VIDEO_1}
        muted
        playsInline
        preload="auto"
        autoPlay={autoPlayLoop}
        loop={autoPlayLoop}
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="warm-analog-wash absolute inset-0" aria-hidden="true" />
      <div className="warm-analog-grain absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(44,31,23,0.82) 0%, rgba(44,31,23,0.3) 50%, rgba(44,31,23,0.55) 100%)',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display italic font-medium text-cream text-4xl sm:text-6xl lg:text-7xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
          {c.finalTitle}
        </h1>
        <p className="font-body text-cream/85 mt-6 max-w-xl text-base sm:text-lg tracking-wide">
          {c.finalSubtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/sobe"
            className="font-body uppercase tracking-[0.15em] text-xs px-6 py-3.5 transition-colors duration-300 bg-terracotta hover:bg-terracotta/90 text-cream"
          >
            {c.ctaPrimary}
          </Link>
          <Link
            href="/kontakt"
            className="font-body uppercase tracking-[0.15em] text-xs px-6 py-3.5 transition-colors duration-300 border border-cream/50 text-cream hover:bg-cream/10"
          >
            {c.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
