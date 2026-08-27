/**
 * Script de un solo uso: crea una Tienda y una Caja (Punto de Venta) en tu
 * cuenta de Mercado Pago. Es un requisito de la API antes de poder generar
 * códigos QR — sin esto, crear una orden QR falla con "pos_not_found".
 *
 * Uso:
 *   cd server
 *   npm run setup:qr
 *
 * Al terminar, copiá el "external_pos_id" que imprime a server/.env, en la
 * variable MP_QR_EXTERNAL_POS_ID. Alcanza con correrlo una vez por sucursal
 * (si ya tenés una Tienda/Caja creada desde el panel de Mercado Pago, no
 * hace falta correr esto: anotá el external_pos_id que le pusiste ahí).
 */
import 'dotenv/config';
import { userClient, mpFetch } from '../utils/mpClient.js';

// Editá estos datos con los de tu negocio antes de correr el script.
const STORE = {
  name: 'Almacén',
  external_id: 'ALMACEN-001',
  location: {
    street_name: 'Av. Ejemplo',
    street_number: '123',
    city_name: 'Maipú',
    state_name: 'Región Metropolitana',
    latitude: -33.5167,
    longitude: -70.7667,
  },
};

const POS = {
  name: 'Caja 1',
  external_id: 'ALMACEN-001-CAJA1',
  fixed_amount: false, // false = el monto lo define cada venta (QR dinámico)
};

async function main() {
  console.log('Consultando la cuenta de Mercado Pago...');
  const me = await userClient.get();
  console.log(`Cuenta: ${me.email || me.nickname || me.id} (user_id ${me.id})\n`);

  console.log('Creando tienda...');
  const store = await mpFetch(`/users/${me.id}/stores`, {
    method: 'POST',
    body: { name: STORE.name, external_id: STORE.external_id, location: STORE.location },
  });
  console.log(`Tienda creada: id=${store.id}, external_id=${STORE.external_id}\n`);

  console.log('Creando caja (POS)...');
  const pos = await mpFetch('/pos', {
    method: 'POST',
    body: {
      name: POS.name,
      fixed_amount: POS.fixed_amount,
      store_id: store.id,
      external_store_id: STORE.external_id,
      external_id: POS.external_id,
    },
  });

  console.log('\n✅ Listo. Agregá esta línea a server/.env:\n');
  console.log(`MP_QR_EXTERNAL_POS_ID=${pos.external_id}`);
  console.log(`\nTambién tenés un QR estático de respaldo (imprimible, monto libre): ${pos.qr?.image}`);
}

main().catch((err) => {
  console.error('\n❌ Error creando la tienda/caja:', JSON.stringify(err.mpError || err.message, null, 2));
  process.exit(1);
});
