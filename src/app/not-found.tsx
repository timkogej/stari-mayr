import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="sl">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '0 1.5rem' }}>
            <p>404</p>
            <h1>Stran ni bila najdena / Page not found</h1>
            <Link href="/">Nazaj na domov / Back home</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
