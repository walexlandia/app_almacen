# App Inventario y Venta — Almacén de barrio

App móvil (React + Vite, empaquetada como APK con Capacitor) para digitalizar el inventario y las ventas de un almacén de barrio: ingreso de productos por código de barra, venta por escaneo, alertas de stock crítico e informes de gestión.

Ver el detalle funcional completo en [`backlog-plan-trabajo-app-inventario.md`](./backlog-plan-trabajo-app-inventario.md).

## Estado actual

Etapa de **diseño de interfaz sin datos reales**: todas las pantallas están construidas y navegables con datos de ejemplo (`src/data/mockData.js`). Aún no hay conexión a Supabase ni integraciones reales (lector de código de barra, Mercado Pago) — esos quedan para las ramas `feature/*` correspondientes.

## Stack técnico

- **React 19 + Vite** — SPA de la aplicación.
- **Tailwind CSS v4** — estilos, con diseño _mobile-first_.
- **React Router 7** — navegación entre pantallas.
- **Capacitor** — empaqueta la SPA como app nativa Android (APK). Config en `capacitor.config.json`.
- **lucide-react** — iconografía.

## Cómo correr el proyecto

```bash
npm install
npm run dev       # http://localhost:5173, pensado para verse en un viewport móvil
```

Para simular el formato app móvil en un navegador de escritorio, usa las devtools en modo responsive (~390–430px de ancho) o abre la URL de red (`Network`) desde el celular.

Otros comandos:

```bash
npm run build      # build de producción a /dist
npm run lint        # oxlint
npm run cap:sync    # build + sincroniza con el proyecto nativo de Capacitor
npm run cap:android # abre el proyecto Android en Android Studio (requiere `npx cap add android`)
```

## Estructura de carpetas

```
src/
  components/
    layout/     AppShell (marco tipo celular), TopBar, BottomNav, AuthenticatedLayout
    ui/         Button, Card, Badge, Field, Sheet (bottom sheet), EmptyState, StatCard, BarcodeScannerSheet
  context/      AuthContext (sesión/rol simulada), CartContext (venta en curso)
  data/         mockData.js — productos, ventas, mermas, usuarios de ejemplo
  pages/
    auth/       Login
    admin/      Dashboard, Productos (listado/alta/edición), Mermas, Usuarios, Informes, Más, Mercado Pago
    ventas/     Venta (escaneo + carrito), Cobro/checkout, Historial de ventas (anulación)
```

## Accesos de prueba (login simulado)

| Rol           | Correo                | Notas                                                             |
| ------------- | --------------------- | ----------------------------------------------------------------- |
| Administrador | `admin@almacen.cl`    | Ve Dashboard, Productos, Informes, Usuarios, Mermas, Mercado Pago |
| Vendedor      | `vendedor@almacen.cl` | Ve Venta (escaneo/carrito) e Historial de ventas                  |

Cualquier contraseña de 4+ caracteres funciona (login mockeado en `AuthContext`, sin backend aún).

## Ramas del proyecto

Ver la estrategia completa en la sección 3 del backlog. Resumen:

```
main                → versión estable / lista para generar APK
 └── develop         → integración de todos los módulos
      ├── feature/login-auth
      ├── feature/setup-bd
      ├── feature/modulo1-mantenedores
      ├── feature/modulo1-mercadopago
      ├── feature/modulo2-ventas
      ├── feature/modulo2-lector-codigo
      └── feature/modulo3-informes
```

Todo merge hacia `develop` se hace vía Pull Request, con revisión de al menos otro integrante.
