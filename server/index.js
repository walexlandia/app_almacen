import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import paymentRouter from './routes/payment.js';
import qrRouter from './routes/qr.js';
import pointRouter from './routes/point.js';
import ordersRouter from './routes/orders.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*', methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting – 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
// Los prefijos más específicos van antes que '/api/payments' a secas, así
// Express no intenta resolverlos primero contra las rutas de paymentRouter
// (que solo define '/' y '/webhook').
app.use('/api/payments/qr', qrRouter); // Mercado Pago QR
app.use('/api/payments/point', pointRouter); // Mercado Pago Point / Smart Point
app.use('/api/payments/orders', ordersRouter); // Consultar/simular el estado de una orden
app.use('/api/payments', paymentRouter); // Checkout Pro (preference) + webhook

// Simple health‑check endpoint. También indica si las credenciales son de
// prueba o de producción (sin exponer el token) para que las herramientas
// de testing puedan avisar antes de generar un cobro real.
app.get('/health', (req, res) => {
  const token = process.env.MP_ACCESS_TOKEN || '';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mpMode: token.startsWith('TEST-') ? 'test' : token ? 'production' : 'unconfigured',
    qrConfigured: Boolean(process.env.MP_QR_EXTERNAL_POS_ID),
    pointTerminalConfigured: Boolean(process.env.MP_POINT_TERMINAL_ID),
    webhookSecretConfigured: Boolean(process.env.MP_WEBHOOK_SECRET),
  });
});

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  const details = process.env.NODE_ENV === 'production' ? undefined : err.mpError;
  res.status(status).json({ error: message, details });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
