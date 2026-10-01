import { ventas, productos, formatoCLP } from "../../../data/mockData";

function calcularRanking() {
  const acumulado = {};

  ventas
    .filter((v) => v.estado === "completada")
    .forEach((v) => {
      v.items.forEach((item) => {
        if (!acumulado[item.productoId]) {
          acumulado[item.productoId] = { cantidad: 0, monto: 0 };
        }
        acumulado[item.productoId].cantidad += item.cantidad;
        acumulado[item.productoId].monto += item.cantidad * item.precioUnit;
      });
    });

  return Object.entries(acumulado)
    .map(([productoId, datos]) => ({
      producto: productos.find((p) => p.id === productoId),
      ...datos,
    }))
    .filter((r) => r.producto)
    .sort((a, b) => b.cantidad - a.cantidad);
}

export default function ProductosMasVendidosPage() {
  const ranking = calcularRanking();

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-semibold text-ink-900">Productos más vendidos</h1>
      <p className="mt-1 text-sm text-ink-500">
        Basado en las ventas completadas (excluye ventas anuladas).
      </p>

      {ranking.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-400">Aún no hay ventas registradas.</p>
      ) : (
        <ol className="mt-4 divide-y divide-ink-200 rounded-lg border border-ink-200 bg-white">
          {ranking.map((r, i) => (
            <li key={r.producto.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-600">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink-900">{r.producto.nombre}</p>
                <p className="text-xs text-ink-500">{formatoCLP(r.monto)} generados</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-ink-900">{r.cantidad}</p>
                <p className="text-xs text-ink-400">unidades</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
