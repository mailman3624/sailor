import { AppShell, HeroStats, formatCurrency } from "@/features/inventory/components/app-shell";
import { getDashboardData } from "@/server/inventory/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const movers = [...data.summaries].sort((a, b) => b.stockOut - a.stockOut).slice(0, 6);
  const max = Math.max(...movers.map((item) => item.stockOut), 1);

  return (
    <AppShell currentPath="/dashboard">
      <section className="hero">
        <div>
          <h2>Dashboard ????????????????????</h2>
          <p>????????????????????? ??????????????? ????????????? ??????????????????????????????????????????</p>
        </div>
        <HeroStats data={data} />
      </section>

      <section className="panel">
        <div className="metric-grid">
          <article className="metric-card">
            <div className="metric-label">??????????</div>
            <strong>{data.totalCurrent}</strong>
          </article>
          <article className="metric-card">
            <div className="metric-label">???????????????????</div>
            <strong>{data.totalIncoming}</strong>
          </article>
          <article className="metric-card">
            <div className="metric-label">?????????</div>
            <strong>{formatCurrency(data.totalSales)}</strong>
          </article>
          <article className="metric-card">
            <div className="metric-label">?????????????</div>
            <strong>{data.reorderCount}</strong>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <h2 className="section-title">????????????????????????????</h2>
          </div>
        </div>
        <div className="bar-chart">
          {movers.map((entry) => (
            <div key={entry.itemCode} className="bar-row">
              <div>{entry.name}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(entry.stockOut / max) * 100}%` }} />
              </div>
              <strong>{entry.stockOut}</strong>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
