import { useState } from "react";
import { PackageMinus, Check } from "lucide-react";
import { productos, mermas, productoNombre } from "../../data/mockData";
import TopBar from "../../components/layout/TopBar";
import Field, { inputClass } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";

const motivos = [
  { id: "vencimiento", label: "Vencimiento" },
  { id: "daño", label: "Daño / rotura" },
  { id: "robo", label: "Robo / pérdida" },
  { id: "otro", label: "Otro" },
];

export default function MermasPage() {
  const [tab, setTab] = useState("registrar");
  const [productoId, setProductoId] = useState(productos[0].id);
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState(motivos[0].id);
  const [guardado, setGuardado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
      setCantidad("");
      setTab("historial");
    }, 800);
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Mermas" subtitle="Pérdidas por daño o vencimiento" />

      <div className="flex gap-1 px-5 pt-4">
        {[
          { id: "registrar", label: "Registrar" },
          { id: "historial", label: "Historial" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium ${
              tab === t.id ? "bg-ink-900 text-white" : "bg-white text-ink-500 border border-ink-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "registrar" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          <Field label="Producto">
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className={inputClass(false)}
            >
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} · stock {p.stock}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Cantidad a descontar">
            <input
              required
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0"
              className={inputClass(false)}
            />
          </Field>

          <Field label="Motivo">
            <div className="grid grid-cols-2 gap-2">
              {motivos.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMotivo(m.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
                    motivo === m.id
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-ink-200 bg-white text-ink-600"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </Field>

          <p className="text-xs text-ink-400">
            La cantidad se descuenta automáticamente del stock del producto al guardar.
          </p>

          <Button
            type="submit"
            size="lg"
            className="mt-2"
            icon={guardado ? Check : PackageMinus}
            disabled={guardado}
          >
            {guardado ? "Merma registrada" : "Registrar merma"}
          </Button>
        </form>
      ) : (
        <div className="flex-1 px-5 py-5">
          {mermas.length === 0 ? (
            <EmptyState
              icon={PackageMinus}
              title="Sin mermas registradas"
              description="Cuando registres una, aparecerá aquí."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {mermas.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-2xl border border-ink-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900">{productoNombre(m.productoId)}</p>
                    <p className="text-xs text-ink-400">
                      {m.fecha} · {m.usuario}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-red-600">-{m.cantidad} un.</span>
                    <Badge tone="neutral">{motivos.find((x) => x.id === m.motivo)?.label}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
