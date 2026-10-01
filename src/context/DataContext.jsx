import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { crearClienteAuthAislado, supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);
const inicial = { categorias: [], productos: [], usuarios: [], mermas: [], ventas: [] };
const fallo = (error) => {
  throw new Error(error?.message || "No fue posible completar la operación.");
};

const productoDesdeDb = (p) => ({
  id: p.id,
  codigoBarra: p.codigo_barra,
  nombre: p.nombre,
  categoriaId: p.categoria_id,
  precio: p.precio,
  stock: p.stock,
  stockCritico: p.stock_critico,
  activo: p.activo,
});

const ventaDesdeDb = (v) => ({
  id: v.id,
  fecha: v.fecha,
  vendedor: v.vendedor,
  estado: v.estado,
  metodoPago: v.metodo_pago,
  motivoAnulacion: v.motivo_anulacion,
  items: (v.detalle_venta ?? []).map((d) => ({
    productoId: d.producto_id,
    cantidad: d.cantidad,
    precioUnit: d.precio_unitario,
  })),
});

export function DataProvider({ children }) {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(inicial);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  const recargar = useCallback(async () => {
    if (!usuario) {
      setDatos(inicial);
      return;
    }
    setCargando(true);
    setErrorCarga("");
    const [categorias, productos, usuarios, mermas, ventas] = await Promise.all([
      supabase.from("categorias").select("id,nombre").order("nombre"),
      supabase.from("productos").select("*").order("nombre"),
      supabase.from("usuarios").select("id,nombre,correo,rol,activo").order("nombre"),
      supabase.from("mermas").select("*").order("creado_en", { ascending: false }),
      supabase.from("ventas").select("*,detalle_venta(*)").order("fecha", { ascending: false }),
    ]);
    const error = [categorias, productos, usuarios, mermas, ventas].find((r) => r.error)?.error;
    if (error) {
      setErrorCarga(error.message);
    } else {
      setDatos({
        categorias: categorias.data,
        productos: productos.data.map(productoDesdeDb),
        usuarios: usuarios.data,
        mermas: mermas.data.map((m) => ({
          id: m.id,
          productoId: m.producto_id,
          cantidad: m.cantidad,
          motivo: m.motivo,
          fecha: m.fecha,
          usuario: m.usuario,
        })),
        ventas: ventas.data.map(ventaDesdeDb),
      });
    }
    setCargando(false);
  }, [usuario]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const guardarProducto = async (entrada, id = null) => {
    const payload = {
      nombre: entrada.nombre.trim(),
      categoria_id: entrada.categoriaId,
      precio: Number(entrada.precio),
      stock_critico: Number(entrada.stockCritico),
    };
    if (id) {
      const actual = datos.productos.find((p) => p.id === id);
      const { error } = await supabase
        .from("productos")
        .update({ ...payload, stock: actual.stock + Number(entrada.cantidad || 0) })
        .eq("id", id);
      if (error) fallo(error);
    } else {
      const { error } = await supabase.from("productos").insert({
        ...payload,
        codigo_barra: entrada.codigoBarra.trim(),
        stock: Number(entrada.cantidad),
      });
      if (error?.code === "23505") throw new Error("Ya existe un producto con ese código de barra.");
      if (error) fallo(error);
    }
    await recargar();
  };

  const darBajaProducto = async (id) => {
    const { error } = await supabase.from("productos").update({ activo: false }).eq("id", id);
    if (error) fallo(error);
    await recargar();
  };

  const guardarUsuario = async (entrada, id) => {
    if (!id) {
      if (!entrada.clave || entrada.clave.length < 8) {
        throw new Error("La contraseña temporal debe tener al menos 8 caracteres.");
      }
      const clienteAuth = crearClienteAuthAislado();
      const { error } = await clienteAuth.auth.signUp({
        email: entrada.correo.trim().toLowerCase(),
        password: entrada.clave,
        options: { data: { nombre: entrada.nombre.trim(), rol: entrada.rol } },
      });
      if (error) fallo(error);
      await recargar();
      return;
    }
    const { error } = await supabase
      .from("usuarios")
      .update({
        nombre: entrada.nombre.trim(),
        correo: entrada.correo.trim().toLowerCase(),
        rol: entrada.rol,
        activo: entrada.activo,
      })
      .eq("id", id);
    if (error?.code === "23505") throw new Error("Ya existe un usuario con ese correo.");
    if (error) fallo(error);
    await recargar();
  };

  const registrarMerma = async ({ productoId, cantidad, motivo }) => {
    const { error } = await supabase.rpc("registrar_merma", {
      p_producto_id: productoId,
      p_cantidad: Number(cantidad),
      p_motivo: motivo,
    });
    if (error) fallo(error);
    await recargar();
  };

  const registrarVenta = async ({ items }) => {
    const { data, error } = await supabase.rpc("registrar_venta", {
      p_items: items.map(({ producto, cantidad }) => ({ producto_id: producto.id, cantidad })),
    });
    if (error) fallo(error);
    await recargar();
    return data;
  };

  const anularVenta = async (id, motivo) => {
    const { error } = await supabase.rpc("anular_venta", { p_venta_id: id, p_motivo: motivo });
    if (error) fallo(error);
    await recargar();
  };

  const value = {
    ...datos,
    cargando,
    errorCarga,
    recargar,
    guardarProducto,
    darBajaProducto,
    guardarUsuario,
    registrarMerma,
    registrarVenta,
    anularVenta,
    productoNombre: (id) => datos.productos.find((p) => p.id === id)?.nombre ?? "Producto",
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de DataProvider");
  return ctx;
}
