'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'none';
};

export function FadeIn({ children, className, delay = 0, direction = 'up' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: direction === 'up' ? 20 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
