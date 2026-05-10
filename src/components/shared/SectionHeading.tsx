import { cn } from '@/lib/utils';

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  titleClass?: string;
};

export function SectionHeading({ eyebrow, title, lead, align = 'left', titleClass }: Props) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  return (
    <div className={cn('space-y-4', alignClass)}>
      {eyebrow && (
        <p className="font-display uppercase tracking-[0.3em] text-xs text-bronze">
          {eyebrow}
        </p>
      )}
      <h2 className={cn('font-display text-3xl md:text-4xl lg:text-5xl text-coffee tracking-wide leading-tight', titleClass)}>
        {title}
      </h2>
      {lead && (
        <p className={cn('font-body text-walnut leading-relaxed max-w-xl', align === 'center' && 'mx-auto')}>
          {lead}
        </p>
      )}
    </div>
  );
}
