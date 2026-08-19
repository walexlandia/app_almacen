import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import TopBar from "../../components/layout/TopBar";
import Badge from "../../components/ui/Badge";

export default function MorePage() {
  const { usuario, logout } = useAuth();

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Más" subtitle="Perfil y sesión" onBack={null} />

      <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700">
          {usuario.nombre.charAt(0)}
        </div>
        <div>
          <p className="text-[15px] font-medium text-ink-900">{usuario.nombre}</p>
          <p className="text-xs text-ink-400">{usuario.correo}</p>
        </div>
        <Badge tone="brand">
          <ShieldCheck size={12} /> Administrador
        </Badge>
      </div>

      <div className="mt-auto px-5 pb-6">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600 active:bg-red-100"
        >
          <LogOut size={17} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
