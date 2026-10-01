import { useState } from "react";
import { UserPlus, Shield, ShieldCheck } from "lucide-react";
import { useData } from "../../context/DataContext";
import TopBar from "../../components/layout/TopBar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Sheet from "../../components/ui/Sheet";
import Field, { inputClass } from "../../components/ui/Field";

export default function UsersPage() {
  const { usuarios, guardarUsuario } = useData();
  const [sheetAbierto, setSheetAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  const abrirNuevo = () => {
    setEditando(null);
    setError("");
    setSheetAbierto(true);
  };

  const abrirEditar = (u) => {
    setEditando(u);
    setError("");
    setSheetAbierto(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        title="Usuarios"
        subtitle={`${usuarios.length} cuentas`}
        right={
          <button
            onClick={abrirNuevo}
            className="flex size-9 items-center justify-center rounded-full bg-brand-500 text-white active:bg-brand-600"
            aria-label="Nuevo usuario"
          >
            <UserPlus size={18} />
          </button>
        }
      />

      <div className="flex flex-col gap-2 px-5 py-4">
        {usuarios.map((u) => (
          <button
            key={u.id}
            onClick={() => abrirEditar(u)}
            className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-left active:bg-ink-50"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${u.rol === "admin" ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-500"}`}
            >
              {u.rol === "admin" ? <ShieldCheck size={18} /> : <Shield size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-900">{u.nombre}</p>
              <p className="truncate text-xs text-ink-400">{u.correo}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge tone={u.rol === "admin" ? "brand" : "neutral"}>
                {u.rol === "admin" ? "Admin" : "Vendedor"}
              </Badge>
              {!u.activo && <Badge tone="danger">Inactivo</Badge>}
            </div>
          </button>
        ))}
      </div>

      <Sheet
        open={sheetAbierto}
        onClose={() => setSheetAbierto(false)}
        title={editando ? "Editar usuario" : "Nuevo usuario"}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            try {
              await guardarUsuario(
                {
                  nombre: form.get("nombre"),
                  correo: form.get("correo"),
                  rol: form.get("rol"),
                  activo: editando ? form.get("activo") === "on" : true,
                  clave: form.get("clave"),
                },
                editando?.id
              );
              setSheetAbierto(false);
            } catch (err) {
              setError(err.message);
            }
          }}
          className="flex flex-col gap-4"
        >
          <Field label="Nombre completo">
            <input
              required
              name="nombre"
              defaultValue={editando?.nombre}
              placeholder="Nombre y apellido"
              className={inputClass(false)}
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              required
              name="correo"
              type="email"
              defaultValue={editando?.correo}
              placeholder="correo@almacen.cl"
              className={inputClass(false)}
            />
          </Field>
          <Field label="Rol">
            <select name="rol" defaultValue={editando?.rol ?? "vendedor"} className={inputClass(false)}>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </Field>
          {!editando && (
            <Field label="Contraseña temporal" hint="Mínimo 8 caracteres.">
              <input required name="clave" type="password" minLength="8" className={inputClass(false)} />
            </Field>
          )}
          {editando && (
            <label className="flex items-center justify-between rounded-xl border border-ink-200 px-3.5 py-3">
              <span className="text-sm font-medium text-ink-700">Cuenta activa</span>
              <input
                name="activo"
                type="checkbox"
                defaultChecked={editando.activo}
                className="size-5 accent-brand-500"
              />
            </label>
          )}
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="mt-2">
            {editando ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </form>
      </Sheet>
    </div>
  );
}
