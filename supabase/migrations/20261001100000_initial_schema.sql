create extension if not exists pgcrypto;

create table if not exists public.categorias (
  id text primary key,
  nombre text not null unique
);

create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  correo text not null unique,
  rol text not null default 'vendedor' check (rol in ('admin', 'vendedor')),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  codigo_barra text not null unique,
  nombre text not null,
  categoria_id text not null references public.categorias(id),
  precio integer not null check (precio >= 0),
  stock integer not null default 0 check (stock >= 0),
  stock_critico integer not null default 0 check (stock_critico >= 0),
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists public.ventas (
  id uuid primary key default gen_random_uuid(),
  fecha timestamptz not null default now(),
  vendedor_id uuid references public.usuarios(id),
  vendedor text not null,
  estado text not null default 'completada' check (estado in ('completada', 'anulada')),
  metodo_pago text not null default 'Efectivo' check (metodo_pago = 'Efectivo'),
  motivo_anulacion text
);

create table if not exists public.detalle_venta (
  id bigint generated always as identity primary key,
  venta_id uuid not null references public.ventas(id) on delete cascade,
  producto_id uuid not null references public.productos(id),
  cantidad integer not null check (cantidad > 0),
  precio_unitario integer not null check (precio_unitario >= 0),
  unique (venta_id, producto_id)
);

create table if not exists public.mermas (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id),
  cantidad integer not null check (cantidad > 0),
  motivo text not null check (motivo in ('vencimiento', 'daño', 'robo', 'otro')),
  fecha date not null default current_date,
  usuario_id uuid references public.usuarios(id),
  usuario text not null,
  creado_en timestamptz not null default now()
);

create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce((select rol = 'admin' and activo from public.usuarios where id = auth.uid()), false) $$;

create or replace function public.crear_perfil_usuario()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, nombre, correo, rol, activo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)),
    lower(new.email),
    case when new.raw_user_meta_data ->> 'rol' = 'admin' then 'admin' else 'vendedor' end,
    true
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario_auth on auth.users;
create trigger al_crear_usuario_auth after insert on auth.users
for each row execute function public.crear_perfil_usuario();

create or replace function public.registrar_merma(p_producto_id uuid, p_cantidad integer, p_motivo text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare v_id uuid; v_usuario public.usuarios; v_stock integer;
begin
  select * into v_usuario from public.usuarios where id = auth.uid() and activo;
  if v_usuario.id is null then raise exception 'Usuario no autorizado'; end if;
  select stock into v_stock from public.productos where id = p_producto_id and activo for update;
  if v_stock is null or p_cantidad < 1 then raise exception 'Producto o cantidad inválida'; end if;
  if v_stock < p_cantidad then raise exception 'La merma supera el stock disponible'; end if;
  update public.productos set stock = stock - p_cantidad, actualizado_en = now() where id = p_producto_id;
  insert into public.mermas (producto_id, cantidad, motivo, usuario_id, usuario)
  values (p_producto_id, p_cantidad, p_motivo, v_usuario.id, v_usuario.nombre) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.registrar_venta(p_items jsonb)
returns uuid language plpgsql security definer set search_path = public
as $$
declare v_id uuid; v_usuario public.usuarios; v_item jsonb; v_producto public.productos;
begin
  select * into v_usuario from public.usuarios where id = auth.uid() and activo;
  if v_usuario.id is null then raise exception 'Usuario no autorizado'; end if;
  if jsonb_array_length(p_items) = 0 then raise exception 'La venta no contiene productos'; end if;
  insert into public.ventas (vendedor_id, vendedor) values (v_usuario.id, v_usuario.nombre) returning id into v_id;
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_producto from public.productos
      where id = (v_item ->> 'producto_id')::uuid and activo for update;
    if v_producto.id is null or v_producto.stock < (v_item ->> 'cantidad')::integer then
      raise exception 'Stock insuficiente para el producto solicitado';
    end if;
    insert into public.detalle_venta (venta_id, producto_id, cantidad, precio_unitario)
    values (v_id, v_producto.id, (v_item ->> 'cantidad')::integer, v_producto.precio);
    update public.productos set stock = stock - (v_item ->> 'cantidad')::integer, actualizado_en = now()
      where id = v_producto.id;
  end loop;
  return v_id;
end;
$$;

create or replace function public.anular_venta(p_venta_id uuid, p_motivo text)
returns void language plpgsql security definer set search_path = public
as $$
declare v_venta public.ventas; v_item public.detalle_venta;
begin
  select * into v_venta from public.ventas where id = p_venta_id for update;
  if v_venta.id is null then raise exception 'Venta inexistente'; end if;
  if v_venta.estado = 'anulada' then return; end if;
  if not public.es_admin() and v_venta.vendedor_id <> auth.uid() then raise exception 'No autorizado'; end if;
  for v_item in select * from public.detalle_venta where venta_id = p_venta_id loop
    update public.productos set stock = stock + v_item.cantidad, actualizado_en = now() where id = v_item.producto_id;
  end loop;
  update public.ventas set estado = 'anulada', motivo_anulacion = coalesce(nullif(trim(p_motivo), ''), 'Sin motivo')
    where id = p_venta_id;
end;
$$;

alter table public.categorias enable row level security;
alter table public.usuarios enable row level security;
alter table public.productos enable row level security;
alter table public.ventas enable row level security;
alter table public.detalle_venta enable row level security;
alter table public.mermas enable row level security;

create policy "lectura autenticada categorias" on public.categorias for select to authenticated using (true);
create policy "lectura autenticada productos" on public.productos for select to authenticated using (true);
create policy "admin gestiona productos" on public.productos for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "usuario lee su perfil o admin" on public.usuarios for select to authenticated using (id = auth.uid() or public.es_admin());
create policy "admin actualiza perfiles" on public.usuarios for update to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "lectura autenticada ventas" on public.ventas for select to authenticated using (true);
create policy "lectura autenticada detalle" on public.detalle_venta for select to authenticated using (true);
create policy "lectura autenticada mermas" on public.mermas for select to authenticated using (true);

grant execute on function public.registrar_merma(uuid, integer, text) to authenticated;
grant execute on function public.registrar_venta(jsonb) to authenticated;
grant execute on function public.anular_venta(uuid, text) to authenticated;

insert into public.categorias (id, nombre) values
  ('bebidas', 'Bebidas'), ('dulces', 'Dulces y chocolates'), ('panaderia', 'Panadería'),
  ('abarrotes', 'Abarrotes'), ('cafe', 'Café e infusiones'), ('galletas', 'Galletas y snacks')
on conflict (id) do update set nombre = excluded.nombre;

insert into public.productos (codigo_barra, nombre, categoria_id, precio, stock, stock_critico) values
  ('7801234567890', 'Bebida Cola 1.5L', 'bebidas', 1800, 34, 10),
  ('7801234567891', 'Agua Mineral 500ml', 'bebidas', 900, 8, 12),
  ('7801234567892', 'Chocolate Amargo 40g', 'dulces', 700, 25, 8),
  ('7801234567893', 'Caramelos Surtidos 100g', 'dulces', 1200, 4, 6),
  ('7801234567894', 'Marraqueta (unidad)', 'panaderia', 150, 60, 20),
  ('7801234567895', 'Hallulla (unidad)', 'panaderia', 150, 5, 15),
  ('7801234567896', 'Café Molido 250g', 'cafe', 3200, 14, 5),
  ('7801234567897', 'Té en Hebras 100g', 'cafe', 2100, 9, 5),
  ('7801234567898', 'Galletas de Avena 180g', 'galletas', 1350, 3, 10),
  ('7801234567899', 'Papas Fritas 120g', 'galletas', 1500, 22, 8),
  ('7801234567900', 'Arroz Grado 1 1kg', 'abarrotes', 1650, 40, 10),
  ('7801234567901', 'Aceite Vegetal 1L', 'abarrotes', 3400, 2, 6)
on conflict (codigo_barra) do nothing;
