import { Router } from 'express';
import { orderClient, mpFetch } from '../utils/mpClient.js';

const router = Router();

/**
 * GET /api/payments/orders/:id
 * Consulta el estado de una orden. Sirve tanto para QR como para Point
 * (y para Checkout API si más adelante se migra la Preference actual).
 * Pensado para hacer polling desde el front mientras se espera el pago.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderClient.get({ id: req.params.id });
    res.json({
      orderId: order.id,
      type: order.type,
      status: order.status,
      statusDetail: order.status_detail,
      totalAmount: order.total_amount,
      totalPaidAmount: order.total_paid_amount,
      externalReference: order.external_reference,
      transactions: order.transactions,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/payments/orders/:id/simulate
 * Body opcional: { status?, status_detail?, payment_method_type?, payment_method_id?, installments? }
 *
 * Simula el resultado final de una orden Point (aprobado, rechazado, etc.)
 * sin necesidad del dispositivo físico.
 *
 * ⚠️ SOLO funciona con un Access Token de PRUEBA (empieza con "TEST-").
 * Con el Access Token de producción (APP_USR-...) Mercado Pago responde
 * con error — es una protección propia de ellos para que no se pueda
 * "simular" un cobro real.
 */
router.post('/:id/simulate', async (req, res, next) => {
  try {
    const {
      status = 'processed',
      status_detail = 'accredited',
      payment_method_type,
      payment_method_id,
      installments,
    } = req.body || {};

    const data = await mpFetch(`/v1/orders/${req.params.id}/events`, {
      method: 'POST',
      body: { status, status_detail, payment_method_type, payment_method_id, installments },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
