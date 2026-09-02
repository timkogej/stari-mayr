/**
 * One-off asset prep for the Stari Mayr wordmark.
 *
 * The two supplied logo variants were exported from different artboards: on the
 * shared 2172x724 canvas the black artwork sits at (4,75)-(2155,623) while the
 * beige sits at (37,98)-(2115,620) — a different scale AND a different offset.
 * Rendered at a common height that mismatch shows up as a visible jump when the
 * header cross-fades between them on scroll.
 *
 * The beige file additionally carries a wash of alpha==1 pixels running to the
 * bottom edge of the canvas. It is invisible, but it defeats naive trimming:
 * an alpha>0 bounding box reports the beige artwork as 628px tall instead of
 * its true 522px, so a plain `.trim()` would crop it ~20% too tall and make the
 * misalignment far worse. Hence the alpha threshold below.
 *
 * This normalises both variants to one canvas with the ink at one scale, so the
 * cross-fade is pure opacity: no shift, no scale pop.
 *
 * Reads assets/images/_orig/ and writes public/images/ — safe to re-run.
 *
 *   node scripts/normalize-logo.mjs
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'assets/images/_orig');
const OUT_DIR = path.join(ROOT, 'public/images');
const FILES = ['stari-mayr-logo-black.png', 'stari-mayr-logo-beige.png'];

/** Reject the invisible alpha<=16 haze while keeping genuine antialiasing. */
const ALPHA_THRESHOLD = 16;
/** Antialias safety margin re-added around the thresholded box, in px. */
const MARGIN = 2;

async function tightCrop(file) {
  const img = sharp(path.join(SRC_DIR, file)).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let top = height, left = width, bottom = -1, right = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + channels - 1] > ALPHA_THRESHOLD) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  const box = {
    left: Math.max(0, left - MARGIN),
    top: Math.max(0, top - MARGIN),
    right: Math.min(width, right + 1 + MARGIN),
    bottom: Math.min(height, bottom + 1 + MARGIN),
  };
  return {
    file,
    width: box.right - box.left,
    height: box.bottom - box.top,
    buffer: await sharp(path.join(SRC_DIR, file))
      .extract({
        left: box.left,
        top: box.top,
        width: box.right - box.left,
        height: box.bottom - box.top,
      })
      .png()
      .toBuffer(),
  };
}

const crops = await Promise.all(FILES.map(tightCrop));
for (const c of crops) {
  console.log(`${c.file}: ink ${c.width}x${c.height} (aspect ${(c.width / c.height).toFixed(4)})`);
}

// Match ink scale by normalising to a common height, then pad to a common
// width with the ink centred, so both files end up pixel-for-pixel congruent.
const targetHeight = Math.max(...crops.map((c) => c.height));
const scaled = await Promise.all(
  crops.map(async (c) => {
    const width = Math.round((c.width * targetHeight) / c.height);
    return {
      file: c.file,
      width,
      buffer: await sharp(c.buffer).resize(width, targetHeight, { kernel: 'lanczos3' }).png().toBuffer(),
    };
  })
);

const targetWidth = Math.max(...scaled.map((s) => s.width));
for (const s of scaled) {
  const padLeft = Math.floor((targetWidth - s.width) / 2);
  await sharp(s.buffer)
    .extend({
      left: padLeft,
      right: targetWidth - s.width - padLeft,
      top: 0,
      bottom: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, s.file));
  console.log(`${s.file} -> ${targetWidth}x${targetHeight}`);
}

console.log(`\nKeep LOGO_WIDTH/LOGO_HEIGHT in src/components/shared/Logo.tsx at ${targetWidth}x${targetHeight}.`);
