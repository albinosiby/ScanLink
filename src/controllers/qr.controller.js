const { normalizeUrl } = require('../utils/url-validator');
const { createQrCode } = require('../services/qr.service');

async function generateQr(req, res, next) {
  try {
    const url = normalizeUrl(req.body?.url);
    const qr = await createQrCode(url, req.body?.options);
    res.status(200).json({ url, ...qr });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

module.exports = { generateQr };
