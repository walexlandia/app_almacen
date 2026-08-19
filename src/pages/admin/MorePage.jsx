import { Link } from "react-router-dom";
import { Users, PackageMinus, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import TopBar from "../../components/layout/TopBar";

const opciones = [
  { to: "/admin/usuarios", label: "Usuarios", desc: "Crear y administrar accesos", icon: Users },
  { to: "/admin/mermas", label: "Mermas", desc: "Registrar pérdidas de stock", icon: PackageMinus },
  { to: "/admin/mercado-pago", label: "Mercado Pago", desc: "Medio de pago del negocio", icon: CreditCard },
];

export default function MorePage() {
  const { usuario, logout } = useAuth();

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Más" onBack={null} />

      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex size-11 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold">
          {usuario.nombre.charAt(0)}
        </div>
        <div>
          <p className="text-[15px] font-medium text-ink-900">{usuario.nombre}</p>
          <p className="text-xs text-ink-400">{usuario.correo}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5">
        {opciones.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3.5 active:bg-ink-50"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600">
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-900">{label}</p>
              <p className="text-xs text-ink-400">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-ink-300" />
          </Link>
        ))}
      </div>

      <button
        onClick={logout}
        className="mx-5 mt-6 flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600 active:bg-red-100"
      >
        <LogOut size={17} /> Cerrar sesión
      </button>
    </div>
  );
}
