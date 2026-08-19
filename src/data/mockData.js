// Datos de ejemplo — la app aún no está conectada a Supabase.
// Sirven solo para poder diseñar y presentar el flujo completo de las pantallas.

export const categorias = [
  { id: "bebidas", nombre: "Bebidas" },
  { id: "dulces", nombre: "Dulces y chocolates" },
  { id: "panaderia", nombre: "Panadería" },
  { id: "abarrotes", nombre: "Abarrotes" },
  { id: "cafe", nombre: "Café e infusiones" },
  { id: "galletas", nombre: "Galletas y snacks" },
];

export const productos = [
  {
    id: "p1",
    codigoBarra: "7801234567890",
    nombre: "Bebida Cola 1.5L",
    categoriaId: "bebidas",
    precio: 1800,
    stock: 34,
    stockCritico: 10,
    activo: true,
  },
  {
    id: "p2",
    codigoBarra: "7801234567891",
    nombre: "Agua Mineral 500ml",
    categoriaId: "bebidas",
    precio: 900,
    stock: 8,
    stockCritico: 12,
    activo: true,
  },
  {
    id: "p3",
    codigoBarra: "7801234567892",
    nombre: "Chocolate Amargo 40g",
    categoriaId: "dulces",
    precio: 700,
    stock: 25,
    stockCritico: 8,
    activo: true,
  },
  {
    id: "p4",
    codigoBarra: "7801234567893",
    nombre: "Caramelos Surtidos 100g",
    categoriaId: "dulces",
    precio: 1200,
    stock: 4,
    stockCritico: 6,
    activo: true,
  },
  {
    id: "p5",
    codigoBarra: "7801234567894",
    nombre: "Marraqueta (unidad)",
    categoriaId: "panaderia",
    precio: 150,
    stock: 60,
    stockCritico: 20,
    activo: true,
  },
  {
    id: "p6",
    codigoBarra: "7801234567895",
    nombre: "Hallulla (unidad)",
    categoriaId: "panaderia",
    precio: 150,
    stock: 5,
    stockCritico: 15,
    activo: true,
  },
  {
    id: "p7",
    codigoBarra: "7801234567896",
    nombre: "Café Molido 250g",
    categoriaId: "cafe",
    precio: 3200,
    stock: 14,
    stockCritico: 5,
    activo: true,
  },
  {
    id: "p8",
    codigoBarra: "7801234567897",
    nombre: "Té en Hebras 100g",
    categoriaId: "cafe",
    precio: 2100,
    stock: 9,
    stockCritico: 5,
    activo: true,
  },
  {
    id: "p9",
    codigoBarra: "7801234567898",
    nombre: "Galletas de Avena 180g",
    categoriaId: "galletas",
    precio: 1350,
    stock: 3,
    stockCritico: 10,
    activo: true,
  },
  {
    id: "p10",
    codigoBarra: "7801234567899",
    nombre: "Papas Fritas 120g",
    categoriaId: "galletas",
    precio: 1500,
    stock: 22,
    stockCritico: 8,
    activo: true,
  },
  {
    id: "p11",
    codigoBarra: "7801234567900",
    nombre: "Arroz Grado 1 1kg",
    categoriaId: "abarrotes",
    precio: 1650,
    stock: 40,
    stockCritico: 10,
    activo: true,
  },
  {
    id: "p12",
    codigoBarra: "7801234567901",
    nombre: "Aceite Vegetal 1L",
    categoriaId: "abarrotes",
    precio: 3400,
    stock: 2,
    stockCritico: 6,
    activo: true,
  },
];

export const usuarios = [
  {
    id: "u1",
    nombre: "Marcela Rojas",
    correo: "admin@almacen.cl",
    rol: "admin",
    activo: true,
  },
  {
    id: "u2",
    nombre: "Pedro Soto",
    correo: "vendedor@almacen.cl",
    rol: "vendedor",
    activo: true,
  },
  {
    id: "u3",
    nombre: "Javiera Muñoz",
    correo: "javiera@almacen.cl",
    rol: "vendedor",
    activo: false,
  },
];

export const mermas = [
  {
    id: "m1",
    productoId: "p6",
    cantidad: 4,
    motivo: "vencimiento",
    fecha: "2026-08-17",
    usuario: "Marcela Rojas",
  },
  {
    id: "m2",
    productoId: "p9",
    cantidad: 2,
    motivo: "daño",
    fecha: "2026-08-15",
    usuario: "Marcela Rojas",
  },
];

const productoNombre = (id) => productos.find((p) => p.id === id)?.nombre ?? "Producto";

export const ventas = [
  {
    id: "v1001",
    fecha: "2026-08-19T10:15:00",
    vendedor: "Pedro Soto",
    estado: "completada",
    metodoPago: "Mercado Pago",
    items: [
      { productoId: "p1", cantidad: 2, precioUnit: 1800 },
      { productoId: "p3", cantidad: 3, precioUnit: 700 },
    ],
  },
  {
    id: "v1002",
    fecha: "2026-08-19T11:02:00",
    vendedor: "Pedro Soto",
    estado: "completada",
    metodoPago: "Efectivo",
    items: [
      { productoId: "p5", cantidad: 4, precioUnit: 150 },
      { productoId: "p7", cantidad: 1, precioUnit: 3200 },
    ],
  },
  {
    id: "v1003",
    fecha: "2026-08-19T11:40:00",
    vendedor: "Javiera Muñoz",
    estado: "anulada",
    metodoPago: "Efectivo",
    motivoAnulacion: "Cliente se arrepintió de la compra",
    items: [{ productoId: "p10", cantidad: 1, precioUnit: 1500 }],
  },
  {
    id: "v1004",
    fecha: "2026-08-18T16:20:00",
    vendedor: "Pedro Soto",
    estado: "completada",
    metodoPago: "Mercado Pago",
    items: [
      { productoId: "p2", cantidad: 6, precioUnit: 900 },
      { productoId: "p4", cantidad: 2, precioUnit: 1200 },
    ],
  },
];

export const calcularTotalVenta = (venta) =>
  venta.items.reduce((acc, it) => acc + it.cantidad * it.precioUnit, 0);

export { productoNombre };

export const formatoCLP = (valor) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(
    valor
  );
