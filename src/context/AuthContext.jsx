import { createContext, useContext, useMemo, useState } from "react";
import { usuarios } from "../data/mockData";

// Autenticación simulada: en esta etapa de diseño no hay Supabase conectado.
// E0-05 se resolverá con Supabase Auth; aquí solo se valida contra el mock.
const AuthContext = createContext(null);

const STORAGE_KEY = "almacen.sesion";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = sessionStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : null;
  });
  const [error, setError] = useState("");

  const login = (correo, clave) => {
    setError("");
    const encontrado = usuarios.find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase());

    if (!encontrado) {
      setError("No existe una cuenta con ese correo.");
      return false;
    }
    if (!encontrado.activo) {
      setError("Este usuario está desactivado. Contacta al administrador.");
      return false;
    }
    if (clave.length < 4) {
      setError("Contraseña incorrecta.");
      return false;
    }

    setUsuario(encontrado);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(encontrado));
    return true;
  };

  const logout = () => {
    setUsuario(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ usuario, login, logout, error, esAdmin: usuario?.rol === "admin" }),
    [usuario, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
