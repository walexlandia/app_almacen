import { createContext, useContext, useMemo, useState } from "react";

// Carrito de la venta en curso (Módulo 2). Vive solo en memoria: cada
// lectura de código suma 1 unidad, tal como pide el backlog (M2-01/M2-03).
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { producto, cantidad }

  const agregarProducto = (producto) => {
    setItems((prev) => {
      const existente = prev.find((it) => it.producto.id === producto.id);
      if (existente) {
        return prev.map((it) => (it.producto.id === producto.id ? { ...it, cantidad: it.cantidad + 1 } : it));
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const quitarUnidad = (productoId) => {
    setItems((prev) =>
      prev
        .map((it) => (it.producto.id === productoId ? { ...it, cantidad: it.cantidad - 1 } : it))
        .filter((it) => it.cantidad > 0)
    );
  };

  const eliminarProducto = (productoId) => {
    setItems((prev) => prev.filter((it) => it.producto.id !== productoId));
  };

  const vaciarCarrito = () => setItems([]);

  const total = useMemo(() => items.reduce((acc, it) => acc + it.cantidad * it.producto.precio, 0), [items]);

  const cantidadItems = useMemo(() => items.reduce((acc, it) => acc + it.cantidad, 0), [items]);

  const value = {
    items,
    agregarProducto,
    quitarUnidad,
    eliminarProducto,
    vaciarCarrito,
    total,
    cantidadItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
