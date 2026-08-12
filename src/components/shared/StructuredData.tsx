export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Stari Mayr',
    description: 'Prenočišče v stoletni hiši v starem mestnem jedru Kranja.',
    url: 'https://stari-mayr.si',
    telephone: '+386 40 420 262',
    address: {
      '@type': 'PostalAddress',
      // TODO: dopolni streetAddress, postalCode, geo koordinate
      addressLocality: 'Kranj',
      addressCountry: 'SI',
    },
    numberOfRooms: 8,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Brezplačen WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Zajtrk', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Vrt', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Hišni ljubljenčki dovoljeni', value: true },
    ],
    petsAllowed: true,
    smokingAllowed: false,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
