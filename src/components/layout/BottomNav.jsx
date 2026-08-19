import { NavLink } from "react-router-dom";
import { Home, Warehouse, ScanBarcode, ClipboardList, BarChart3, CircleUser } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const itemsAdmin = [
  { to: "/admin", label: "Inicio", icon: Home, end: true },
  { to: "/admin/mantenedor", label: "Mantenedor", icon: Warehouse },
  { to: "/admin/informes", label: "Informes", icon: BarChart3 },
  { to: "/perfil", label: "Perfil", icon: CircleUser },
];

const itemsVendedor = [
  { to: "/venta", label: "Vender", icon: ScanBarcode, end: true },
  { to: "/venta/historial", label: "Historial", icon: ClipboardList },
  { to: "/perfil", label: "Perfil", icon: CircleUser },
];

export default function BottomNav() {
  const { esAdmin } = useAuth();
  const items = esAdmin ? itemsAdmin : itemsVendedor;

  return (
    <nav className="sticky bottom-0 z-20 shrink-0 border-t border-ink-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="flex h-16 items-stretch justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                isActive ? "text-brand-600" : "text-ink-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
