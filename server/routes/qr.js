import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { orderClient, toAmountString } from '../utils/mpClient.js';
import { generateQrImage } from '../utils/qr.js';

const router = Router();

const DEFAULT_EXPIRATION = 'PT15M'; // 15 minutos (formato de duración ISO 8601)

/**
 * POST /api/payments/qr
 * Body: { amount, description?, external_reference?, items?, expiration_time? }
 *
 * Crea una orden tipo "qr" (código QR dinámico) por el monto exacto de la
 * venta y devuelve la imagen del QR lista para mostrar en pantalla.
 *
 * Requiere que exista una Tienda + Caja (POS) en la cuenta de Mercado Pago
 * (ver server/scripts/setup-qr-pos.mjs) y su `external_pos_id` cargado en
 * MP_QR_EXTERNAL_POS_ID dentro de server/.env.
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      amount,
      description = 'Venta almacén',
      external_reference = randomUUID(),
      items,
      expiration_time = DEFAULT_EXPIRATION,
    } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'amount inválido o ausente' });
    }

    if (!process.env.MP_QR_EXTERNAL_POS_ID) {
      return res.status(400).json({
        error:
          'Falta MP_QR_EXTERNAL_POS_ID en server/.env. Corré "node scripts/setup-qr-pos.mjs" una vez ' +
          'para crear la Tienda y la Caja (POS) en Mercado Pago, y copiá el external_pos_id que imprime.',
      });
    }

    const amountStr = toAmountString(amount);

    const body = {
      type: 'qr',
      total_amount: amountStr,
      description,
      external_reference,
      expiration_time,
      currency: process.env.MP_CURRENCY || 'CLP',
      config: {
        qr: {
          external_pos_id: process.env.MP_QR_EXTERNAL_POS_ID,
          mode: 'dynamic', // un QR nuevo por venta, con el monto ya incluido
        },
      },
      transactions: { payments: [{ amount: amountStr }] },
      items: items?.length ? items : [{ title: description, unit_price: amountStr, quantity: 1 }],
    };

    // El idempotency key se ata a la venta: si el front reintenta la misma
    // petición (por un timeout de red, por ej.) no se genera un cobro duplicado.
    const order = await orderClient.create({ body, requestOptions: { idempotencyKey: external_reference } });

    const qrData = order?.type_response?.qr_data;
    const qrImage = qrData ? await generateQrImage(qrData) : null;

    res.status(201).json({
      orderId: order.id,
      status: order.status, // created -> processed | expired | cancelled
      statusDetail: order.status_detail,
      externalReference: order.external_reference,
      totalAmount: order.total_amount,
      qrData,
      qrImage, // data:image/png;base64,... — listo para <img src="">
      expiresIn: expiration_time,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
