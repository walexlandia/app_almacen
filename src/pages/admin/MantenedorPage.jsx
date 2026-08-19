import { Link } from "react-router-dom";
import { Package, AlertTriangle, PackageMinus, Users, CreditCard, ChevronRight } from "lucide-react";
import { productos } from "../../data/mockData";
import TopBar from "../../components/layout/TopBar";
import Badge from "../../components/ui/Badge";

export default function MantenedorPage() {
  const critico = productos.filter((p) => p.stock <= p.stockCritico);

  const opciones = [
    {
      to: "/admin/mantenedor/productos",
      label: "Productos",
      desc: "Catálogo, alta y edición por código de barra",
      icon: Package,
    },
    {
      to: "/admin/mantenedor/productos?filtro=critico",
      label: "Stock crítico",
      desc: "Productos bajo su umbral mínimo",
      icon: AlertTriangle,
      badge: critico.length > 0 ? critico.length : null,
    },
    {
      to: "/admin/mantenedor/mermas",
      label: "Mermas",
      desc: "Registrar pérdidas por daño o vencimiento",
      icon: PackageMinus,
    },
    {
      to: "/admin/mantenedor/usuarios",
      label: "Usuarios",
      desc: "Crear y administrar accesos del equipo",
      icon: Users,
    },
    {
      to: "/admin/mantenedor/mercado-pago",
      label: "Mercado Pago",
      desc: "Medio de pago del negocio",
      icon: CreditCard,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Mantenedor" subtitle="Productos, stock, mermas y usuarios" onBack={null} />

      <div className="flex flex-col gap-2 px-5 py-4">
        {opciones.map(({ to, label, desc, icon: Icon, badge }) => (
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
            {badge && <Badge tone="warn">{badge}</Badge>}
            <ChevronRight size={16} className="text-ink-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
