"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/inventory/db";

function numberValue(formData: FormData, key: string) {
  return Number(String(formData.get(key) ?? "0").trim() || "0");
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeCategory(value: string) {
  return value === "material" || value === "????????" ? "material" : "equipment";
}

function redirectTo(formData: FormData, fallback: string) {
  return textValue(formData, "redirectTo") || fallback;
}

function refreshApp() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/items");
  revalidatePath("/detail");
  revalidatePath("/transactions");
  revalidatePath("/daily");
}

export async function createItemAction(formData: FormData) {
  const itemCode = textValue(formData, "itemCode").toUpperCase();
  const name = textValue(formData, "name");
  const category = normalizeCategory(textValue(formData, "category"));
  const unit = textValue(formData, "unit");
  const openingStock = numberValue(formData, "openingStock");
  const reorderPoint = numberValue(formData, "reorderPoint");
  const price = numberValue(formData, "price");
  const description = textValue(formData, "description");

  if (!itemCode || !name || !unit) {
    redirect(redirectTo(formData, "/items"));
  }

  await db()`
    insert into items (
      item_code,
      name,
      category,
      unit,
      opening_stock,
      reorder_point,
      price,
      description
    )
    values (
      ${itemCode},
      ${name},
      ${category},
      ${unit},
      ${openingStock},
      ${reorderPoint},
      ${price},
      ${description}
    )
    on conflict (item_code) do nothing
  `;

  refreshApp();
  redirect(redirectTo(formData, "/items"));
}

export async function deleteItemAction(formData: FormData) {
  const itemCode = textValue(formData, "itemCode");

  if (itemCode) {
    await db()`
      delete from items
      where item_code = ${itemCode}
    `;
  }

  refreshApp();
  redirect(redirectTo(formData, "/items"));
}

export async function createStockInAction(formData: FormData) {
  const itemCode = textValue(formData, "itemCode");
  const qty = numberValue(formData, "qty");
  const receivedAt = textValue(formData, "date");
  const note = textValue(formData, "note");

  if (itemCode && qty > 0) {
    await db()`
      insert into stock_ins (item_id, qty, received_at, note)
      select id, ${qty}, ${receivedAt || new Date().toISOString()}, ${note}
      from items
      where item_code = ${itemCode}
    `;
  }

  refreshApp();
  redirect(redirectTo(formData, "/transactions"));
}

export async function createStockOutAction(formData: FormData) {
  const itemCode = textValue(formData, "itemCode");
  const qty = numberValue(formData, "qty");
  const soldAt = textValue(formData, "date");
  const pricePerUnit = numberValue(formData, "price");
  const channel = textValue(formData, "channel");
  const note = textValue(formData, "note");

  if (itemCode && qty > 0) {
    await db()`
      insert into stock_outs (item_id, qty, price_per_unit, channel, note, sold_at)
      select id, ${qty}, ${pricePerUnit}, ${channel}, ${note}, ${soldAt || new Date().toISOString()}
      from items
      where item_code = ${itemCode}
    `;
  }

  refreshApp();
  redirect(redirectTo(formData, "/transactions"));
}

export async function createDailyCheckAction(formData: FormData) {
  const itemCode = textValue(formData, "itemCode");
  const countedQty = numberValue(formData, "countedQty");
  const checkedAt = textValue(formData, "date");
  const note = textValue(formData, "note");

  if (itemCode && countedQty >= 0) {
    await db()`
      insert into daily_checks (item_id, counted_qty, checked_at, note)
      select id, ${countedQty}, ${checkedAt || new Date().toISOString()}, ${note}
      from items
      where item_code = ${itemCode}
    `;
  }

  refreshApp();
  redirect(redirectTo(formData, "/daily"));
}
