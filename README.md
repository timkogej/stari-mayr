# Stari Mayr — Gostilna website

Premium traditional restaurant & inn website for Gostilna Stari Mayr.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · shadcn/ui (base-ui)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Replacing placeholder images

Every `<PlaceholderImage>` and `<VintageImage>` is a placeholder. To replace with a real photo:

1. Add the image to `/public/images/` (e.g. `hero.jpg`)
2. Replace the component with Next.js `<Image>`:

```tsx
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="Descriptive alt text"
  fill
  className="object-cover"
/>
```

Wrap in a `div` with `relative` and the desired aspect ratio class.

For vintage-effect real photos, wrap the image in `.vintage-photo`:

```tsx
<div className="vintage-photo relative aspect-[4/3] overflow-hidden">
  <Image src="/images/atrij-1987.jpg" alt="Atrij, 1987" fill className="object-cover" />
</div>
```

## Adding a new language

1. Duplicate `/messages/sl.json` to `/messages/en.json` and translate all values.
2. Update `/src/i18n/config.ts`:
   ```ts
   export const locales = ['sl', 'en'] as const;
   ```
3. Move all pages under `app/[locale]/` route segment.
4. Add a language switcher to the Header component.
5. Wire up `next-intl` middleware for locale detection.

## TODO

- [ ] Replace all `<PlaceholderImage>` with real photos
- [ ] Confirm exact address for Stari Mayr (update in messages/sl.json and Google Maps embed in kontakt/page.tsx)
- [ ] Add phone number to messages/sl.json
- [ ] Find exact Facebook page URL and update Footer.tsx and kontakt/page.tsx
- [ ] Hook up reservation buttons to a booking system
- [ ] Hook up contact form submission
