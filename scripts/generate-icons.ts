/**
 * Generate PWA icons (192/512 PNG) using the existing `qrcode` library.
 * The icon is a stylized QR rendering of "Uplatnica QR" — fits the brand
 * and works as a placeholder until a custom-designed icon ships.
 *
 * Run with: pnpm tsx scripts/generate-icons.ts
 */
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import QRCode from 'qrcode';

const dir = resolve(process.cwd(), 'public/icons');
await mkdir(dir, { recursive: true });

const colors = {
  dark: '#0a1f1a',
  light: '#ffffff',
};

await QRCode.toFile(resolve(dir, 'icon-192.png'), 'Uplatnica QR', {
  width: 192,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: colors,
});
await QRCode.toFile(resolve(dir, 'icon-512.png'), 'Uplatnica QR', {
  width: 512,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: colors,
});

// Also write apple-touch-icon (180x180 is the iOS recommended size)
await QRCode.toFile(resolve(dir, 'apple-touch-icon.png'), 'Uplatnica QR', {
  width: 180,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: colors,
});

console.info('Generated PWA icons in public/icons/');
