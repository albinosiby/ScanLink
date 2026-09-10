# QRly — QR Code Generator

QRly is a lightweight, privacy-first URL to QR Code generator. It validates website links, produces scan-safe PNG and SVG QR codes, and lets people customize color, size, and error correction before downloading.

## Features

- URL normalization (`example.com` becomes `https://example.com`)
- HTTP/HTTPS protocol validation and compact API responses
- High-quality PNG and SVG downloads with a built-in quiet zone
- Live customization of QR colors, size, and error correction
- Responsive, accessible neumorphic interface with reduced-motion support
- No accounts, database, or permanent URL storage

## Tech stack

- Node.js and Express
- Vanilla HTML, CSS, and JavaScript
- [`qrcode`](https://www.npmjs.com/package/qrcode) for generation
- Lucide icons, loaded from its CDN

## Project structure

```text
src/
  controllers/qr.controller.js  Request handling
  routes/qr.routes.js           API endpoint
  services/qr.service.js        QR generation and option checks
  utils/url-validator.js        Safe URL normalization
  server.js                     Express configuration
public/
  css/                          Design tokens, global and responsive styles
  js/app.js                     Browser interactions and downloads
  assets/                       Favicon
```

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev    # watch mode for development
npm start      # production server
npm test       # Node test runner (ready for test files)
```

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port for the Express server. |

## Deployment

Set `PORT` if your host requires it, install production dependencies with `npm ci --omit=dev`, and run `npm start`. The server serves the static site and `/api/qr` from one process. Before going live, replace `https://your-domain.example/` in `index.html`, `robots.txt`, and `sitemap.xml` with your public domain.

## Security and privacy

The API accepts only `http:` and `https:` addresses, restricts payload size, disables Express branding, and adds protective response headers. URLs are used only to generate the requested QR response; they are not stored.
