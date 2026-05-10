'use client';
import { cn } from '@/lib/utils';

type Props = {
  caption: string;
  rotation?: number;
  className?: string;
  children: React.ReactNode;
};

export function Polaroid({ caption, rotation = 0, className, children }: Props) {
  return (
    <div
      className={cn('group inline-block', className)}
      style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 600ms ease, box-shadow 600ms ease' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${rotation}deg) translateY(0)`;
      }}
    >
      <div
        className="relative"
        style={{
          background: '#FDFCF7',
          padding: '12px 12px 50px',
          boxShadow: '0 12px 30px -10px rgba(0,0,0,0.25)',
        }}
      >
        {/* Paper texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #5C4530 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
        <div className="relative">{children}</div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center h-[50px]">
          <span className="font-script text-walnut text-base">{caption}</span>
        </div>
      </div>
    </div>
  );
}
