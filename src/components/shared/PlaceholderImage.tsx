'use client';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Aspect = 'square' | 'video' | 'portrait' | 'landscape' | 'hero';

const aspectClasses: Record<Aspect, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  hero: 'aspect-[21/9]',
};

type Props = {
  label: string;
  aspect?: Aspect;
  className?: string;
};

export function PlaceholderImage({ label, aspect = 'landscape', className }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border border-sand',
        aspectClasses[aspect],
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #F5EFE6 0%, #E8DCC4 100%)',
      }}
    >
      {/* Diagonal stripe pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #5C4530 0, #5C4530 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <ImageIcon className="w-8 h-8 text-walnut opacity-40" strokeWidth={1} />
        <span className="font-body text-xs uppercase tracking-widest text-walnut opacity-50 text-center leading-relaxed max-w-[160px]">
          {label}
        </span>
      </div>
    </div>
  );
}
