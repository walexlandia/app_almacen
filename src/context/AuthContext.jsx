import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarPerfil = async (authUser) => {
    if (!authUser) {
      setUsuario(null);
      setCargando(false);
      return;
    }
    const { data, error: perfilError } = await supabase
      .from("usuarios")
      .select("id,nombre,correo,rol,activo")
      .eq("id", authUser.id)
      .single();
    if (perfilError || !data?.activo) {
      await supabase.auth.signOut();
      setUsuario(null);
      setError(perfilError ? "No fue posible cargar el perfil." : "La cuenta está desactivada.");
    } else {
      setUsuario(data);
    }
    setCargando(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => cargarPerfil(data.session?.user));
    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setTimeout(() => cargarPerfil(sesion?.user), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const login = async (correo, clave) => {
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: correo.trim().toLowerCase(),
      password: clave,
    });
    if (authError) {
      setError("Correo o contraseña incorrectos.");
      return false;
    }
    await cargarPerfil(data.user);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  const value = { usuario, login, logout, error, cargando, esAdmin: usuario?.rol === "admin" };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
