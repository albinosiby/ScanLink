const path = require('path');
const express = require('express');
const qrRoutes = require('./routes/qr.routes');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
  });
  next();
});
app.use(express.json({ limit: '12kb', type: 'application/json' }));
app.use('/api/qr', qrRoutes);
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h', extensions: ['html'] }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unable to generate the QR code right now.' });
});

app.listen(port, () => console.log(`QRly is running at http://localhost:${port}`));
