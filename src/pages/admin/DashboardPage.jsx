import { Link } from "react-router-dom";
import { AlertTriangle, TrendingUp, Receipt, ChevronRight } from "lucide-react";
import { productos, ventas, calcularTotalVenta, formatoCLP } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";

const hoy = "2026-08-19";

export default function DashboardPage() {
  const { usuario } = useAuth();
  const ventasHoy = ventas.filter((v) => v.fecha.startsWith(hoy) && v.estado === "completada");
  const totalHoy = ventasHoy.reduce((acc, v) => acc + calcularTotalVenta(v), 0);
  const critico = productos.filter((p) => p.stock <= p.stockCritico);

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-5 pb-4 pt-[calc(env(safe-area-inset-top)+20px)]">
        <p className="text-sm text-ink-400">Hola,</p>
        <h1 className="text-xl font-semibold text-ink-900">{usuario.nombre.split(" ")[0]} 👋</h1>
      </header>

      <div className="flex flex-col gap-5 px-5 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Ventas de hoy"
            value={formatoCLP(totalHoy)}
            hint={`${ventasHoy.length} transacciones`}
            tone="brand"
            icon={TrendingUp}
          />
          <StatCard
            label="Stock crítico"
            value={critico.length}
            hint="productos por reponer"
            icon={AlertTriangle}
          />
        </div>

        {critico.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-ink-900">Alertas de stock crítico</h2>
              <Link to="/admin/productos?filtro=critico" className="text-sm font-medium text-brand-600">
                Ver todo
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {critico.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900">{p.nombre}</p>
                    <p className="text-xs text-ink-500">
                      Quedan {p.stock} · mínimo {p.stockCritico}
                    </p>
                  </div>
                  <Badge tone="warn">Crítico</Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink-900">Últimas ventas</h2>
            <Link to="/admin/informes" className="text-sm font-medium text-brand-600">
              Ver informes
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {ventas.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                  <Receipt size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">Venta #{v.id}</p>
                  <p className="text-xs text-ink-400">
                    {v.vendedor} · {v.metodoPago}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-ink-900">
                    {formatoCLP(calcularTotalVenta(v))}
                  </span>
                  <ChevronRight size={16} className="text-ink-300" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
