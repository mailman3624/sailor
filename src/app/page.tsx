import Link from "next/link";
import { AppShell, HeroStats, formatDate } from "@/features/inventory/components/app-shell";
import { getDashboardData } from "@/server/inventory/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <AppShell currentPath="/">
      <section className="hero">
        <div>
          <h2>Inventory and sales system on a real database</h2>
          <p>This version reads directly from Supabase PostgreSQL for items, stock in, stock out, and daily stock checks.</p>
          <div className="button-row">
            <Link className="primary-button" href="/dashboard">Open dashboard</Link>
            <Link className="secondary-button" href="/items">Manage items</Link>
          </div>
        </div>
        <HeroStats data={data} />
      </section>

      <section className="content-grid">
        <section className="panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Shortcuts</h2>
              <div className="section-subtitle">Go straight to the task you want to do.</div>
            </div>
          </div>
          <div className="tile-grid">
            <Link className="tile-button" href="/dashboard"><div className="tile-image" /><div className="tile-content"><h3 className="tile-title">Dashboard</h3><div className="tile-meta">Sales and stock overview</div></div></Link>
            <Link className="tile-button" href="/items"><div className="tile-image" /><div className="tile-content"><h3 className="tile-title">Items</h3><div className="tile-meta">Create and remove item master data</div></div></Link>
            <Link className="tile-button" href="/detail"><div className="tile-image" /><div className="tile-content"><h3 className="tile-title">Details</h3><div className="tile-meta">Recipes and steps</div></div></Link>
            <Link className="tile-button" href="/transactions"><div className="tile-image" /><div className="tile-content"><h3 className="tile-title">Transactions</h3><div className="tile-meta">Record incoming and outgoing stock</div></div></Link>
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <h2 className="section-title">Recent activity</h2>
            </div>
          </div>
          <div className="grid">
            {data.recent.slice(0, 6).map((log) => (
              <div key={`${log.kind}-${log.itemCode}-${log.eventAt}`} className="log-item">
                <strong>{log.itemCode} ? {log.itemName}</strong>
                <div className="small-text">{formatDate(log.eventAt)}</div>
                <div>
                  {log.kind === "stock_in" ? "Stock in" : log.kind === "stock_out" ? "Stock out" : "Daily check"} {log.quantity}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}
