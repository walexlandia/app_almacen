import { useState } from "react";
import { Package, Receipt, TrendingUp } from "lucide-react";
import StockCriticoPage from "./reports/StockCriticoPage";
import VentasDelDiaPage from "./reports/VentasDelDiaPage";
import ProductosMasVendidosPage from "./reports/ProductosMasVendidosPage";

const tabs = [
  { id: "stock", label: "Stock crítico", icon: Package, Component: StockCriticoPage },
  { id: "ventas", label: "Ventas del día", icon: Receipt, Component: VentasDelDiaPage },
  { id: "top", label: "Más vendidos", icon: TrendingUp, Component: ProductosMasVendidosPage },
];

export default function ReportsPage() {
  const [activo, setActivo] = useState(tabs[0].id);
  const TabActivo = tabs.find((t) => t.id === activo).Component;

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 pt-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivo(id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
              activo === id
                ? "border-b-2 border-brand-600 text-brand-600"
                : "border-b-2 border-transparent text-slate-500"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <TabActivo />
      </div>
    </div>
  );
}
