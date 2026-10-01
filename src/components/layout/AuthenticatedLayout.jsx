import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BottomNav from "./BottomNav";

export default function AuthenticatedLayout({ requireAdmin = false }) {
  const { usuario, esAdmin, cargando } = useAuth();

  if (cargando) return <div className="m-auto text-sm text-ink-400">Cargando sesión...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (requireAdmin && !esAdmin) return <Navigate to="/venta" replace />;

  return (
    <>
      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
