import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ScanLine, Trash2, Check } from "lucide-react";
import { productos, categorias } from "../../data/mockData";
import TopBar from "../../components/layout/TopBar";
import Field, { inputClass } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Sheet from "../../components/ui/Sheet";
import BarcodeScannerSheet from "../../components/ui/BarcodeScannerSheet";

export default function ProductFormPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);
  const productoExistente = useMemo(() => productos.find((p) => p.id === id), [id]);

  const [form, setForm] = useState({
    nombre: productoExistente?.nombre ?? "",
    codigoBarra: productoExistente?.codigoBarra ?? "",
    categoriaId: productoExistente?.categoriaId ?? categorias[0].id,
    precio: productoExistente?.precio ?? "",
    cantidad: esEdicion ? "" : "",
    stockCritico: productoExistente?.stockCritico ?? "",
  });
  const [scannerAbierto, setScannerAbierto] = useState(params.get("scan") === "1");
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Diseño sin datos: no persiste, solo confirma visualmente el flujo.
    setGuardado(true);
    setTimeout(() => navigate("/admin/productos"), 900);
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title={esEdicion ? "Editar producto" : "Nuevo producto"} />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-5 py-5">
        <Field label="Código de barra">
          <div className="flex gap-2">
            <input
              required
              value={form.codigoBarra}
              onChange={set("codigoBarra")}
              disabled={esEdicion}
              placeholder="Escanea o escribe el código"
              className={`${inputClass(false)} ${esEdicion ? "bg-ink-100 text-ink-400" : ""}`}
            />
            {!esEdicion && (
              <button
                type="button"
                onClick={() => setScannerAbierto(true)}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 active:bg-ink-50"
                aria-label="Escanear"
              >
                <ScanLine size={19} />
              </button>
            )}
          </div>
        </Field>

        <Field label="Nombre del producto">
          <input
            required
            value={form.nombre}
            onChange={set("nombre")}
            placeholder="Ej: Bebida Cola 1.5L"
            className={inputClass(false)}
          />
        </Field>

        <Field label="Categoría">
          <select value={form.categoriaId} onChange={set("categoriaId")} className={inputClass(false)}>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio de venta">
            <input
              required
              type="number"
              min="0"
              value={form.precio}
              onChange={set("precio")}
              placeholder="$0"
              className={inputClass(false)}
            />
          </Field>
          <Field label={esEdicion ? "Ingreso de stock" : "Cantidad inicial"}>
            <input
              required
              type="number"
              min="0"
              value={form.cantidad}
              onChange={set("cantidad")}
              placeholder="0"
              className={inputClass(false)}
            />
          </Field>
        </div>

        <Field label="Stock crítico" hint="Cuando el stock llegue a este número, se genera una alerta.">
          <input
            required
            type="number"
            min="0"
            value={form.stockCritico}
            onChange={set("stockCritico")}
            placeholder="Ej: 10"
            className={inputClass(false)}
          />
        </Field>

        {esEdicion && (
          <p className="text-xs text-ink-400">
            Stock actual:{" "}
            <span className="font-medium text-ink-600">{productoExistente?.stock} unidades</span>
          </p>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Button type="submit" size="lg" icon={guardado ? Check : undefined} disabled={guardado}>
            {guardado ? "Guardado" : esEdicion ? "Guardar cambios" : "Registrar producto"}
          </Button>
          {esEdicion && (
            <Button type="button" variant="danger" icon={Trash2} onClick={() => setConfirmarBaja(true)}>
              Dar de baja producto
            </Button>
          )}
        </div>
      </form>

      <BarcodeScannerSheet
        open={scannerAbierto}
        onClose={() => setScannerAbierto(false)}
        productosDemo={productos}
        onDetectado={(codigo) => {
          setForm((f) => ({ ...f, codigoBarra: codigo }));
          setScannerAbierto(false);
        }}
      />

      <Sheet open={confirmarBaja} onClose={() => setConfirmarBaja(false)} title="Dar de baja producto">
        <p className="mb-4 text-sm text-ink-500">
          El producto <span className="font-medium text-ink-800">{form.nombre}</span> dejará de aparecer en el
          catálogo activo. El historial de ventas asociado se conserva (baja lógica).
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirmarBaja(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              setConfirmarBaja(false);
              navigate("/admin/productos");
            }}
          >
            Dar de baja
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
