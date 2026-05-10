'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const h = messages.home.hero;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #3B4A3F 0%, #2C1F17 40%, #5C4530 100%)',
          }}
        />
        <Image
          src="/images/mayr-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65"
        />
        {/* Diagonal stripe texture over bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #F5EFE6 0, #F5EFE6 1px, transparent 0, transparent 50%)',
            backgroundSize: '14px 14px',
          }}
        />
        <div className="absolute inset-0 bg-coffee/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center py-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-script text-honey text-2xl mb-6"
        >
          {h.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display font-light text-cream tracking-[0.4em] text-5xl md:text-7xl"
        >
          {h.title}
        </motion.h1>

        {/* Ornament divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-4 my-6"
        >
          <div className="h-px w-16 bg-honey/60" />
          <span className="text-honey text-xs">◆</span>
          <div className="h-px w-16 bg-honey/60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display italic font-medium text-cream text-6xl md:text-8xl"
        >
          {h.wordmark}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-body text-cream/70 uppercase tracking-widest text-xs mt-6 mb-8"
        >
          {h.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ReservationButtons variant="both" context="dark" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50"
      >
        <span className="font-script text-sm">{h.scrollLabel}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
