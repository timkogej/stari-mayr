'use client';

export function ReservationButtons() {
  // TODO: hook up to booking system or external platform
  const handleRoomReservation = () => {};

  return (
    <button
      type="button"
      onClick={handleRoomReservation}
      className="font-body uppercase tracking-[0.15em] text-xs px-5 py-3 transition-colors duration-300 bg-terracotta hover:bg-terracotta/90 text-cream"
    >
      Rezerviraj sobo
    </button>
  );
}
