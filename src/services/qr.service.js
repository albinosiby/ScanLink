const QRCode = require('qrcode');

const validColors = /^#[0-9a-fA-F]{6}$/;
const validSizes = new Set([256, 512, 1024]);
const validLevels = new Set(['L', 'M', 'Q', 'H']);

function parseOptions(input = {}) {
  const size = Number(input.size);
  const foreground = input.foreground || '#16213e';
  const background = input.background || '#ffffff';
  const errorCorrectionLevel = input.errorCorrectionLevel || 'M';

  if (!validSizes.has(size)) throw new Error('Choose a supported QR code size.');
  if (!validColors.test(foreground) || !validColors.test(background)) {
    throw new Error('Use a valid six-digit hexadecimal color.');
  }
  if (!validLevels.has(errorCorrectionLevel)) throw new Error('Choose a supported error correction level.');

  return { size, foreground, background, errorCorrectionLevel };
}

async function createQrCode(url, inputOptions) {
  const options = parseOptions(inputOptions);
  const qrOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel,
    width: options.size,
    margin: 4,
    color: { dark: options.foreground, light: options.background }
  };

  const [png, svg] = await Promise.all([
    QRCode.toDataURL(url, { ...qrOptions, type: 'image/png' }),
    QRCode.toString(url, { ...qrOptions, type: 'svg' })
  ]);

  return { png, svg, options };
}

module.exports = { createQrCode };
