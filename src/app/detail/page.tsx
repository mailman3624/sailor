import Link from "next/link";
import { deleteItemAction } from "@/server/inventory/actions";
import { AppShell, categoryLabel, formatCurrency } from "@/features/inventory/components/app-shell";
import { getItemDetail } from "@/server/inventory/db";

export const dynamic = "force-dynamic";

export default async function DetailPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const params = await searchParams;
  const { current, items } = await getItemDetail(params.item);

  if (!current) {
    return (
      <AppShell currentPath="/detail">
        <section className="panel">
          <h2 className="section-title">No items found</h2>
          <p>Create at least one item first, then come back to manage recipes and process steps.</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell currentPath="/detail">
      <section className="panel">
        <div className="button-row">
          {items.map((item) => (
            <Link key={item.itemCode} className={`secondary-button ${item.itemCode === current.itemCode ? "active" : ""}`} href={`/detail?item=${encodeURIComponent(item.itemCode)}`}>
              {item.itemCode}
            </Link>
          ))}
          <form action={deleteItemAction}>
            <input type="hidden" name="itemCode" value={current.itemCode} />
            <input type="hidden" name="redirectTo" value="/items" />
            <button className="danger-button" type="submit">Delete item</button>
          </form>
        </div>
      </section>

      <section className="panel">
        <div className="detail-layout">
          <div className="detail-art" />
          <div className="grid">
            <span className={current.currentStock <= current.reorderPoint ? "status-pill warn" : "status-pill"}>
              {current.currentStock <= current.reorderPoint ? "Reorder needed" : "Available"}
            </span>
            <h2 className="section-title">{current.itemCode} ? {current.name}</h2>
            <div className="muted">{current.description || `Category: ${categoryLabel(current.category)}`}</div>
            <div className="detail-grid">
              <div className="mini-card"><div className="metric-label">Current stock</div><strong>{current.currentStock} {current.unit}</strong></div>
              <div className="mini-card"><div className="metric-label">Reorder point</div><strong>{current.reorderPoint} {current.unit}</strong></div>
              <div className="mini-card"><div className="metric-label">Price per unit</div><strong>{formatCurrency(current.price)}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <section className="panel">
          <h2 className="section-title">Required materials</h2>
          {current.recipes.length ? (
            <ul className="recipe-list">
              {current.recipes.map((entry) => (
                <li key={entry.id}>
                  <span>{entry.materialCode} ? {entry.materialName}</span>
                  <strong>{entry.qtyRequired} {entry.unit}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className="muted">This item has no recipe rows yet.</div>
          )}
        </section>

        <section className="panel">
          <h2 className="section-title">Process steps</h2>
          {current.steps.length ? (
            <ol className="step-list">
              {current.steps.map((step) => (
                <li key={step.id}>{step.stepText}</li>
              ))}
            </ol>
          ) : (
            <div className="muted">This item has no process steps yet.</div>
          )}
        </section>
      </section>
    </AppShell>
  );
}
