# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
The repository contains a React/Vite + Capacitor frontend ("app_almacen", a small-store inventory/POS app)
and a Node.js/Express backend (`server/`) that integrates with Mercado Pago. The backend is an ES module
(`type: "module"`).

Mercado Pago is integrated three ways, all through the official `mercadopago` npm SDK (v2.13, already
installed):
- **Checkout Pro** (`Preference`) — redirect checkout, pre-existing.
- **QR** (`Order`, `type: "qr"`) — dynamic QR code shown at checkout, customer scans and pays.
- **Point / Smart Point** (`Order`, `type: "point"`) — sends the charge to a physical Point terminal.

QR and Point both go through Mercado Pago's unified **Orders API** (`POST /v1/orders`), which replaced the
older QR-only and Point-only ("integration-api") APIs. Do not add code against the old
`/instore/orders/qr/...` or `/point/integration-api/...` endpoints — they're deprecated.

## Development Commands
| Command | Description |
|--------|-------------|
| `npm install` (in `server/`) | Install backend dependencies. |
| `npm run dev` (in `server/`) | Starts the server in watch mode (`node --watch index.js`). |
| `npm start` (in `server/`) | Starts the server for production. |
| `npm run setup:qr` (in `server/`) | One-time script: creates a Store + POS in Mercado Pago, required before QR orders will work. Prints `MP_QR_EXTERNAL_POS_ID` to copy into `.env`. |
| `npm run dev` (repo root) | Starts the Vite frontend. |

## Environment & Configuration (`server/.env`)
| Variable | Required for | Notes |
|---|---|---|
| `MP_ACCESS_TOKEN` | everything | Currently holds a **production** `APP_USR-...` token — swap for a `TEST-...` token while testing so nothing charges real money. |
| `MP_PUBLIC_KEY` | frontend card tokenization (not yet used) | |
| `PORT` | server | Defaults to 3001. |
| `MP_QR_EXTERNAL_POS_ID` | QR | From `npm run setup:qr`, or from a Store/POS created in the Mercado Pago panel. |
| `MP_POINT_TERMINAL_ID` | Point | From `GET /api/payments/point/terminals`. Optional — can also be sent per-request. |
| `MP_WEBHOOK_SECRET` | webhook signature validation | From "Tus integraciones" > your app > Webhooks > Configurar notificaciones. Without it, incoming webhooks are logged but NOT verified as genuinely from Mercado Pago. |
| `MP_CURRENCY` | QR/Point orders | Defaults to `CLP` in code if unset. |

All secrets are read via `process.env.*`; never hard-code them.

## Architecture
```
server/
├─ .env
├─ package.json
├─ index.js              # Express app; mounts routers, health check, error handler
├─ scripts/
│   └─ setup-qr-pos.mjs  # One-time: creates Store + POS, prints external_pos_id
├─ routes/
│   ├─ payment.js        # POST /api/payments (Checkout Pro) + POST /api/payments/webhook
│   ├─ qr.js             # POST /api/payments/qr
│   ├─ point.js          # GET /api/payments/point/terminals, POST /api/payments/point, POST /api/payments/point/:id/cancel
│   └─ orders.js         # GET /api/payments/orders/:id, POST /api/payments/orders/:id/simulate
└─ utils/
    ├─ mpClient.js       # SDK clients (Preference, Order, User) + mpFetch() for endpoints the SDK doesn't wrap yet
    └─ qr.js             # Renders the Orders API's qr_data string into a PNG data URL (via `qrcode`)
```

- **`utils/mpClient.js`** — `orderClient` (the `Order` SDK client) is what QR and Point both use, with
  a different `type` and `config.qr` / `config.point` block. `mpFetch()` is a thin authenticated fetch
  wrapper for the handful of endpoints the installed SDK version doesn't wrap yet: `/terminals/v1/list`,
  `/pos`, `/users/{id}/stores`, `/v1/orders/{id}/events` (the test-mode simulate endpoint).
- **`routes/payment.js` webhook** — one URL handles notifications for all three products. Signature
  validation uses the SDK's own `WebhookSignatureValidator`, and is **skipped for QR notifications**,
  which Mercado Pago does not sign (this is documented behavior of the validator, not a bug).
- Money amounts are sent to Mercado Pago as strings (`toAmountString()` in `mpClient.js`): plain integers
  for whole-peso amounts (CLP has no decimals), `"x.xx"` only if the amount actually has cents.

## Testing
- `test-mercadopago.html` (repo root) is a self-contained manual test console for the whole payments flow:
  health check, Checkout Pro, QR (shows the actual QR image), Point (lists terminals, sends a charge,
  can simulate approval/rejection when using TEST- credentials), and a webhook simulator. Open it directly
  in a browser — no build step.
- `test.html` / `test-tunnel.html` (repo root) and `public/test-payment.html` predate this integration and
  only exercise Checkout Pro; `test-mercadopago.html` supersedes them for QR/Point testing.
- No automated test runner is configured yet (`npm test` is a no-op). Add Jest + supertest if/when this
  becomes worth automating.

## Mercado Pago Integration Guidelines
- Never expose `MP_ACCESS_TOKEN` in frontend code — it stays in `server/.env`.
- Create orders server-side only; the frontend only ever sees the response (QR image, order id, status).
- Tie each order's idempotency key to your own sale id (`external_reference`) so a retried request from
  the frontend can't create a duplicate charge.
- Webhook is the source of truth for final status; polling `GET /api/payments/orders/:id` is a fallback
  for the UI while waiting, not a replacement for the webhook.

## What's still simulated / not wired up
- `src/pages/ventas/CheckoutPage.jsx` still uses a fake `setTimeout` instead of calling the new
  `/api/payments/qr` and `/api/payments/point` endpoints — the real integration lives in the backend and
  in `test-mercadopago.html` for now. Wiring the actual checkout screen (QR display, polling, terminal
  picker) is the natural next step once the flows have been tried out through the test console.
- `src/pages/admin/MercadoPagoConfigPage.jsx` still shows hard-coded/fake connection state.

---
*Keep this file in sync when routes, scripts, or env vars change.*
