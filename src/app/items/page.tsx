import Link from "next/link";
import { createItemAction, deleteItemAction } from "@/server/inventory/actions";
import { AppShell, ItemOptions, categoryLabel, formatCurrency } from "@/features/inventory/components/app-shell";
import { getItemSummaries } from "@/server/inventory/db";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const items = await getItemSummaries();

  return (
    <AppShell currentPath="/items">
      <section className="panel">
        <div className="section-head">
          <div>
            <h2 className="section-title">Item master</h2>
          </div>
        </div>

        <form className="form-card" action={createItemAction}>
          <input type="hidden" name="redirectTo" value="/items" />
          <div className="compact-grid">
            <div className="field"><label>Code</label><input name="itemCode" required /></div>
            <div className="field"><label>Name</label><input name="name" required /></div>
            <div className="field"><label>Category</label><select name="category" defaultValue="equipment"><option value="equipment">Equipment</option><option value="material">Material</option></select></div>
            <div className="field"><label>Unit</label><input name="unit" required /></div>
            <div className="field"><label>Opening stock</label><input name="openingStock" type="number" min="0" defaultValue="0" required /></div>
            <div className="field"><label>Reorder point</label><input name="reorderPoint" type="number" min="0" defaultValue="0" required /></div>
            <div className="field"><label>Price per unit</label><input name="price" type="number" min="0" defaultValue="0" required /></div>
            <div className="field"><label>Description</label><input name="description" /></div>
          </div>
          <button className="primary-button" type="submit">Create item</button>
        </form>
      </section>

      <section className="content-grid">
        <section className="panel">
          <ItemOptions items={items} />
        </section>

        <section className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Current stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.itemCode}>
                    <td>{item.itemCode}</td>
                    <td>{item.name}</td>
                    <td>{categoryLabel(item.category)}</td>
                    <td>{item.currentStock} {item.unit}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <div className="button-row">
                        <Link className="secondary-button" href={`/detail?item=${encodeURIComponent(item.itemCode)}`}>Open</Link>
                        <form action={deleteItemAction}>
                          <input type="hidden" name="itemCode" value={item.itemCode} />
                          <input type="hidden" name="redirectTo" value="/items" />
                          <button className="danger-button" type="submit">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
