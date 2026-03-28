create table if not exists items (
  id bigint generated always as identity primary key,
  item_code text not null unique,
  name text not null,
  category text not null check (category in ('equipment', 'material')),
  unit text not null,
  opening_stock numeric(12,2) not null default 0,
  reorder_point numeric(12,2) not null default 0,
  price numeric(12,2) not null default 0,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists recipes (
  id bigint generated always as identity primary key,
  item_id bigint not null references items(id) on delete cascade,
  material_item_id bigint not null references items(id) on delete restrict,
  qty_required numeric(12,2) not null,
  unit text not null,
  created_at timestamptz not null default now(),
  constraint recipes_item_material_unique unique (item_id, material_item_id)
);

create table if not exists item_steps (
  id bigint generated always as identity primary key,
  item_id bigint not null references items(id) on delete cascade,
  step_no integer not null,
  step_text text not null,
  created_at timestamptz not null default now(),
  constraint item_steps_item_step_unique unique (item_id, step_no)
);

create table if not exists stock_ins (
  id bigint generated always as identity primary key,
  item_id bigint not null references items(id) on delete cascade,
  qty numeric(12,2) not null check (qty > 0),
  received_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists stock_outs (
  id bigint generated always as identity primary key,
  item_id bigint not null references items(id) on delete cascade,
  qty numeric(12,2) not null check (qty > 0),
  price_per_unit numeric(12,2) not null default 0,
  channel text,
  note text,
  sold_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists daily_checks (
  id bigint generated always as identity primary key,
  item_id bigint not null references items(id) on delete cascade,
  counted_qty numeric(12,2) not null check (counted_qty >= 0),
  checked_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipes_item_id on recipes(item_id);
create index if not exists idx_recipes_material_item_id on recipes(material_item_id);
create index if not exists idx_item_steps_item_id on item_steps(item_id);
create index if not exists idx_stock_ins_item_id on stock_ins(item_id);
create index if not exists idx_stock_outs_item_id on stock_outs(item_id);
create index if not exists idx_daily_checks_item_id on daily_checks(item_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_items_updated_at on items;
create trigger trg_items_updated_at
before update on items
for each row
execute function set_updated_at();

create or replace view item_stock_summary as
select
  i.id,
  i.item_code,
  i.name,
  i.category,
  i.unit,
  i.opening_stock,
  coalesce(si.total_in, 0) as stock_in,
  coalesce(so.total_out, 0) as stock_out,
  i.opening_stock + coalesce(si.total_in, 0) - coalesce(so.total_out, 0) as current_stock,
  i.reorder_point,
  i.price,
  i.description,
  i.created_at,
  i.updated_at
from items i
left join (
  select item_id, sum(qty) as total_in
  from stock_ins
  group by item_id
) si on si.item_id = i.id
left join (
  select item_id, sum(qty) as total_out
  from stock_outs
  group by item_id
) so on so.item_id = i.id;
