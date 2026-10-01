# App Inventario y Venta — Almacén de barrio

App móvil (React + Vite, empaquetada como APK con Capacitor) para digitalizar el inventario y las ventas de un almacén de barrio: ingreso de productos por código de barra, venta por escaneo, alertas de stock crítico e informes de gestión.

Ver el detalle funcional completo en [`backlog-plan-trabajo-app-inventario.md`](./backlog-plan-trabajo-app-inventario.md).

## Estado actual

Etapa funcional conectada: autenticación, productos, stock, ventas, mermas, usuarios e informes usan Supabase. El lector de códigos utiliza la cámara mediante ZXing.

## Stack técnico

- **React 19 + Vite** — SPA de la aplicación.
- **Tailwind CSS v4** — estilos, con diseño _mobile-first_.
- **React Router 7** — navegación entre pantallas.
- **Capacitor** — empaqueta la SPA como app nativa Android (APK). Config en `capacitor.config.json`.
- **lucide-react** — iconografía.
- **Supabase** — PostgreSQL, Auth, API, políticas RLS y funciones transaccionales.

## Cómo correr el proyecto

```bash
npm install
Copy-Item .env.example .env.local
npm run dev       # http://localhost:5173, pensado para verse en un viewport móvil
```

Completa en `.env.local` la URL y la clave pública del proyecto. Nunca agregues la clave secreta ni la contraseña de base de datos a variables `VITE_*`.

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
  context/      AuthContext, DataContext y CartContext
  data/         mockData.js — utilidades de formato y datos históricos de referencia
  lib/          cliente de Supabase
  pages/
    auth/       Login
    admin/      Dashboard, Productos (listado/alta/edición), Mermas, Usuarios e Informes
    ventas/     Venta (escaneo + carrito), Cobro/checkout, Historial de ventas (anulación)
```

## Accesos de prueba (Supabase Auth)

| Rol           | Correo                | Notas                                                |
| ------------- | --------------------- | ---------------------------------------------------- |
| Administrador | `admin@almacen.cl`    | Ve Dashboard, Productos, Informes, Usuarios y Mermas |
| Vendedor      | `vendedor@almacen.cl` | Ve Venta (escaneo/carrito) e Historial de ventas     |

Contraseña inicial para ambos accesos: `demo1234`. Debe reemplazarse antes de usar la aplicación en producción.

## Base de datos

El esquema versionado está en `supabase/migrations`. Incluye RLS y funciones transaccionales para registrar ventas, mermas y anulaciones sin dejar el stock en un estado parcial.

## Ramas del proyecto

Ver la estrategia completa en la sección 3 del backlog. Resumen:

```
main                → versión estable / lista para generar APK
 └── develop         → integración de todos los módulos
      ├── feature/login-auth
      ├── feature/setup-bd
      ├── feature/modulo1-mantenedores
      ├── feature/modulo2-ventas
      ├── feature/modulo2-lector-codigo
      └── feature/modulo3-informes
```

Todo merge hacia `develop` se hace vía Pull Request, con revisión de al menos otro integrante.
