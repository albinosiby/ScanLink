const test = require('node:test');
const assert = require('node:assert/strict');
const { createQrCode } = require('../src/services/qr.service');

test('creates PNG and SVG output with selected options', async () => {
  const result = await createQrCode('https://example.com/', {
    foreground: '#16213e',
    background: '#ffffff',
    size: 256,
    errorCorrectionLevel: 'H'
  });

  assert.match(result.png, /^data:image\/png;base64,/);
  assert.match(result.svg, /<svg[\s>]/);
  assert.equal(result.options.size, 256);
});

test('rejects unsupported QR options', async () => {
  await assert.rejects(() => createQrCode('https://example.com/', { size: 300 }), /supported QR code size/);
});
