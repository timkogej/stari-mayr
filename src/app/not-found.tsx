import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center px-6">
        <p className="font-script text-honey text-2xl mb-4">404</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-coffee mb-6 tracking-wide">
          Stran ni bila najdena
        </h1>
        <p className="font-body text-walnut mb-8">Ta stran ne obstaja. Morda ste zašli?</p>
        <Link
          href="/"
          className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
        >
          Nazaj na domov →
        </Link>
      </div>
    </div>
  );
}
