import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, Search, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { productos, formatoCLP } from "../../data/mockData";
import { useCart } from "../../context/CartContext";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import BarcodeScannerSheet from "../../components/ui/BarcodeScannerSheet";

export default function SalePage() {
  const navigate = useNavigate();
  const { items, agregarProducto, quitarUnidad, eliminarProducto, total, cantidadItems } = useCart();
  const [scannerAbierto, setScannerAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const resultados = useMemo(() => {
    if (!busqueda.trim()) return [];
    const q = busqueda.toLowerCase();
    return productos
      .filter((p) => p.nombre.toLowerCase().includes(q) || p.codigoBarra.includes(q))
      .slice(0, 5);
  }, [busqueda]);

  const handleDetectado = (codigo) => {
    const producto = productos.find((p) => p.codigoBarra === codigo);
    setScannerAbierto(false);
    if (producto) agregarProducto(producto);
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-5 pb-3 pt-[calc(env(safe-area-inset-top)+16px)]">
        <p className="text-sm text-ink-400">Venta en curso</p>
        <h1 className="text-xl font-semibold text-ink-900">Nueva venta</h1>
      </header>

      <div className="flex flex-col gap-3 px-5">
        <button
          onClick={() => setScannerAbierto(true)}
          className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/25 active:bg-brand-600"
        >
          <ScanLine size={24} />
          <span className="text-base font-semibold">Escanear producto</span>
        </button>

        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre si no tienes el código"
            className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-[15px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          {resultados.length > 0 && (
            <div className="absolute inset-x-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg">
              {resultados.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    agregarProducto(p);
                    setBusqueda("");
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left active:bg-ink-50"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900">{p.nombre}</p>
                    <p className="text-xs text-ink-400">Stock {p.stock}</p>
                  </div>
                  <span className="text-sm font-semibold text-ink-900">{formatoCLP(p.precio)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-ink-900">Detalle de la venta</h2>
          {items.length > 0 && <span className="text-xs text-ink-400">{cantidadItems} unidades</span>}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Aún no hay productos"
            description="Escanea un código o búscalo manualmente para agregarlo a la venta."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {items.map(({ producto, cantidad }) => (
              <div
                key={producto.id}
                className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{producto.nombre}</p>
                  <p className="text-xs text-ink-400">{formatoCLP(producto.precio)} c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => quitarUnidad(producto.id)}
                    className="flex size-7 items-center justify-center rounded-full bg-ink-100 text-ink-600 active:bg-ink-200"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-medium">{cantidad}</span>
                  <button
                    onClick={() => agregarProducto(producto)}
                    className="flex size-7 items-center justify-center rounded-full bg-ink-100 text-ink-600 active:bg-ink-200"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="w-16 shrink-0 text-right text-sm font-semibold text-ink-900">
                  {formatoCLP(cantidad * producto.precio)}
                </span>
                <button
                  onClick={() => eliminarProducto(producto.id)}
                  className="text-ink-300 active:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="sticky bottom-0 border-t border-ink-200 bg-white px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-ink-500">Total a pagar</span>
            <span className="text-2xl font-semibold text-ink-900">{formatoCLP(total)}</span>
          </div>
          <Button size="lg" className="w-full" onClick={() => navigate("/venta/cobrar")}>
            Cobrar
          </Button>
        </div>
      )}

      <BarcodeScannerSheet
        open={scannerAbierto}
        onClose={() => setScannerAbierto(false)}
        productosDemo={productos}
        onDetectado={handleDetectado}
      />
    </div>
  );
}
