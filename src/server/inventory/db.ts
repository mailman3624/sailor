import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import postgres from "postgres";

const globalForDb = globalThis as typeof globalThis & {
  sailorSql?: postgres.Sql;
};

export function db() {
  if (globalForDb.sailorSql) return globalForDb.sailorSql;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const client = postgres(connectionString, {
    ssl: "require",
    prepare: false,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.sailorSql = client;
  }

  return client;
}

export type ItemCategory = "equipment" | "material";

export type ItemSummary = {
  id: number;
  itemCode: string;
  name: string;
  category: ItemCategory;
  unit: string;
  openingStock: number;
  reorderPoint: number;
  price: number;
  description: string;
  stockIn: number;
  stockOut: number;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
};

export type RecipeRow = {
  id: number;
  materialCode: string;
  materialName: string;
  qtyRequired: number;
  unit: string;
};

export type StepRow = {
  id: number;
  stepNo: number;
  stepText: string;
};

export type DetailItem = ItemSummary & {
  recipes: RecipeRow[];
  steps: StepRow[];
};

export type ActivityRow = {
  kind: string;
  itemCode: string;
  itemName: string;
  eventAt: string;
  quantity: number;
  note: string;
};

export type DashboardData = {
  summaries: ItemSummary[];
  totalSales: number;
  totalIncoming: number;
  totalCurrent: number;
  reorderCount: number;
  recent: ActivityRow[];
};

export type DailyCheckRow = {
  itemCode: string;
  itemName: string;
  latestCounted: number | null;
  latestCheckedAt: string | null;
  latestNote: string | null;
};

function asNumber(value: string | number | null) {
  if (typeof value === "number") return value;
  return Number(value ?? 0);
}

function normalizeSummaryRow(row: Record<string, unknown>): ItemSummary {
  return {
    id: asNumber(row.id as string | number | null),
    itemCode: String(row.item_code),
    name: String(row.name),
    category: String(row.category) as ItemCategory,
    unit: String(row.unit),
    openingStock: asNumber(row.opening_stock as string | number | null),
    reorderPoint: asNumber(row.reorder_point as string | number | null),
    price: asNumber(row.price as string | number | null),
    description: String(row.description ?? ""),
    stockIn: asNumber(row.stock_in as string | number | null),
    stockOut: asNumber(row.stock_out as string | number | null),
    currentStock: asNumber(row.current_stock as string | number | null),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function getItemSummaries() {
  noStore();
  const rows = await db()`
    select
      id,
      item_code,
      name,
      category,
      unit,
      opening_stock,
      reorder_point,
      price,
      description,
      stock_in,
      stock_out,
      current_stock,
      created_at,
      updated_at
    from item_stock_summary
    order by item_code asc
  `;

  return rows.map((row) => normalizeSummaryRow(row as unknown as Record<string, unknown>));
}

export async function getDashboardData(): Promise<DashboardData> {
  const sql = db();
  const summaries = await getItemSummaries();
  const totalSalesRows = await sql`
    select coalesce(sum(qty * price_per_unit), 0) as total_sales
    from stock_outs
  `;
  const recentRows = await sql`
    select *
    from (
      select
        'stock_in' as kind,
        i.item_code,
        i.name as item_name,
        si.received_at as event_at,
        si.qty as quantity,
        coalesce(si.note, '') as note
      from stock_ins si
      join items i on i.id = si.item_id

      union all

      select
        'stock_out' as kind,
        i.item_code,
        i.name as item_name,
        so.sold_at as event_at,
        so.qty as quantity,
        coalesce(so.note, '') as note
      from stock_outs so
      join items i on i.id = so.item_id

      union all

      select
        'daily_check' as kind,
        i.item_code,
        i.name as item_name,
        dc.checked_at as event_at,
        dc.counted_qty as quantity,
        coalesce(dc.note, '') as note
      from daily_checks dc
      join items i on i.id = dc.item_id
    ) activity
    order by event_at desc
    limit 8
  `;

  return {
    summaries,
    totalSales: asNumber((totalSalesRows[0]?.total_sales ?? 0) as string | number | null),
    totalIncoming: summaries.reduce((sum, item) => sum + item.stockIn, 0),
    totalCurrent: summaries.reduce((sum, item) => sum + item.currentStock, 0),
    reorderCount: summaries.filter((item) => item.currentStock <= item.reorderPoint).length,
    recent: recentRows.map((row) => ({
      kind: String(row.kind),
      itemCode: String(row.item_code),
      itemName: String(row.item_name),
      eventAt: String(row.event_at),
      quantity: asNumber(row.quantity as string | number | null),
      note: String(row.note ?? ""),
    })),
  };
}

export async function getItemDetail(itemCode?: string): Promise<{
  current: DetailItem | null;
  items: ItemSummary[];
}> {
  const sql = db();
  const items = await getItemSummaries();
  const current = items.find((item) => item.itemCode === itemCode) ?? items[0] ?? null;

  if (!current) {
    return { current: null, items: [] };
  }

  const recipeRows = await sql`
    select
      r.id,
      material.item_code as material_code,
      material.name as material_name,
      r.qty_required,
      r.unit
    from recipes r
    join items product on product.id = r.item_id
    join items material on material.id = r.material_item_id
    where product.item_code = ${current.itemCode}
    order by material.item_code asc
  `;

  const stepRows = await sql`
    select
      s.id,
      s.step_no,
      s.step_text
    from item_steps s
    join items i on i.id = s.item_id
    where i.item_code = ${current.itemCode}
    order by s.step_no asc
  `;

  return {
    items,
    current: {
      ...current,
      recipes: recipeRows.map((row) => ({
        id: asNumber(row.id as string | number | null),
        materialCode: String(row.material_code),
        materialName: String(row.material_name),
        qtyRequired: asNumber(row.qty_required as string | number | null),
        unit: String(row.unit),
      })),
      steps: stepRows.map((row) => ({
        id: asNumber(row.id as string | number | null),
        stepNo: asNumber(row.step_no as string | number | null),
        stepText: String(row.step_text),
      })),
    },
  };
}

export async function getDailyCheckOverview() {
  noStore();
  const rows = await db()`
    select
      i.item_code,
      i.name as item_name,
      latest.counted_qty as latest_counted,
      latest.checked_at as latest_checked_at,
      latest.note as latest_note
    from items i
    left join lateral (
      select counted_qty, checked_at, note
      from daily_checks dc
      where dc.item_id = i.id
      order by dc.checked_at desc
      limit 1
    ) latest on true
    order by i.item_code asc
  `;

  return rows.map(
    (row): DailyCheckRow => ({
      itemCode: String(row.item_code),
      itemName: String(row.item_name),
      latestCounted: row.latest_counted === null ? null : asNumber(row.latest_counted as string | number | null),
      latestCheckedAt: row.latest_checked_at ? String(row.latest_checked_at) : null,
      latestNote: row.latest_note ? String(row.latest_note) : null,
    }),
  );
}
