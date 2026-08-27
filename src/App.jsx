import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductFormPage from "./pages/admin/ProductFormPage";
import MermasPage from "./pages/admin/MermasPage";
import UsersPage from "./pages/admin/UsersPage";
import MorePage from "./pages/admin/MorePage";
import MercadoPagoConfigPage from "./pages/admin/MercadoPagoConfigPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SalePage from "./pages/ventas/SalePage";
import CheckoutPage from "./pages/ventas/CheckoutPage";
import SalesHistoryPage from "./pages/ventas/SalesHistoryPage";

function Home() {
  const { usuario, esAdmin } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return <Navigate to={esAdmin ? "/admin" : "/venta"} replace />;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthenticatedLayout requireAdmin />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/productos" element={<ProductListPage />} />
          <Route path="/admin/productos/nuevo" element={<ProductFormPage />} />
          <Route path="/admin/productos/:id" element={<ProductFormPage />} />
          <Route path="/admin/informes" element={<ReportsPage />} />
          <Route path="/admin/mas" element={<MorePage />} />
          <Route path="/admin/mermas" element={<MermasPage />} />
          <Route path="/admin/usuarios" element={<UsersPage />} />
          <Route path="/admin/mercado-pago" element={<MercadoPagoConfigPage />} />
        </Route>

        <Route element={<AuthenticatedLayout />}>
          <Route path="/venta" element={<SalePage />} />
          <Route path="/venta/cobrar" element={<CheckoutPage />} />
          <Route path="/venta/historial" element={<SalesHistoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
