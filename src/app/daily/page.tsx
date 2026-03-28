"use client";
import { FormEvent } from "react";
import { AppShell, todayString } from "@/components/app-shell";
import { useInventory } from "@/components/inventory-provider";
export default function DailyPage() {
  const { state, addDailyCheck } = useInventory();
  function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); addDailyCheck({ itemId: String(form.get("itemId")), date: String(form.get("date")), counted: Number(form.get("counted")), note: String(form.get("note") || "") }); event.currentTarget.reset(); }
  return <AppShell><section className="panel"><form className="form-card" onSubmit={onSubmit}><h2 className="section-title">เช็กสต๊อกประจำวัน</h2><div className="form-grid"><div className="field"><label>รายการ</label><select name="itemId">{state.items.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.name}</option>)}</select></div><div className="field"><label>วันที่</label><input name="date" type="date" defaultValue={todayString()} /></div><div className="field"><label>จำนวนที่นับจริง</label><input name="counted" type="number" min="0" defaultValue="0" /></div><div className="field full"><label>หมายเหตุ</label><textarea name="note" /></div></div><button className="primary-button">บันทึกการเช็กสต๊อก</button></form></section><section className="panel"><div className="table-wrap"><table><thead><tr><th>รหัส</th><th>ชื่อ</th><th>บันทึกล่าสุด</th></tr></thead><tbody>{state.items.map((item) => { const latest = state.dailyChecks.find((entry) => entry.itemId === item.id); return <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{latest ? `${latest.counted} · ${latest.date}` : "-"}</td></tr>; })}</tbody></table></div></section></AppShell>;
}
