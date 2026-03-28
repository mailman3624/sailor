import Link from "next/link";
import type { DashboardData, ItemSummary } from "@/server/inventory/db";
import type { NavPath } from "@/lib/types";

const nav = [
  ["/", "Home"],
  ["/dashboard", "Dashboard"],
  ["/items", "Items"],
  ["/detail", "Details"],
  ["/transactions", "Transactions"],
  ["/daily", "Daily Check"],
] as const;

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function categoryLabel(category: string) {
  return category === "material" ? "Material" : "Equipment";
}

export function AppShell({ children, currentPath }: { children: React.ReactNode; currentPath: NavPath }) {
  return (
    <div className="page-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SP</div>
          <h1>Sailor Piece</h1>
          <p>Next.js + Supabase PostgreSQL. The app now reads and writes real data instead of browser local storage.</p>
        </div>

        <div className="nav-list">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className={`nav-link ${currentPath === href ? "active" : ""}`}>
              <span className="nav-label">{label}</span>
              <span className="small-text">Open {label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="small-text">Live database mode</div>
          <div className="small-text">Every form writes to Supabase and refreshes the relevant pages automatically.</div>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

export function HeroStats({ data }: { data: DashboardData }) {
  return (
    <div className="hero-panel">
      <div className="hero-panel-grid">
        <div className="hero-stat">
          <span className="metric-label">Total items</span>
          <strong>{data.summaries.length}</strong>
        </div>
        <div className="hero-stat">
          <span className="metric-label">Need reorder</span>
          <strong>{data.reorderCount}</strong>
        </div>
        <div className="hero-stat">
          <span className="metric-label">Total sales</span>
          <strong>{formatCurrency(data.totalSales)}</strong>
        </div>
        <div className="hero-stat">
          <span className="metric-label">Latest activity</span>
          <strong>{data.recent[0] ? formatDate(data.recent[0].eventAt) : "-"}</strong>
        </div>
      </div>
    </div>
  );
}

export function ItemOptions({ items }: { items: ItemSummary[] }) {
  return (
    <div className="tile-grid">
      {items.map((item) => (
        <Link key={item.itemCode} className="tile-button" href={`/detail?item=${encodeURIComponent(item.itemCode)}`}>
          <div className="tile-image" />
          <div className="tile-content">
            <div className="tile-meta">{item.itemCode} ? {categoryLabel(item.category)}</div>
            <h3 className="tile-title">{item.name}</h3>
            <div className="tile-meta">In stock {item.currentStock} {item.unit}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
