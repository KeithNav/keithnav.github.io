import { readdir } from 'node:fs/promises';
import { extname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url));
const contentImages = new Set([
  'image.jpg',
  'klimatrikk5.png',
  'pfavicon.png',
  'pointout-logo.png',
  'bellawell-logo.png',
  'logojo_decreased.png',
  'operating-systems-basics.png',
  'it-essentials.png',
  'ccna-introduction-to-networks.png',
  'ccna-switching-routing-and-wireless-essentials.1.png',
  'introduction-to-cybersecurity.png',
  'introduction-to-modern-ai.png',
]);

const files = await readdir(sourceDirectory);
const sourceImages = files.filter((file) => contentImages.has(file));

await Promise.all(sourceImages.map(async (file) => {
  const extension = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(extension)) return;

  const outputFile = `${parse(file).name}.webp`;
  await sharp(join(sourceDirectory, file))
    .webp({ quality: 82, effort: 6 })
    .toFile(join(sourceDirectory, outputFile));
  console.log(`${file} -> ${outputFile}`);
}));