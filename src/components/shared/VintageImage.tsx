import { PlaceholderImage } from './PlaceholderImage';
import { cn } from '@/lib/utils';

type Aspect = 'square' | 'video' | 'portrait' | 'landscape' | 'hero';

type Props = {
  label: string;
  aspect?: Aspect;
  className?: string;
};

export function VintageImage({ label, aspect = 'landscape', className }: Props) {
  return (
    <div className={cn('vintage-photo relative', className)}>
      <PlaceholderImage label={label} aspect={aspect} />
    </div>
  );
}
