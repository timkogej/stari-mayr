/**
 * Favicon / app-icon generation for Stari Mayr.
 *
 * The source is the circular knife-and-fork emblem from the sign outside the
 * building: black ring, off-white disc, red ribbon, transparent outside the
 * circle.
 *
 * Three outputs, matching Next.js's app-directory file conventions
 * (app/favicon.ico, app/icon.png, app/apple-icon.png) — Next picks these up
 * automatically and emits the <link> tags, so no manual tags in any layout.
 *
 * The .ico embeds PNG-compressed entries at 16/32/48. That form is understood
 * by every browser in use and by Windows Vista onward, and keeps the file two
 * orders of magnitude smaller than BMP-encoded entries would.
 *
 * apple-icon is flattened onto cream: iOS composites transparent pixels itself
 * and older versions fill them black, which would frame the emblem in a dark
 * square on the home screen.
 *
 * Reads assets/images/_orig/ and writes src/app/ — safe to re-run.
 *
 *   node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'assets/images/_orig/stari-mayr-favicon.png');
const OUT_DIR = path.join(ROOT, 'src/app');

/** --color-cream from globals.css, so the iOS tile matches the site ground. */
const CREAM = { r: 0xf5, g: 0xef, b: 0xe6, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const ICO_SIZES = [16, 32, 48];
const ICON_SIZE = 192;
const APPLE_SIZE = 180;

const render = (size, background) =>
  sharp(SRC)
    .resize(size, size, { fit: 'contain', background })
    .png({ compressionLevel: 9 })
    .toBuffer();

/** Multi-resolution ICO container holding PNG-compressed images. */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon (2 would be cursor)
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(16 * entries.length);
  let offset = header.length + directory.length;

  entries.forEach(({ size, data }, i) => {
    const at = i * 16;
    // 0 encodes 256 in the single-byte dimension fields; our sizes are smaller.
    directory.writeUInt8(size >= 256 ? 0 : size, at);
    directory.writeUInt8(size >= 256 ? 0 : size, at + 1);
    directory.writeUInt8(0, at + 2); // palette entries (0 = truecolour)
    directory.writeUInt8(0, at + 3); // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(data.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...entries.map((e) => e.data)]);
}

const icoEntries = [];
for (const size of ICO_SIZES) {
  icoEntries.push({ size, data: await render(size, TRANSPARENT) });
}
writeFileSync(path.join(OUT_DIR, 'favicon.ico'), buildIco(icoEntries));
writeFileSync(path.join(OUT_DIR, 'icon.png'), await render(ICON_SIZE, TRANSPARENT));
writeFileSync(
  path.join(OUT_DIR, 'apple-icon.png'),
  await sharp(SRC)
    .resize(APPLE_SIZE, APPLE_SIZE, { fit: 'contain', background: CREAM })
    .flatten({ background: CREAM })
    .png({ compressionLevel: 9 })
    .toBuffer()
);

console.log(`favicon.ico    ${ICO_SIZES.join('/')} (PNG-in-ICO)`);
console.log(`icon.png       ${ICON_SIZE}x${ICON_SIZE} (alpha preserved)`);
console.log(`apple-icon.png ${APPLE_SIZE}x${APPLE_SIZE} (flattened onto cream)`);
