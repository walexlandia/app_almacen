import { createContext, useContext, useState } from "react";
import {
  categorias,
  productos as productosIniciales,
  usuarios as usuariosIniciales,
  mermas as mermasIniciales,
  ventas as ventasIniciales,
} from "../data/mockData";

const DataContext = createContext(null);
const STORAGE_KEY = "almacen.datos.v1";

const clonar = (valor) => JSON.parse(JSON.stringify(valor));
const estadoInicial = () => {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Si el almacenamiento está bloqueado, la app continúa con datos iniciales.
  }
  return {
    productos: clonar(productosIniciales),
    usuarios: clonar(usuariosIniciales),
    mermas: clonar(mermasIniciales),
    ventas: clonar(ventasIniciales),
  };
};

const crearId = (prefijo) => `${prefijo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function DataProvider({ children }) {
  const [datos, setDatos] = useState(estadoInicial);

  const actualizar = (reductor) => {
    setDatos((prev) => {
      const siguiente = reductor(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente));
      } catch {
        // Mantiene la sesión funcional aunque el navegador bloquee el almacenamiento.
      }
      return siguiente;
    });
  };

  const guardarProducto = (entrada, id = null) => {
    const codigo = entrada.codigoBarra.trim();
    const duplicado = datos.productos.some((p) => p.codigoBarra === codigo && p.id !== id);
    if (duplicado) throw new Error("Ya existe un producto con ese código de barra.");

    actualizar((prev) => {
      if (id) {
        return {
          ...prev,
          productos: prev.productos.map((p) =>
            p.id === id
              ? {
                  ...p,
                  nombre: entrada.nombre.trim(),
                  categoriaId: entrada.categoriaId,
                  precio: Number(entrada.precio),
                  stockCritico: Number(entrada.stockCritico),
                  stock: p.stock + Number(entrada.cantidad || 0),
                }
              : p
          ),
        };
      }
      const nuevo = {
        id: crearId("p"),
        nombre: entrada.nombre.trim(),
        codigoBarra: codigo,
        categoriaId: entrada.categoriaId,
        precio: Number(entrada.precio),
        stock: Number(entrada.cantidad),
        stockCritico: Number(entrada.stockCritico),
        activo: true,
      };
      return { ...prev, productos: [nuevo, ...prev.productos] };
    });
  };

  const darBajaProducto = (id) =>
    actualizar((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => (p.id === id ? { ...p, activo: false } : p)),
    }));

  const guardarUsuario = (entrada, id = null) => {
    const correo = entrada.correo.trim().toLowerCase();
    if (datos.usuarios.some((u) => u.correo.toLowerCase() === correo && u.id !== id)) {
      throw new Error("Ya existe un usuario con ese correo.");
    }
    actualizar((prev) => {
      const usuario = {
        id: id ?? crearId("u"),
        nombre: entrada.nombre.trim(),
        correo,
        rol: entrada.rol,
        activo: entrada.activo,
      };
      return {
        ...prev,
        usuarios: id ? prev.usuarios.map((u) => (u.id === id ? usuario : u)) : [usuario, ...prev.usuarios],
      };
    });
  };

  const registrarMerma = ({ productoId, cantidad, motivo, usuario }) => {
    const unidades = Number(cantidad);
    const producto = datos.productos.find((p) => p.id === productoId);
    if (!producto || unidades < 1) throw new Error("Producto o cantidad inválida.");
    if (producto.stock < unidades) throw new Error("La merma supera el stock disponible.");
    actualizar((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => (p.id === productoId ? { ...p, stock: p.stock - unidades } : p)),
      mermas: [
        {
          id: crearId("m"),
          productoId,
          cantidad: unidades,
          motivo,
          fecha: new Date().toISOString().slice(0, 10),
          usuario,
        },
        ...prev.mermas,
      ],
    }));
  };

  const registrarVenta = ({ items, vendedor, metodoPago }) => {
    for (const item of items) {
      const producto = datos.productos.find((p) => p.id === item.producto.id);
      if (!producto?.activo || producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${item.producto.nombre}.`);
      }
    }
    const venta = {
      id: crearId("v"),
      fecha: new Date().toISOString(),
      vendedor,
      estado: "completada",
      metodoPago,
      items: items.map(({ producto, cantidad }) => ({
        productoId: producto.id,
        cantidad,
        precioUnit: producto.precio,
      })),
    };
    actualizar((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => {
        const item = venta.items.find((it) => it.productoId === p.id);
        return item ? { ...p, stock: p.stock - item.cantidad } : p;
      }),
      ventas: [venta, ...prev.ventas],
    }));
    return venta;
  };

  const anularVenta = (id, motivo) => {
    const venta = datos.ventas.find((v) => v.id === id);
    if (!venta || venta.estado === "anulada") return;
    actualizar((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => {
        const item = venta.items.find((it) => it.productoId === p.id);
        return item ? { ...p, stock: p.stock + item.cantidad } : p;
      }),
      ventas: prev.ventas.map((v) =>
        v.id === id ? { ...v, estado: "anulada", motivoAnulacion: motivo.trim() || "Sin motivo" } : v
      ),
    }));
  };

  const value = {
    ...datos,
    categorias,
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
