import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Banknote, CreditCard, CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatoCLP } from "../../data/mockData";
import TopBar from "../../components/layout/TopBar";
import Button from "../../components/ui/Button";
import { createPreference } from "../../services/mercadopago";

const metodos = [
  { id: "efectivo", label: "Efectivo", icon: Banknote },
  { id: "mercadopago", label: "Mercado Pago", icon: CreditCard },
];

export default function CheckoutPage() {
  const { items, total, vaciarCarrito } = useCart();
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState("mercadopago");
  const [estado, setEstado] = useState("pendiente"); // pendiente | procesando | listo

  if (items.length === 0 && estado !== "listo") return <Navigate to="/venta" replace />;

  const confirmar = async () => {
    setEstado("procesando");
    if (metodo === "mercadopago") {
    try {
      const itemsForPreference = items.map((i) => ({
        title: i.nombre ?? i.name ?? "Producto",
        description: i.descripcion ?? i.description,
        quantity: i.cantidad ?? i.quantity ?? 1,
        unit_price: i.precio ?? i.price ?? 0,
        currency_id: "ARS"
      }));
      const result = await createPreference(itemsForPreference, `order-${Date.now()}`);
      window.location.href = result.init_point;
    } catch (error) {
      console.error(error);
      alert("Error al iniciar el pago con Mercado Pago");
      setEstado("pendiente");
    }
  } else {
    setTimeout(() => setEstado("listo"), 1200);
  }
  };

  const finalizar = () => {
    vaciarCarrito();
    navigate("/venta/historial", { replace: true });
  };

  if (estado === "listo") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Venta registrada</h1>
          <p className="mt-1 text-sm text-ink-400">
            Se cobraron {formatoCLP(total)} vía {metodos.find((m) => m.id === metodo)?.label}.
          </p>
        </div>
        <Button size="lg" className="w-full" onClick={finalizar}>
          Volver a vender
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Cobrar venta" />

      <div className="flex flex-1 flex-col gap-5 px-5 py-5">
        <div className="rounded-2xl border border-ink-200 bg-white p-4">
          <p className="text-sm text-ink-400">Total a cobrar</p>
          <p className="text-3xl font-semibold text-ink-900">{formatoCLP(total)}</p>
          <p className="mt-1 text-xs text-ink-400">{items.length} producto(s) distintos</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-700">Método de pago</p>
          <div className="grid grid-cols-2 gap-3">
            {metodos.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMetodo(id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 ${
                  metodo === id
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-ink-600"
                }`}
              >
                <Icon size={22} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {metodo === "mercadopago" && (
          <p className="text-xs text-ink-400">
            Se abrirá el checkout de Mercado Pago para completar el cobro (integración real en{" "}
            <code className="rounded bg-ink-100 px-1 py-0.5">feature/modulo1-mercadopago</code>).
          </p>
        )}

        <Button size="lg" className="mt-auto w-full" onClick={confirmar} disabled={estado === "procesando"}>
          {estado === "procesando" ? "Procesando pago..." : "Confirmar cobro"}
        </Button>
      </div>
    </div>
  );
}
