export async function createPreference(items, reference) {
  const resp = await fetch('http://10.0.2.2:3000/api/mercadopago/preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, external_reference: reference })
  });
  if (!resp.ok) throw new Error('MercadoPago request failed');
  return resp.json(); // { init_point, id }
}
