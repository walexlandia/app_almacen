import { MercadoPagoConfig, Preference, Order, User } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error('MP_ACCESS_TOKEN is not defined in .env');
}

// Configuración central del SDK oficial (usa MP_ACCESS_TOKEN).
export const mpConfig = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Clientes oficiales del SDK `mercadopago` (v2.13, ya instalado en el proyecto).
export const preferenceClient = new Preference(mpConfig); // Checkout Pro (ya existía)
export const orderClient = new Order(mpConfig); // Orders API: cubre QR, Point y Checkout API ("online")
export const userClient = new User(mpConfig); // GET /users/me

/**
 * Llama directamente a un endpoint de Mercado Pago que el SDK todavía no
 * envuelve (terminales Point, alta de tiendas/POS, simulación de órdenes).
 * Usa fetch nativo de Node (18+).
 */
export async function mpFetch(path, { method = 'GET', body, idempotencyKey } = {}) {
  const headers = {
    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
  if (method !== 'GET' && idempotencyKey) headers['X-Idempotency-Key'] = idempotencyKey;

  const response = await fetch(`https://api.mercadopago.com${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || `Error de Mercado Pago (HTTP ${response.status})`);
    error.status = response.status;
    error.mpError = data;
    throw error;
  }
  return data;
}

/**
 * Mercado Pago acepta el monto como string con hasta 2 decimales, "o
 * ninguno" (documentación de Orders API). CLP no usa decimales, así que
 * mandamos enteros como "1800" y solo agregamos ".00" si el monto trae
 * centavos de verdad (útil si en el futuro se vende en otra moneda).
 */
export function toAmountString(amount) {
  const n = Number(amount);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

// Se mantiene por compatibilidad: el código existente usa
// `mercadopago.Preference.create(...)` desde routes/payment.js.
const mercadopago = { Preference: preferenceClient };
export default mercadopago;