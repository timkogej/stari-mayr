'use client';

type Variant = 'both' | 'table' | 'room';
type Context = 'light' | 'dark';

type Props = {
  variant?: Variant;
  context?: Context;
};

export function ReservationButtons({ variant = 'both', context = 'light' }: Props) {
  // TODO: hook up to booking system or external platform
  const handleTableReservation = () => {};
  const handleRoomReservation = () => {};

  const baseStyle = 'font-body uppercase tracking-[0.15em] text-xs px-5 py-3 transition-all duration-300 cursor-pointer border';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {(variant === 'both' || variant === 'table') && (
        <button
          type="button"
          onClick={handleTableReservation}
          className={`${baseStyle} bg-terracotta hover:bg-terracotta/90 text-cream border-terracotta`}
        >
          Rezerviraj mizo
        </button>
      )}
      {(variant === 'both' || variant === 'room') && (
        <button
          type="button"
          onClick={handleRoomReservation}
          className={context === 'dark'
            ? `${baseStyle} bg-transparent border-cream text-cream hover:bg-cream hover:text-coffee`
            : `${baseStyle} bg-transparent border-bronze text-bronze hover:bg-bronze hover:text-cream`
          }
        >
          Rezerviraj sobo
        </button>
      )}
    </div>
  );
}
