import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { orderClient, mpFetch, toAmountString } from '../utils/mpClient.js';

const router = Router();

const DEFAULT_EXPIRATION = 'PT15M';

/**
 * GET /api/payments/point/terminals
 * Lista las terminales Point (incluida Point Smart) vinculadas a la cuenta,
 * con su `id` (el terminal_id que se usa para enviar un cobro).
 */
router.get('/terminals', async (req, res, next) => {
  try {
    const data = await mpFetch('/terminals/v1/list?limit=50');
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/payments/point
 * Body: { amount, description?, external_reference?, terminal_id?, expiration_time? }
 *
 * Envía el cobro a una terminal Point Smart: el monto aparece en la
 * pantalla del dispositivo para que el cliente pague con tarjeta.
 * Si no se envía terminal_id, usa MP_POINT_TERMINAL_ID de server/.env.
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      amount,
      description = 'Venta almacén',
      external_reference = randomUUID(),
      terminal_id = process.env.MP_POINT_TERMINAL_ID,
      expiration_time = DEFAULT_EXPIRATION,
    } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'amount inválido o ausente' });
    }
    if (!terminal_id) {
      return res.status(400).json({
        error:
          'Falta terminal_id. Consultá GET /api/payments/point/terminals para ver tus terminales, ' +
          'o configurá MP_POINT_TERMINAL_ID en server/.env con el ID por defecto.',
      });
    }

    const amountStr = toAmountString(amount);

    const body = {
      type: 'point',
      external_reference,
      expiration_time,
      description,
      transactions: { payments: [{ amount: amountStr }] },
      config: {
        point: { terminal_id },
      },
    };

    const order = await orderClient.create({ body, requestOptions: { idempotencyKey: external_reference } });

    res.status(201).json({
      orderId: order.id,
      status: order.status, // created -> at_terminal -> processed | cancelled | expired
      statusDetail: order.status_detail,
      externalReference: order.external_reference,
      terminalId: terminal_id,
    });
  } catch (err) {
    if (err?.mpError?.error === 'already_queued_order_for_terminal') {
      err.message =
        'Esa terminal ya tiene un cobro pendiente. Cancelalo o esperá a que termine antes de enviar otro.';
    }
    next(err);
  }
});

/**
 * POST /api/payments/point/:id/cancel
 * Cancela una orden Point que sigue pendiente en la terminal (por ejemplo,
 * si el cajero se equivocó de monto).
 */
router.post('/:id/cancel', async (req, res, next) => {
  try {
    const order = await orderClient.cancel({ id: req.params.id });
    res.json({ orderId: order.id, status: order.status });
  } catch (err) {
    next(err);
  }
});

export default router;
