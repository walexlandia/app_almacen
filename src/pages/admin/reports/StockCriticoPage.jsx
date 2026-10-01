import { productos, categorias } from "../../../data/mockData";

const nombreCategoria = (categoriaId) =>
  categorias.find((c) => c.id === categoriaId)?.nombre ?? "Sin categoría";

export default function StockCriticoPage() {
  const productosCriticos = productos
    .filter((p) => p.activo && p.stock <= p.stockCritico)
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-semibold text-ink-900">Stock crítico</h1>
      <p className="mt-1 text-sm text-ink-500">
        Productos activos cuyo stock actual está en o bajo el mínimo definido.
      </p>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {productosCriticos.length === 0
          ? "No hay productos en estado crítico por ahora."
          : `${productosCriticos.length} producto(s) requieren reposición.`}
      </div>

      <ul className="mt-4 divide-y divide-ink-200 rounded-lg border border-ink-200 bg-white">
        {productosCriticos.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink-900">{p.nombre}</p>
              <p className="text-xs text-ink-500">
                {nombreCategoria(p.categoriaId)} · {p.codigoBarra}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-red-600">
                {p.stock} / {p.stockCritico}
              </p>
              <p className="text-xs text-ink-400">stock / mínimo</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
