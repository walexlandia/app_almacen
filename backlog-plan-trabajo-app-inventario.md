# App Inventario y Venta — Backlog y Plan de Trabajo

**Proyecto:** Ramo de Arquitectura de Software y Desarrollo de Proyectos
**Tecnologías:** React (Native / con generación de APK), Supabase, GitHub, Vercel, Trello

---

## 0. Descripción de la app

La aplicación está pensada para un **local tipo almacén de barrio**, que vende productos como dulces, chocolates, bebidas, café, galletas, panes, entre otros. Su objetivo es digitalizar y controlar el inventario y las ventas del negocio desde un dispositivo móvil.

**Ingreso de productos (mantenedor):** el registro de productos se realiza mediante **lectura de código de barra**, indicando además la **cantidad que ingresa** al stock. El mantenedor permite registrar múltiples productos, editarlos, definir un **stock crítico por producto**, y gestionar **mermas** (pérdidas por daño, vencimiento, etc.) que descuentan stock automáticamente. Cuando un producto alcanza su stock crítico, el sistema genera una **alerta**.

**Proceso de venta:** también se basa en la lectura de código de barra — a diferencia del ingreso, aquí **no se solicita cantidad manual**, cada lectura agrega una unidad del producto. A medida que se leen los productos (o se buscan manualmente por nombre en el listado, cuando no se cuenta con el código a mano), se va armando una **lista visual** con los productos escaneados y su **total acumulado**, hasta generar la venta. Las ventas ya registradas se pueden **anular**.

**Informes:** el sistema entrega información de gestión como **ventas del día**, **productos más vendidos**, y a partir de los productos en **stock crítico** se puede generar un **informe de compras** sugerido para reposición.

---

## 1. Equipo y responsabilidades

| Equipo       | Responsabilidad                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Profesor** | Plantilla base del proyecto, configuración de GitHub, diseño y setup de Base de Datos (Supabase), configuración de Trello, Login/autenticación de usuarios |
| **Grupo 1**  | Integración con Mercado Pago, Módulo 1 – Mantenedores                                                                                                      |
| **Grupo 2**  | Integración lector de código de barra, Módulo 2 – Ventas, Módulo 3 – Informes                                                                              |

---

## 2. Product Backlog

Prioridad: 🔴 Alta · 🟡 Media · 🟢 Baja
Estimación en Story Points (SP), escala Fibonacci: 1, 2, 3, 5, 8, 13

### Épica 0 — Base del proyecto (Profesor)

| ID    | Historia de Usuario                                                                                                                               | Criterios de Aceptación                                                                                                                                                          | Prioridad | SP  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --- |
| E0-01 | Como equipo de desarrollo, quiero una plantilla base del proyecto React, para partir todos desde la misma estructura de carpetas y configuración. | - Repo inicial con estructura de carpetas definida.<br>- Configuración de ESLint/Prettier.<br>- README con instrucciones de instalación.                                         | 🔴        | 5   |
| E0-02 | Como equipo, quiero un repositorio de GitHub organizado, para poder trabajar en paralelo sin pisarnos el código.                                  | - Repo creado con rama `main` y `develop`.<br>- Reglas de protección de rama configuradas.<br>- Plantilla de Pull Request definida.                                              | 🔴        | 3   |
| E0-03 | Como equipo, quiero la Base de Datos en Supabase modelada, para que todos los módulos consuman el mismo esquema de datos.                         | - Tablas: productos, stock, ventas, detalle_venta, usuarios, mermas, categorías.<br>- Relaciones y llaves foráneas definidas.<br>- Documentación del modelo entregada al equipo. | 🔴        | 8   |
| E0-04 | Como equipo, quiero un tablero en Trello, para dar seguimiento visual al backlog y sprints.                                                       | - Tablero con columnas: Backlog, To Do, In Progress, In Review, Done.<br>- Tarjetas iniciales cargadas por épica.                                                                | 🟡        | 2   |
| E0-05 | Como usuario del sistema, quiero iniciar sesión con mis credenciales, para acceder a las funciones según mi rol.                                  | - Login con Supabase Auth.<br>- Validación de credenciales incorrectas.<br>- Redirección según rol (admin/vendedor).                                                             | 🔴        | 5   |

---

### Épica 1 — Módulo Mantenedores (Grupo 1)

| ID    | Historia de Usuario                                                                                                           | Criterios de Aceptación                                                                                                                                                       | Prioridad | SP  |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --- |
| M1-01 | Como administrador, quiero registrar productos con su código de barra y cantidad inicial, para llevar control del inventario. | - Formulario con nombre, código de barra, precio, categoría, cantidad.<br>- Validación de código de barra único.<br>- Confirmación visual al guardar.                         | 🔴        | 5   |
| M1-02 | Como administrador, quiero editar los datos de un producto existente, para corregir o actualizar su información.              | - Búsqueda del producto por código o nombre.<br>- Edición de todos los campos excepto código de barra (o con validación de duplicado).<br>- Guardado exitoso actualiza la BD. | 🔴        | 3   |
| M1-03 | Como administrador, quiero eliminar (o dar de baja) un producto, para quitarlo del catálogo activo.                           | - Confirmación antes de eliminar.<br>- Eliminación lógica (soft delete) recomendada para mantener historial de ventas.                                                        | 🟡        | 2   |
| M1-04 | Como administrador, quiero listar todos los productos, para visualizar el catálogo completo.                                  | - Listado paginado o con scroll.<br>- Muestra nombre, código, stock actual, precio.                                                                                           | 🔴        | 3   |
| M1-05 | Como administrador, quiero recibir una alerta cuando un producto llegue a stock crítico, para reponerlo a tiempo.             | - Definición de umbral de stock crítico por producto.<br>- Indicador visual (color/ícono) en el listado.<br>- Notificación o sección dedicada a productos críticos.           | 🔴        | 5   |
| M1-06 | Como administrador, quiero gestionar usuarios del sistema (crear, editar, desactivar), para controlar quién accede a la app.  | - CRUD de usuarios.<br>- Asignación de rol (admin/vendedor).<br>- Validación de correo/usuario único.                                                                         | 🔴        | 5   |
| M1-07 | Como administrador, quiero registrar mermas de productos, para reflejar pérdidas por daño, vencimiento u otra causa.          | - Formulario de merma: producto, cantidad, motivo, fecha.<br>- Descuento automático del stock al registrar.<br>- Historial de mermas consultable.                             | 🟡        | 5   |
| M1-08 | Como administrador, quiero integrar Mercado Pago como medio de pago, para procesar cobros desde la app.                       | - Conexión con API/checkout de Mercado Pago.<br>- Confirmación de pago exitoso/fallido.<br>- Asociación del pago a la venta correspondiente.                                  | 🔴        | 8   |

---

### Épica 2 — Módulo Ventas (Grupo 2)

| ID    | Historia de Usuario                                                                                                             | Criterios de Aceptación                                                                                                                                      | Prioridad | SP  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | --- |
| M2-01 | Como vendedor, quiero escanear el código de barra de un producto con la cámara del celular, para agregarlo rápido a la venta.   | - Integración de lector de código de barra (cámara).<br>- Al escanear, se agrega el producto a la venta actual.<br>- Manejo de error si el código no existe. | 🔴        | 8   |
| M2-02 | Como vendedor, quiero buscar y seleccionar un producto manualmente, para agregarlo a la venta cuando no tengo el código a mano. | - Buscador por nombre o categoría.<br>- Selección agrega el producto al carrito de venta.                                                                    | 🔴        | 3   |
| M2-03 | Como vendedor, quiero ver el detalle de la venta en curso (productos, cantidades, total), para confirmar antes de cobrar.       | - Carrito visible con listado de productos y subtotal.<br>- Cálculo automático del total.                                                                    | 🔴        | 3   |
| M2-04 | Como vendedor, quiero anular una venta, para corregir errores de cobro o devoluciones.                                          | - Opción de anular venta ya registrada.<br>- Reversa automática de stock descontado.<br>- Registro de motivo de anulación.                                   | 🟡        | 5   |
| M2-05 | Como vendedor, quiero buscar productos dentro del módulo de ventas, para verificar precio o stock antes de vender.              | - Buscador con resultados en tiempo real.<br>- Muestra precio y stock disponible.                                                                            | 🟡        | 2   |

---

### Épica 3 — Módulo Informes (Grupo 2)

| ID    | Historia de Usuario                                                                                            | Criterios de Aceptación                                                                  | Prioridad | SP  |
| ----- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------- | --- |
| M3-01 | Como administrador, quiero ver un listado de productos en stock crítico, para gestionar compras a proveedores. | - Listado filtrable por categoría.<br>- Muestra stock actual vs. stock mínimo.           | 🔴        | 3   |
| M3-02 | Como administrador, quiero ver las ventas del día, para conocer el rendimiento diario del negocio.             | - Listado de ventas del día actual.<br>- Total vendido y cantidad de transacciones.      | 🔴        | 3   |
| M3-03 | Como administrador, quiero ver los productos más vendidos, para tomar decisiones de compra e inventario.       | - Ranking de productos por cantidad vendida.<br>- Filtro por rango de fechas (opcional). | 🟡        | 5   |

**Total estimado del backlog:** 78 SP (referencial, ajustar según velocidad real del equipo)

---

## 3. Estrategia de ramas en GitHub

Se usará un modelo simplificado tipo **Git Flow**, adaptado a 3 equipos trabajando en paralelo:

```
main                → versión estable, lista para generar APK / desplegar
 └── develop         → rama de integración de todos los módulos
      ├── feature/login-auth              (Profesor)
      ├── feature/setup-bd                (Profesor)
      ├── feature/modulo1-mantenedores    (Grupo 1)
      ├── feature/modulo1-mercadopago     (Grupo 1)
      ├── feature/modulo2-ventas          (Grupo 2)
      ├── feature/modulo2-lector-codigo   (Grupo 2)
      └── feature/modulo3-informes        (Grupo 2)
```

### Reglas de trabajo

1. **`main`**: solo recibe merges desde `develop`, cuando una versión fue probada. Cada merge a `main` puede marcar un tag de versión (`v1.0`, `v1.1`, etc.) y dispara la generación de la APK.
2. **`develop`**: rama de integración continua. Todos los `feature/*` se integran aquí primero.
3. **`feature/*`**: cada grupo crea su rama desde `develop`, nombrada según el módulo que le corresponde (ver tabla de responsabilidades). Nadie trabaja directo sobre `develop` o `main`.
4. **Pull Requests obligatorios**: todo merge hacia `develop` se hace vía PR, con al menos 1 revisión de otro integrante (idealmente de otro grupo, para fomentar code review cruzado).
5. **Convención de commits** (sugerida): `tipo(módulo): descripción corta`
   - Ej: `feat(modulo1): agrega CRUD de productos`
   - Ej: `fix(modulo2): corrige cálculo de total en venta`
   - Tipos sugeridos: `feat`, `fix`, `refactor`, `docs`, `test`
6. **Trello ↔ GitHub**: cada tarjeta de Trello referencia el ID de la historia (ej. `M1-01`) y se vincula al PR correspondiente para trazabilidad.

---

## 4. Plan de trabajo (Sprints)

Se propone un plan de **4 sprints de 2 semanas** (ajustable a la duración real del ramo). Cada sprint cierra con una demo funcional y merge a `develop`.

### Sprint 0 — Fundacional (Profesor + todos)

**Objetivo:** dejar la base lista para que los grupos puedan empezar a construir sin bloqueos.

| Responsable | Tareas                                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| Profesor    | E0-01 Plantilla React, E0-02 Setup GitHub (ramas, reglas), E0-03 Modelo BD en Supabase, E0-04 Setup Trello           |
| Grupo 1 y 2 | Onboarding al repo, revisión del modelo de datos, definición de dependencias/librerías (lector QR, SDK Mercado Pago) |

**Entregable:** repo configurado, BD creada, tableros listos, ramas `develop` y `feature/*` creadas.

---

### Sprint 1 — Autenticación y bases de cada módulo

| Grupo    | Historias                                                                       |
| -------- | ------------------------------------------------------------------------------- |
| Profesor | E0-05 Login de usuarios                                                         |
| Grupo 1  | M1-01 CRUD productos (crear/listar), M1-04 Listado de productos                 |
| Grupo 2  | M2-01 Lector de código de barra (integración base), M3-01 Listado stock crítico |

**Entregable:** login funcional, alta de productos operativa, primer prototipo de escaneo.

---

### Sprint 2 — Funcionalidad core de cada módulo

| Grupo   | Historias                                                                           |
| ------- | ----------------------------------------------------------------------------------- |
| Grupo 1 | M1-02 Editar producto, M1-05 Stock crítico, M1-06 Administración de usuarios        |
| Grupo 2 | M2-02 Búsqueda manual de producto, M2-03 Detalle de venta, M2-05 Buscador en ventas |

**Entregable:** módulo de mantenedores casi completo, primer flujo de venta funcionando de punta a punta (sin pago).

---

### Sprint 3 — Pagos, mermas, anulaciones e informes

| Grupo   | Historias                                                                         |
| ------- | --------------------------------------------------------------------------------- |
| Grupo 1 | M1-08 Integración Mercado Pago, M1-07 Registro de mermas, M1-03 Eliminar producto |
| Grupo 2 | M2-04 Anulación de ventas, M3-02 Ventas del día, M3-03 Productos más vendidos     |

**Entregable:** venta completa con pago real vía Mercado Pago, informes básicos disponibles.

---

### Sprint 4 — Integración final, pruebas y generación de APK

| Todos                     | Tareas                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| Todos los grupos          | Integración de ramas `feature/*` a `develop`, pruebas end-to-end, corrección de bugs, pulido de UI |
| Profesor + representantes | Merge final `develop → main`, generación de la APK, pruebas en dispositivo real                    |

**Entregable:** APK generada, funcional, con todos los módulos integrados.

---

## 5. Recomendaciones de gestión

- **Daily/checkpoint corto** entre grupos al menos 2 veces por semana, para detectar dependencias cruzadas (ej. Grupo 2 depende del modelo de productos que crea Grupo 1).
- **Definición de "Terminado" (Definition of Done)** por historia: código en `develop`, sin errores de consola, probado por al menos otra persona, tarjeta de Trello movida a "Done".
- **Congelar el modelo de Base de Datos** al final del Sprint 0 para evitar romper el trabajo de otros grupos a mitad de camino.
- Mantener un canal de comunicación (Discord/WhatsApp) para avisos de cambios en `develop` que puedan afectar a otro grupo.

---

_Documento generado como guía de trabajo. Se recomienda ajustar estimaciones (SP) y duración de sprints según la carga real del ramo y disponibilidad del equipo._
