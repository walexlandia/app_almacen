const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const mpConfig = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const preferenceClient = new Preference(mpConfig);

router.post('/preference', async (req, res) => {
  const { items, external_reference } = req.body;
  const preferenceData = {
    items: items.map(i => ({
      title: i.title,
      description: i.description || '',
      quantity: i.quantity,
      unit_price: i.unit_price,
      currency_id: 'ARS'
    })),
    back_urls: {
      success: `${process.env.APP_URL}/venta/mercadopago/success`,
      failure: `${process.env.APP_URL}/venta/mercadopago/failure`,
      pending: `${process.env.APP_URL}/venta/mercadopago/pending`
    },
    auto_return: 'approved',
    external_reference,
    notification_url: `${process.env.APP_URL}/api/mercadopago/webhook`
  };
  try {
    const response = await preferenceClient.create({ body: preferenceData });
    res.json({ init_point: response.init_point, id: response.id });
  } catch (e) {
    console.error('MercadoPago error', e);
    res.status(500).json({ error: 'Failed to create preference' });
  }
});

module.exports = router;
