import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Store, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Field, { inputClass } from "../../components/ui/Field";

export default function LoginPage() {
  const { usuario, login, error, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);

  if (usuario) return <Navigate to={esAdmin ? "/admin" : "/venta"} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);
    setTimeout(() => {
      const ok = login(correo, clave);
      setCargando(false);
      if (ok) navigate("/", { replace: true });
    }, 400);
  };

  const usarDemo = (correoDemo) => {
    setCorreo(correoDemo);
    setClave("demo1234");
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <div className="mx-auto mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
          <Store size={30} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Almacén App</h1>
          <p className="text-sm text-ink-400">Inventario y ventas para tu negocio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Correo electrónico">
          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
            />
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tucorreo@almacen.cl"
              className={`${inputClass(!!error)} pl-10`}
            />
          </div>
        </Field>

        <Field label="Contraseña">
          <div className="relative">
            <Lock
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
            />
            <input
              type={mostrarClave ? "text" : "password"}
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
              className={`${inputClass(!!error)} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setMostrarClave((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300"
            >
              {mostrarClave ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-dashed border-ink-200 p-4">
        <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-ink-400">
          Accesos de prueba (diseño sin conexión a datos reales)
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => usarDemo("admin@almacen.cl")}
            className="flex items-center justify-between rounded-xl bg-ink-100 px-3.5 py-2.5 text-left text-sm active:bg-ink-200"
          >
            <span className="font-medium text-ink-800">Administrador</span>
            <span className="text-ink-400">admin@almacen.cl</span>
          </button>
          <button
            type="button"
            onClick={() => usarDemo("vendedor@almacen.cl")}
            className="flex items-center justify-between rounded-xl bg-ink-100 px-3.5 py-2.5 text-left text-sm active:bg-ink-200"
          >
            <span className="font-medium text-ink-800">Vendedor</span>
            <span className="text-ink-400">vendedor@almacen.cl</span>
          </button>
        </div>
      </div>
    </div>
  );
}
