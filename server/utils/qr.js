import QRCode from 'qrcode';

/**
 * Convierte el string `qr_data` que devuelve la Orders API de Mercado Pago
 * (un payload EMV, no una URL) en una imagen PNG codificada en base64,
 * lista para usar en `<img src="...">` sin depender de servicios externos.
 */
export async function generateQrImage(qrData) {
  return QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 320,
  });
}
