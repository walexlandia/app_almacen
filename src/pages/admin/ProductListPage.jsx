import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Plus, AlertTriangle, ScanLine } from "lucide-react";
import { productos as productosIniciales, categorias, formatoCLP } from "../../data/mockData";
import TopBar from "../../components/layout/TopBar";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const soloCritico = params.get("filtro") === "critico";
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const productos = productosIniciales; // diseño: catálogo mock, sin escritura real

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      if (soloCritico && p.stock > p.stockCritico) return false;
      if (categoria !== "todas" && p.categoriaId !== categoria) return false;
      if (
        busqueda &&
        !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        !p.codigoBarra.includes(busqueda)
      )
        return false;
      return true;
    });
  }, [productos, busqueda, categoria, soloCritico]);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Productos" subtitle={`${productos.length} en catálogo`} onBack={null} />

      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o código de barra"
            className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-[15px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setCategoria("todas");
              setParams({});
            }}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${
              categoria === "todas" && !soloCritico
                ? "bg-ink-900 text-white"
                : "bg-white text-ink-500 border border-ink-200"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setParams({ filtro: "critico" })}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium ${
              soloCritico ? "bg-amber-500 text-white" : "bg-white text-ink-500 border border-ink-200"
            }`}
          >
            <AlertTriangle size={13} /> Crítico
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategoria(c.id);
                setParams({});
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                categoria === c.id ? "bg-ink-900 text-white" : "bg-white text-ink-500 border border-ink-200"
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pb-24">
        {filtrados.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Sin resultados"
            description="Prueba con otro nombre, código o categoría."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {filtrados.map((p) => {
              const critico = p.stock <= p.stockCritico;
              return (
                <button
                  key={p.id}
                  onClick={() => navigate(`/admin/productos/${p.id}`)}
                  className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-left active:bg-ink-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">{p.nombre}</p>
                    <p className="text-xs text-ink-400">{p.codigoBarra}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-ink-900">{formatoCLP(p.precio)}</span>
                    <Badge tone={critico ? "warn" : "neutral"}>Stock {p.stock}</Badge>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-end px-5">
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={() => navigate("/admin/productos/nuevo?scan=1")}
            className="flex size-12 items-center justify-center rounded-full bg-white text-ink-700 shadow-lg shadow-ink-900/10 ring-1 ring-ink-200 active:bg-ink-50"
            aria-label="Escanear producto"
          >
            <ScanLine size={20} />
          </button>
          <button
            onClick={() => navigate("/admin/productos/nuevo")}
            className="flex h-12 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 active:bg-brand-600"
          >
            <Plus size={18} /> Producto
          </button>
        </div>
      </div>
    </div>
  );
}
