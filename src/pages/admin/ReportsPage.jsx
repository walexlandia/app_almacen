import { useMemo, useState } from "react";
import { TrendingUp, Trophy, ShoppingBasket } from "lucide-react";
import { productos, ventas, calcularTotalVenta, productoNombre, formatoCLP } from "../../data/mockData";
import TopBar from "../../components/layout/TopBar";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

const hoy = "2026-08-19";
const tabs = [
  { id: "dia", label: "Ventas del día" },
  { id: "top", label: "Más vendidos" },
  { id: "compras", label: "Compras sugeridas" },
];

export default function ReportsPage() {
  const [tab, setTab] = useState("dia");

  const ventasHoy = useMemo(
    () => ventas.filter((v) => v.fecha.startsWith(hoy) && v.estado === "completada"),
    []
  );
  const totalHoy = ventasHoy.reduce((acc, v) => acc + calcularTotalVenta(v), 0);

  const ranking = useMemo(() => {
    const conteo = {};
    ventas
      .filter((v) => v.estado === "completada")
      .forEach((v) =>
        v.items.forEach((it) => (conteo[it.productoId] = (conteo[it.productoId] ?? 0) + it.cantidad))
      );
    return Object.entries(conteo)
      .map(([productoId, cantidad]) => ({ productoId, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, []);

  const compras = useMemo(
    () =>
      productos
        .filter((p) => p.stock <= p.stockCritico)
        .map((p) => ({ ...p, sugerido: Math.max(p.stockCritico * 2 - p.stock, p.stockCritico) })),
    []
  );

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Informes" onBack={null} />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${
              tab === t.id ? "bg-ink-900 text-white" : "bg-white text-ink-500 border border-ink-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-5 py-5">
        {tab === "dia" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total vendido" value={formatoCLP(totalHoy)} tone="brand" icon={TrendingUp} />
              <StatCard label="Transacciones" value={ventasHoy.length} hint="ventas completadas" />
            </div>
            <div className="flex flex-col gap-2">
              {ventasHoy.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-2xl border border-ink-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900">Venta #{v.id}</p>
                    <p className="text-xs text-ink-400">
                      {v.vendedor} · {v.metodoPago}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-ink-900">
                    {formatoCLP(calcularTotalVenta(v))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "top" && (
          <div className="flex flex-col gap-2">
            {ranking.map((r, i) => (
              <div
                key={r.productoId}
                className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3"
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-ink-100 text-ink-500"}`}
                >
                  {i === 0 ? <Trophy size={15} /> : i + 1}
                </div>
                <p className="flex-1 text-sm font-medium text-ink-900">{productoNombre(r.productoId)}</p>
                <span className="text-sm font-semibold text-ink-900">{r.cantidad} un.</span>
              </div>
            ))}
          </div>
        )}

        {tab === "compras" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-ink-400">Sugerencia de reposición según productos en stock crítico.</p>
            {compras.length === 0 ? (
              <EmptyState
                icon={ShoppingBasket}
                title="Todo en orden"
                description="Ningún producto está bajo su stock crítico."
              />
            ) : (
              compras.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900">{p.nombre}</p>
                    <p className="text-xs text-ink-500">
                      Actual {p.stock} · mínimo {p.stockCritico}
                    </p>
                  </div>
                  <Badge tone="warn">Comprar {p.sugerido}</Badge>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
