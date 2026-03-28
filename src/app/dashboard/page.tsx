"use client";
import { AppShell, HeroStats, useComputed, formatCurrency } from "@/components/app-shell";
export default function DashboardPage() {
  const { metrics, totalSales } = useComputed();
  const movers = [...metrics].sort((a, b) => b.stockOut - a.stockOut).slice(0, 6);
  const max = Math.max(...movers.map((m) => m.stockOut), 1);
  const totalIncoming = metrics.reduce((s, m) => s + m.stockIn, 0);
  const totalCurrent = metrics.reduce((s, m) => s + m.currentStock, 0);
  return <AppShell><section className="hero"><div><h2>Dashboard ภาพรวมการขายและสต๊อก</h2><p>ดูว่าอะไรเคลื่อนไหวมาก ของไหนใกล้หมด และภาพรวมยอดขายทั้งหมดจากหน้าเดียว</p></div><HeroStats /></section><section className="panel"><div className="metric-grid"><article className="metric-card"><div className="metric-label">คงเหลือรวม</div><strong>{totalCurrent}</strong></article><article className="metric-card"><div className="metric-label">รับเข้าเพิ่มทั้งหมด</div><strong>{totalIncoming}</strong></article><article className="metric-card"><div className="metric-label">ยอดขายรวม</div><strong>{formatCurrency(totalSales)}</strong></article><article className="metric-card"><div className="metric-label">รายการใกล้หมด</div><strong>{metrics.filter((m) => m.currentStock <= m.item.reorderPoint).length}</strong></article></div></section><section className="panel"><div className="section-head"><div><h2 className="section-title">สินค้าที่เคลื่อนไหวมากที่สุด</h2></div></div><div className="bar-chart">{movers.map((entry) => <div key={entry.item.id} className="bar-row"><div>{entry.item.name}</div><div className="bar-track"><div className="bar-fill" style={{ width: `${(entry.stockOut / max) * 100}%` }} /></div><strong>{entry.stockOut}</strong></div>)}</div></section></AppShell>;
}
