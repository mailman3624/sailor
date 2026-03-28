import type { AppState } from "@/lib/types";

const uid = (label: string) => `${label}-${Math.random().toString(16).slice(2, 10)}`;

export const sampleData: AppState = {
  items: [
    { id: "ID001", name: "เครื่องปั่นสมูทตี้", category: "อุปกรณ์", unit: "เครื่อง", openingStock: 5, reorderPoint: 2, price: 5200, description: "ใช้สำหรับปั่นเมนูเครื่องดื่มและเตรียมวัตถุดิบให้ได้ความละเอียดตามมาตรฐานร้าน", recipe: [{ id: "ID006", name: "แป้งผสม", qty: 2, unit: "กก." }, { id: "ID008", name: "นมสด", qty: 3, unit: "ลิตร" }, { id: "ID009", name: "แก้วบรรจุ", qty: 1, unit: "แพ็ค" }], steps: ["ตรวจเช็กใบมีดก่อนใช้งาน", "เตรียมวัตถุดิบตามสูตร", "บันทึกจำนวนที่ใช้จริง", "ล้างและเช็ดเครื่องก่อนเก็บ"] },
    { id: "ID002", name: "เครื่องซีลแก้ว", category: "อุปกรณ์", unit: "เครื่อง", openingStock: 4, reorderPoint: 1, price: 4300, description: "ใช้ซีลหน้าถ้วยสำหรับเครื่องดื่มและสินค้า take away", recipe: [{ id: "ID009", name: "แก้วบรรจุ", qty: 2, unit: "แพ็ค" }, { id: "ID010", name: "สติกเกอร์แบรนด์", qty: 1, unit: "แพ็ค" }], steps: ["อุ่นเครื่องก่อนเริ่ม", "เตรียมแก้วและสติกเกอร์", "ซีลตามจำนวนออเดอร์", "บันทึกของเสียถ้ามี"] },
    { id: "ID006", name: "แป้งผสม", category: "วัตถุดิบ", unit: "กก.", openingStock: 40, reorderPoint: 20, price: 65, description: "วัตถุดิบหลักที่ใช้ในหลายเมนู", recipe: [{ id: "ID007", name: "น้ำตาล", qty: 1, unit: "กก." }], steps: ["ตรวจ lot", "เบิกตามแผนผลิต", "บันทึกการใช้"] },
    { id: "ID007", name: "น้ำตาล", category: "วัตถุดิบ", unit: "กก.", openingStock: 35, reorderPoint: 15, price: 48, description: "ใช้ในงานผลิตและการปรับรส", recipe: [], steps: ["ชั่งก่อนใช้", "นับคงเหลือหลังใช้งาน"] }
  ],
  stockIns: [
    { id: uid("in"), itemId: "ID006", date: "2026-03-23", qty: 10, note: "รับเข้ารอบเช้า" }
  ],
  stockOuts: [
    { id: uid("out"), itemId: "ID001", date: "2026-03-23", qty: 1, price: 5200, channel: "หน้าร้าน", note: "ขายเครื่องตัวอย่าง" }
  ],
  dailyChecks: [
    { id: uid("check"), itemId: "ID006", date: "2026-03-28", counted: 40, note: "เช็กปลายวัน" }
  ],
  selectedItemId: "ID001"
};
