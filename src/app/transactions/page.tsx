import { createStockInAction, createStockOutAction } from "@/server/inventory/actions";
import { AppShell, todayString } from "@/features/inventory/components/app-shell";
import { getItemSummaries } from "@/server/inventory/db";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const items = await getItemSummaries();

  return (
    <AppShell currentPath="/transactions">
      <section className="panel">
        <div className="forms-grid">
          <form className="form-card" action={createStockInAction}>
            <input type="hidden" name="redirectTo" value="/transactions" />
            <h2 className="section-title">Stock in</h2>
            <div className="form-grid">
              <div className="field"><label>Item</label><select name="itemCode">{items.map((item) => <option key={item.itemCode} value={item.itemCode}>{item.itemCode} ? {item.name}</option>)}</select></div>
              <div className="field"><label>Date</label><input name="date" type="date" defaultValue={todayString()} /></div>
              <div className="field"><label>Quantity</label><input name="qty" type="number" min="1" defaultValue="1" /></div>
              <div className="field full"><label>Note</label><textarea name="note" /></div>
            </div>
            <button className="primary-button" type="submit">Save stock in</button>
          </form>

          <form className="form-card" action={createStockOutAction}>
            <input type="hidden" name="redirectTo" value="/transactions" />
            <h2 className="section-title">Stock out or sale</h2>
            <div className="form-grid">
              <div className="field"><label>Item</label><select name="itemCode">{items.map((item) => <option key={item.itemCode} value={item.itemCode}>{item.itemCode} ? {item.name}</option>)}</select></div>
              <div className="field"><label>Date</label><input name="date" type="date" defaultValue={todayString()} /></div>
              <div className="field"><label>Quantity</label><input name="qty" type="number" min="1" defaultValue="1" /></div>
              <div className="field"><label>Price per unit</label><input name="price" type="number" min="0" defaultValue="0" /></div>
              <div className="field"><label>Channel</label><input name="channel" /></div>
              <div className="field full"><label>Note</label><textarea name="note" /></div>
            </div>
            <button className="primary-button" type="submit">Save stock out</button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
