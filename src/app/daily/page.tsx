import { createDailyCheckAction } from "@/server/inventory/actions";
import { AppShell, formatDate, todayString } from "@/features/inventory/components/app-shell";
import { getDailyCheckOverview, getItemSummaries } from "@/server/inventory/db";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const [items, overview] = await Promise.all([getItemSummaries(), getDailyCheckOverview()]);

  return (
    <AppShell currentPath="/daily">
      <section className="panel">
        <form className="form-card" action={createDailyCheckAction}>
          <input type="hidden" name="redirectTo" value="/daily" />
          <h2 className="section-title">Daily stock check</h2>
          <div className="form-grid">
            <div className="field"><label>Item</label><select name="itemCode">{items.map((item) => <option key={item.itemCode} value={item.itemCode}>{item.itemCode} ? {item.name}</option>)}</select></div>
            <div className="field"><label>Date</label><input name="date" type="date" defaultValue={todayString()} /></div>
            <div className="field"><label>Counted quantity</label><input name="countedQty" type="number" min="0" defaultValue="0" /></div>
            <div className="field full"><label>Note</label><textarea name="note" /></div>
          </div>
          <button className="primary-button" type="submit">Save check</button>
        </form>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Latest counted</th>
                <th>Checked at</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {overview.map((item) => (
                <tr key={item.itemCode}>
                  <td>{item.itemCode}</td>
                  <td>{item.itemName}</td>
                  <td>{item.latestCounted ?? "-"}</td>
                  <td>{formatDate(item.latestCheckedAt)}</td>
                  <td>{item.latestNote ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
