import { Router } from 'express';
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from 'mercadopago';
import mercadopago from '../utils/mpClient.js';

const router = Router();

/**
 * POST /api/payments
 * Body: { amount: number, description?: string }
 * Creates a Mercado Pago payment preference and returns init_point.
 */
router.post('/', async (req, res, next) => {
  try {
    const { amount, description = 'Pago' } = req.body;
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Invalid or missing amount' });
    }

    const preference = {
      items: [
        {
          title: description,
          unit_price: Number(amount),
          quantity: 1,
        },
      ],
    };

    const response = await mercadopago.Preference.create({ body: preference });
    console.log('MercadoPago Response:', JSON.stringify(response, null, 2));
    const body = response.body || response;
    const { id, init_point } = body;
    res.json({ id, init_point });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/payments/webhook
 * Recibe las notificaciones de Mercado Pago para TODOS los productos
 * (Checkout Pro, QR y Point) — se configura una única URL en el panel de
 * la aplicación (Tus integraciones > Webhooks), y el campo `data.type` (o
 * `type`/`action` para eventos viejos) indica de qué se trata.
 *
 * Mercado Pago firma las notificaciones de Point y de Checkout ("online")
 * con el header `x-signature`, pero las de QR NO vienen firmadas — por eso
 * la validación se saltea puntualmente cuando `data.type === 'qr'`
 * (ver el propio doc-comment de WebhookSignatureValidator en el SDK).
 */
router.post('/webhook', async (req, res) => {
  try {
    const { type, action, data } = req.body || {};
    const dataId = req.query['data.id'] || data?.id;
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];
    const isQr = data?.type === 'qr';

    if (!isQr) {
      if (process.env.MP_WEBHOOK_SECRET) {
        try {
          WebhookSignatureValidator.validate({
            xSignature,
            xRequestId,
            dataId,
            secret: process.env.MP_WEBHOOK_SECRET,
          });
        } catch (err) {
          if (err instanceof InvalidWebhookSignatureError) {
            console.warn('Webhook rechazado por firma inválida:', err.reason, '· request-id:', xRequestId);
            return res.status(401).json({ error: 'invalid signature' });
          }
          throw err;
        }
      } else {
        console.warn(
          'MP_WEBHOOK_SECRET no está configurado en server/.env: esta notificación NO fue validada. ' +
            'Configuralo antes de usar esto en producción (Tus integraciones > Webhooks > Configurar notificaciones).'
        );
      }
    }

    console.log('Webhook Mercado Pago:', { type, action, dataId, orderType: data?.type });

    // TODO: acá va la lógica real de tu negocio — por ejemplo, buscar la
    // venta por `external_reference` (el id que le diste a la orden al
    // crearla) y marcarla como pagada cuando el status sea "processed".

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handling error', error);
    // Devolvemos 200 igual: si el fallo es nuestro (no de la firma), no
    // tiene sentido que Mercado Pago reintente en bucle. El error queda
    // en el log del server para revisarlo.
    res.status(200).json({ received: true, error: 'internal_logging_error' });
  }
});

export default router;
