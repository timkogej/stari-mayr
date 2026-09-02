import { getLocale, getMessages } from 'next-intl/server';

export async function StructuredData() {
  const locale = await getLocale();
  const messages = await getMessages();
  const sd = messages.structuredData;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': 'https://stari-mayr.si/#lodging',
    name: 'Stari Mayr',
    description: messages.site.description,
    inLanguage: locale,
    url: locale === 'sl' ? 'https://stari-mayr.si' : 'https://stari-mayr.si/en',
    telephone: '+386 40 420 262',
    address: {
      '@type': 'PostalAddress',
      // TODO: dopolni streetAddress, postalCode, geo koordinate
      addressLocality: 'Kranj',
      addressCountry: 'SI',
    },
    foundingDate: '1852',
    numberOfRooms: 8,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: sd.wifi, value: true },
      { '@type': 'LocationFeatureSpecification', name: sd.breakfast, value: true },
      { '@type': 'LocationFeatureSpecification', name: sd.garden, value: true },
      { '@type': 'LocationFeatureSpecification', name: sd.petsAllowed, value: true },
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
