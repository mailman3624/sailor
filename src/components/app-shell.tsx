"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ChangeEvent } from "react";
import { useInventory } from "@/components/inventory-provider";
import type { InventoryItem } from "@/lib/types";

const nav = [["/", "หน้าแรก"], ["/dashboard", "Dashboard"], ["/items", "รายการสินค้า"], ["/detail", "รายละเอียด"], ["/transactions", "ธุรกรรม"], ["/daily", "เช็กสต๊อก"]] as const;

export function formatCurrency(value: number) { return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value); }
export function todayString() { return new Date().toISOString().slice(0, 10); }

export function useComputed() {
  const { state } = useInventory();
  return useMemo(() => {
    const metrics = state.items.map((item) => {
      const stockIn = state.stockIns.filter((e) => e.itemId === item.id).reduce((s, e) => s + e.qty, 0);
      const stockOut = state.stockOuts.filter((e) => e.itemId === item.id).reduce((s, e) => s + e.qty, 0);
      return { item, stockIn, stockOut, currentStock: item.openingStock + stockIn - stockOut };
    });
    const totalSales = state.stockOuts.reduce((s, e) => s + e.qty * e.price, 0);
    const recent = [...state.stockIns.map((e) => ({ date: e.date, title: `รับเข้า ${e.itemId}`, desc: `${e.qty}` })), ...state.stockOuts.map((e) => ({ date: e.date, title: `ขาย/เบิก ${e.itemId}`, desc: `${e.qty}` })), ...state.dailyChecks.map((e) => ({ date: e.date, title: `เช็ก ${e.itemId}`, desc: `${e.counted}` }))].sort((a, b) => b.date.localeCompare(a.date));
    return { metrics, totalSales, recent };
  }, [state]);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { reset, state } = useInventory();
  const [importing, setImporting] = useState(false);
  return <div className="page-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">SP</div><h1>Sailor Piece</h1><p>Next.js + TypeScript สำหรับ deploy ขึ้น Vercel และยังเก็บข้อมูลใน localStorage</p></div><div className="nav-list">{nav.map(([href, label]) => <Link key={href} href={href} className={`nav-link ${pathname === href ? "active" : ""}`}><span className="nav-label">{label}</span><span className="small-text">เปิดหน้า {label}</span></Link>)}</div><div className="sidebar-footer"><button className="primary-button" onClick={() => exportState(state)}>สำรองข้อมูล</button><label className="secondary-button">นำเข้าข้อมูล<input hidden type="file" accept=".json" onChange={(e) => importState(e, setImporting)} /></label><button className="ghost-button" onClick={() => { if (confirm("รีเซ็ตเป็นข้อมูลตัวอย่างหรือไม่")) reset(); }}>รีเซ็ตตัวอย่าง</button><div className="small-text">{importing ? "กำลังนำเข้า..." : "ข้อมูลผูกกับ browser ของผู้ใช้บนโดเมน Vercel"}</div></div></aside><main className="main">{children}</main></div>;
}

function exportState(state: unknown) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sailor-piece-backup-${todayString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importState(event: ChangeEvent<HTMLInputElement>, setImporting: (value: boolean) => void) {
  const file = event.target.files?.[0];
  if (!file) return;
  setImporting(true);
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed.items)) throw new Error("invalid");
      window.localStorage.setItem("sailor-piece-next-v1", JSON.stringify(parsed));
      window.location.reload();
    } catch {
      alert("ไฟล์ JSON ไม่ถูกต้อง");
      setImporting(false);
    }
  };
  reader.readAsText(file, "utf-8");
}

export function HeroStats() {
  const { metrics, totalSales, recent } = useComputed();
  const reorder = metrics.filter((m) => m.currentStock <= m.item.reorderPoint).length;
  return <div className="hero-panel"><div className="hero-panel-grid"><div className="hero-stat"><span className="metric-label">จำนวนไอดี</span><strong>{metrics.length}</strong></div><div className="hero-stat"><span className="metric-label">ต้องสั่งเพิ่ม</span><strong>{reorder}</strong></div><div className="hero-stat"><span className="metric-label">ยอดขายรวม</span><strong>{formatCurrency(totalSales)}</strong></div><div className="hero-stat"><span className="metric-label">กิจกรรมล่าสุด</span><strong>{recent[0]?.date ?? "-"}</strong></div></div></div>;
}

export function ItemOptions() {
  const router = useRouter();
  const { state, selectItem } = useInventory();
  return <div className="tile-grid">{state.items.map((item: InventoryItem) => <button key={item.id} className="tile-button" onClick={() => { selectItem(item.id); router.push("/detail"); }}><div className="tile-image" /><div className="tile-content"><div className="tile-meta">{item.id} · {item.category}</div><h3 className="tile-title">{item.name}</h3><div className="tile-meta">เปิดรายละเอียดสินค้า</div></div></button>)}</div>;
}
