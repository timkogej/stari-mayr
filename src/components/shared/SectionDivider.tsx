import { cn } from '@/lib/utils';

type Props = { className?: string };

export function SectionDivider({ className }: Props) {
  return (
    <div className={cn('flex items-center justify-center gap-4 py-2', className)}>
      <div className="h-px flex-1 max-w-32 bg-sand" />
      <span className="text-honey text-xs">◆</span>
      <div className="h-px flex-1 max-w-32 bg-sand" />
    </div>
  );
}
