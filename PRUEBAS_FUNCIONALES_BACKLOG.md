# Pruebas funcionales contra el backlog

Fecha de ejecución: 1 de octubre de 2026  
Entorno: desarrollo local, Vite, navegador integrado y Supabase remoto.

## Alcance

La historia M1-08, correspondiente a pagos externos, fue retirada del backlog por decisión del proyecto. La interfaz, las rutas, los datos de demostración y la documentación no ofrecen esa forma de pago.

## Resultado resumido

| Historia | Estado | Evidencia funcional |
| --- | --- | --- |
| E0-01 | Cumple | Instalación existente, estructura React/Vite, ESLint, Prettier, README; `lint` y `build` correctos. |
| E0-02 | Parcial | Existen `main`, `develop` y plantilla de PR. Las reglas remotas de protección no se verificaron en esta ejecución local. |
| E0-03 | Cumple | El esquema remoto contiene categorías, productos, usuarios, ventas, detalle y mermas, con relaciones, RLS y migraciones versionadas. |
| E0-04 | No verificable localmente | El tablero Trello es externo a la aplicación. |
| E0-05 | Cumple | Login, sesión persistente, cierre de sesión, perfiles y roles utilizan Supabase Auth. |
| M1-01 | Cumple localmente | Se creó “Producto QA” con código `9990001112223`, precio, categoría, cantidad 7 y mínimo 3. |
| M1-02 | Cumple localmente | Se editó a “Producto QA Editado” y se ingresaron 2 unidades, quedando stock 9. |
| M1-03 | Implementado, no ejecutado | Existe baja lógica con confirmación. No se eliminó información durante esta prueba. |
| M1-04 | Cumple | El listado mostró 13 productos con nombre, código, stock y precio. |
| M1-05 | Cumple | El panel y los listados muestran cinco productos en estado crítico. |
| M1-06 | Cumple localmente | Se creó “Usuario QA”, `qa@almacen.cl`, con rol vendedor y apareció en el listado. |
| M1-07 | Cumple | Se registró una merma de 2 unidades por daño; se descontó stock y apareció en el historial. |
| M1-08 | Fuera de alcance | Retirada por decisión del proyecto. |
| M2-01 | Parcial | El lector ZXing y el ingreso manual están integrados y compilan. La cámara física requiere prueba en un teléfono con permiso explícito. |
| M2-02 | Cumple | La búsqueda de “Producto QA” permitió agregar el resultado al carrito. |
| M2-03 | Cumple | Dos unidades mostraron subtotal y total correcto de $2.500. |
| M2-04 | Cumple | Se anuló la venta con motivo; el estado cambió a anulada y el stock se restituyó de 5 a 7. |
| M2-05 | Cumple | La búsqueda respondió en tiempo real y mostró precio y stock. |
| M3-01 | Cumple | Se agregó y probó el filtro por categoría; “Bebidas” devolvió solo Agua Mineral (8/12). |
| M3-02 | Cumple | El informe diario distinguió 0 ventas completas, 1 anulada y total vendido $0. |
| M3-03 | Cumple | El ranking de productos más vendidos se visualiza y excluye la venta anulada. |

## Pruebas técnicas

- `npm run lint`: correcto; conserva advertencias no bloqueantes ya identificadas.
- `npm run build`: correcto; genera `dist` y solo informa una advertencia de tamaño de bundle.
- Búsqueda global de referencias al proveedor de pagos excluido en `src` y `README`: sin coincidencias.

## Pendientes antes de producción

1. Validar el escaneo con cámara en un teléfono real y bajo HTTPS.
2. Ejecutar una prueba específica de baja lógica con datos desechables.
3. Verificar configuración remota de GitHub y Trello.

## Validación Supabase — 1 de octubre de 2026

- Login real confirmado para `admin@almacen.cl`.
- Perfil obtenido bajo RLS: Marcela Rojas, rol administrador, activo.
- Lectura remota confirmada: 12 productos y 6 categorías.
- Venta transaccional creada y anulada correctamente; stock restaurado de 34 a 34.
