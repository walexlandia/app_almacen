import { useState } from "react";
import { Receipt, XCircle } from "lucide-react";
import {
  ventas as ventasIniciales,
  calcularTotalVenta,
  productoNombre,
  formatoCLP,
} from "../../data/mockData";
import TopBar from "../../components/layout/TopBar";
import Badge from "../../components/ui/Badge";
import Sheet from "../../components/ui/Sheet";
import Button from "../../components/ui/Button";
import Field, { inputClass } from "../../components/ui/Field";

export default function SalesHistoryPage() {
  const [ventas, setVentas] = useState(ventasIniciales);
  const [seleccionada, setSeleccionada] = useState(null);
  const [motivo, setMotivo] = useState("");

  const anular = () => {
    setVentas((prev) =>
      prev.map((v) =>
        v.id === seleccionada.id
          ? { ...v, estado: "anulada", motivoAnulacion: motivo || "Sin motivo especificado" }
          : v
      )
    );
    setSeleccionada(null);
    setMotivo("");
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Historial de ventas" onBack={null} />

      <div className="flex flex-col gap-2 px-5 py-4">
        {ventas.map((v) => {
          const anulada = v.estado === "anulada";
          return (
            <button
              key={v.id}
              onClick={() => !anulada && setSeleccionada(v)}
              disabled={anulada}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left ${
                anulada ? "border-ink-200 bg-ink-50 opacity-70" : "border-ink-200 bg-white active:bg-ink-50"
              }`}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                <Receipt size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">Venta #{v.id}</p>
                <p className="text-xs text-ink-400">
                  {new Date(v.fecha).toLocaleString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {v.vendedor}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-sm font-semibold ${anulada ? "text-ink-400 line-through" : "text-ink-900"}`}
                >
                  {formatoCLP(calcularTotalVenta(v))}
                </span>
                <Badge tone={anulada ? "danger" : "ok"}>{anulada ? "Anulada" : "Completada"}</Badge>
              </div>
            </button>
          );
        })}
      </div>

      <Sheet
        open={!!seleccionada}
        onClose={() => setSeleccionada(null)}
        title={`Venta #${seleccionada?.id ?? ""}`}
      >
        {seleccionada && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {seleccionada.items.map((it) => (
                <div key={it.productoId} className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">
                    {it.cantidad}× {productoNombre(it.productoId)}
                  </span>
                  <span className="font-medium text-ink-900">{formatoCLP(it.cantidad * it.precioUnit)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-ink-200 pt-3">
              <span className="text-sm font-medium text-ink-700">Total</span>
              <span className="text-lg font-semibold text-ink-900">
                {formatoCLP(calcularTotalVenta(seleccionada))}
              </span>
            </div>

            <Field label="Motivo de anulación">
              <input
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: error de cobro, devolución del cliente"
                className={inputClass(false)}
              />
            </Field>

            <Button variant="danger" icon={XCircle} onClick={anular}>
              Anular venta
            </Button>
            <p className="text-xs text-ink-400">
              Al anular, el stock descontado de esta venta se repone automáticamente.
            </p>
          </div>
        )}
      </Sheet>
    </div>
  );
}
