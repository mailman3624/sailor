const STORAGE_KEY = "sailor-piece-inventory-v2";

function uid() {
  return window.crypto?.randomUUID?.() || `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

const SAMPLE_DATA = {
  items: [
    { id: "ID001", name: "เครื่องปั่นสมูทตี้", category: "อุปกรณ์", unit: "เครื่อง", openingStock: 5, reorderPoint: 2, price: 5200, description: "ใช้สำหรับปั่นเมนูเครื่องดื่มและเตรียมวัตถุดิบให้ได้ความละเอียดตามมาตรฐานร้าน", recipe: [{ id: "ID006", name: "แป้งผสม", qty: 2, unit: "กก." }, { id: "ID008", name: "นมสด", qty: 3, unit: "ลิตร" }, { id: "ID009", name: "แก้วบรรจุ", qty: 1, unit: "แพ็ค" }], steps: ["ตรวจเช็กใบมีดก่อนใช้งาน", "เตรียมวัตถุดิบตามสูตร", "บันทึกจำนวนที่ใช้จริง", "ล้างและเช็ดเครื่องก่อนเก็บ"] },
    { id: "ID002", name: "เครื่องซีลแก้ว", category: "อุปกรณ์", unit: "เครื่อง", openingStock: 4, reorderPoint: 1, price: 4300, description: "ใช้ซีลหน้าถ้วยสำหรับเครื่องดื่มและสินค้า take away", recipe: [{ id: "ID009", name: "แก้วบรรจุ", qty: 2, unit: "แพ็ค" }, { id: "ID010", name: "สติกเกอร์แบรนด์", qty: 1, unit: "แพ็ค" }], steps: ["อุ่นเครื่องก่อนเริ่ม", "เตรียมแก้วและสติกเกอร์", "ซีลตามจำนวนออเดอร์", "บันทึกของเสียถ้ามี"] },
    { id: "ID003", name: "เตาไฟฟ้า", category: "อุปกรณ์", unit: "เครื่อง", openingStock: 6, reorderPoint: 2, price: 3900, description: "ใช้ประกอบและอุ่นวัตถุดิบในงานผลิต", recipe: [{ id: "ID006", name: "แป้งผสม", qty: 1, unit: "กก." }, { id: "ID007", name: "น้ำตาล", qty: 1, unit: "กก." }], steps: ["ตรวจปลั๊กและระดับความร้อน", "ตั้งอุณหภูมิให้เหมาะกับสูตร", "ติดตามเวลาใช้งาน", "ทำความสะอาดหลังใช้งาน"] },
    { id: "ID004", name: "หม้อผสม", category: "อุปกรณ์", unit: "ใบ", openingStock: 8, reorderPoint: 3, price: 980, description: "ภาชนะหลักสำหรับผสมวัตถุดิบก่อนเข้าสู่กระบวนการผลิต", recipe: [{ id: "ID006", name: "แป้งผสม", qty: 2, unit: "กก." }, { id: "ID007", name: "น้ำตาล", qty: 1, unit: "กก." }, { id: "ID008", name: "นมสด", qty: 2, unit: "ลิตร" }], steps: ["เตรียมหม้อให้สะอาด", "ชั่งวัตถุดิบตามสูตร", "ผสมตามลำดับ", "บันทึกการใช้จริง"] },
    { id: "ID005", name: "ตู้แช่วัตถุดิบ", category: "อุปกรณ์", unit: "ตู้", openingStock: 3, reorderPoint: 1, price: 8400, description: "ใช้เก็บวัตถุดิบที่ต้องควบคุมอุณหภูมิ", recipe: [{ id: "ID008", name: "นมสด", qty: 4, unit: "ลิตร" }, { id: "ID009", name: "แก้วบรรจุ", qty: 1, unit: "แพ็ค" }], steps: ["ตรวจอุณหภูมิภายในตู้", "จัดวางวัตถุดิบตามหมวด", "บันทึกของเข้าออก", "สรุปคงเหลือปลายวัน"] },
    { id: "ID006", name: "แป้งผสม", category: "วัตถุดิบ", unit: "กก.", openingStock: 40, reorderPoint: 20, price: 65, description: "วัตถุดิบหลักที่ใช้ในหลายเมนู ควรติดตามคงเหลือทุกวัน", recipe: [{ id: "ID007", name: "น้ำตาล", qty: 1, unit: "กก." }, { id: "ID008", name: "นมสด", qty: 1, unit: "ลิตร" }], steps: ["ตรวจ lot และวันรับเข้า", "เบิกตามแผนผลิต", "บันทึกการใช้ทุกครั้ง", "ปิดถุงและเก็บให้ถูกต้อง"] },
    { id: "ID007", name: "น้ำตาล", category: "วัตถุดิบ", unit: "กก.", openingStock: 35, reorderPoint: 15, price: 48, description: "ใช้ในงานผลิตและการปรับรส", recipe: [{ id: "ID006", name: "แป้งผสม", qty: 1, unit: "กก." }], steps: ["ชั่งปริมาณก่อนใช้งาน", "เตรียมสำหรับรอบผลิต", "นับคงเหลือหลังใช้งาน"] },
    { id: "ID008", name: "นมสด", category: "วัตถุดิบ", unit: "ลิตร", openingStock: 50, reorderPoint: 20, price: 79, description: "วัตถุดิบเคลื่อนไหวเร็วและมีวันหมดอายุ", recipe: [{ id: "ID007", name: "น้ำตาล", qty: 1, unit: "กก." }, { id: "ID009", name: "แก้วบรรจุ", qty: 1, unit: "แพ็ค" }], steps: ["ตรวจวันหมดอายุ", "เบิกใช้ตามสูตร", "เก็บกลับเข้าที่เย็นทันที"] },
    { id: "ID009", name: "แก้วบรรจุ", category: "วัตถุดิบ", unit: "แพ็ค", openingStock: 60, reorderPoint: 30, price: 35, description: "ใช้กับหลายเมนูและเคลื่อนไหวตามยอดขาย", recipe: [{ id: "ID010", name: "สติกเกอร์แบรนด์", qty: 1, unit: "แพ็ค" }], steps: ["ตรวจจำนวนแพ็คก่อนเปิดใช้", "เบิกตามจำนวนขายจริง", "สรุปคงเหลือช่วงสิ้นวัน"] },
    { id: "ID010", name: "สติกเกอร์แบรนด์", category: "วัตถุดิบ", unit: "แพ็ค", openingStock: 45, reorderPoint: 20, price: 22, description: "ใช้สำหรับติดแพ็กเกจและควบคุมภาพลักษณ์สินค้า", recipe: [{ id: "ID009", name: "แก้วบรรจุ", qty: 1, unit: "แพ็ค" }], steps: ["ตรวจความครบของฉลาก", "ใช้ตามจำนวนผลิตจริง", "นับคงเหลือทุกสิ้นวัน"] }
  ],
  stockIns: [
    { id: uid(), itemId: "ID006", date: "2026-03-23", qty: 10, note: "รับเข้ารอบเช้า" },
    { id: uid(), itemId: "ID007", date: "2026-03-23", qty: 8, note: "รับเข้ารอบเช้า" },
    { id: uid(), itemId: "ID008", date: "2026-03-24", qty: 12, note: "supplier A" },
    { id: uid(), itemId: "ID009", date: "2026-03-24", qty: 15, note: "เตรียมโปรโมชัน" }
  ],
  stockOuts: [
    { id: uid(), itemId: "ID001", date: "2026-03-23", qty: 1, price: 5200, channel: "หน้าร้าน", note: "ขายเครื่องตัวอย่าง" },
    { id: uid(), itemId: "ID006", date: "2026-03-23", qty: 6, price: 65, channel: "ภายใน", note: "ใช้ในงานผลิต" },
    { id: uid(), itemId: "ID008", date: "2026-03-24", qty: 9, price: 79, channel: "หน้าร้าน", note: "ยอดดีช่วงบ่าย" },
    { id: uid(), itemId: "ID009", date: "2026-03-25", qty: 12, price: 35, channel: "ออนไลน์", note: "แคมเปญส่งฟรี" }
  ],
  dailyChecks: [
    { id: uid(), itemId: "ID008", date: "2026-03-28", counted: 40, note: "เช็กปลายวัน" }
  ],
  selectedItemId: "ID001"
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(SAMPLE_DATA);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) return structuredClone(SAMPLE_DATA);
    return parsed;
  } catch {
    return structuredClone(SAMPLE_DATA);
  }
}

const app = {
  state: loadState(),
  save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); },
  today() { return new Date().toISOString().slice(0, 10); },
  formatCurrency(v) { return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(v); },
  formatDate(v) { return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(v)); },
  shortDate(v) { const d = new Date(v); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`; },
  findItem(id) { return this.state.items.find((item) => item.id === id); },
  selectedItem() { return this.findItem(this.state.selectedItemId) || this.state.items[0] || null; },
  metrics(id) {
    const item = this.findItem(id);
    const stockIn = this.state.stockIns.filter((e) => e.itemId === id).reduce((s, e) => s + e.qty, 0);
    const stockOut = this.state.stockOuts.filter((e) => e.itemId === id).reduce((s, e) => s + e.qty, 0);
    return { item, stockIn, stockOut, currentStock: item.openingStock + stockIn - stockOut };
  },
  recentActivity() {
    const incoming = this.state.stockIns.map((e) => ({ date: e.date, title: `รับเข้า ${e.itemId}`, desc: `${this.findItem(e.itemId)?.name || e.itemId} +${e.qty}` }));
    const outgoing = this.state.stockOuts.map((e) => ({ date: e.date, title: `ขาย/เบิก ${e.itemId}`, desc: `${this.findItem(e.itemId)?.name || e.itemId} -${e.qty}` }));
    const checks = this.state.dailyChecks.map((e) => ({ date: e.date, title: `เช็กสต๊อก ${e.itemId}`, desc: `${this.findItem(e.itemId)?.name || e.itemId} นับจริง ${e.counted}` }));
    return [...incoming, ...outgoing, ...checks].sort((a, b) => b.date.localeCompare(a.date));
  },
  salesTrend() {
    const grouped = new Map();
    this.state.stockOuts.forEach((e) => grouped.set(e.date, (grouped.get(e.date) || 0) + e.qty * e.price));
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, total]) => ({ date, total })).slice(-7);
  },
  dashboardMetrics() {
    const all = this.state.items.map((item) => this.metrics(item.id));
    return {
      itemCount: this.state.items.length,
      reorderCount: all.filter((e) => e.currentStock <= e.item.reorderPoint).length,
      totalSales: this.state.stockOuts.reduce((s, e) => s + e.qty * e.price, 0),
      totalCurrent: all.reduce((s, e) => s + e.currentStock, 0),
      totalIncoming: all.reduce((s, e) => s + e.stockIn, 0),
      totalOutgoing: all.reduce((s, e) => s + e.stockOut, 0)
    };
  },
  populateItemOptions(select) {
    select.innerHTML = this.state.items.map((item) => `<option value="${item.id}">${item.id} · ${item.name}</option>`).join("");
    if (this.selectedItem()) select.value = this.selectedItem().id;
  },
  addItem(payload) {
    if (this.findItem(payload.id)) throw new Error("duplicate");
    this.state.items.push({ ...payload, recipe: [], steps: [] });
    this.state.selectedItemId = payload.id;
    this.save();
  },
  deleteItem(id) {
    if (this.state.items.length === 1) throw new Error("min");
    this.state.items = this.state.items.filter((item) => item.id !== id);
    this.state.stockIns = this.state.stockIns.filter((e) => e.itemId !== id);
    this.state.stockOuts = this.state.stockOuts.filter((e) => e.itemId !== id);
    this.state.dailyChecks = this.state.dailyChecks.filter((e) => e.itemId !== id);
    this.state.items.forEach((item) => item.recipe = (item.recipe || []).filter((r) => r.id !== id));
    this.state.selectedItemId = this.state.items[0]?.id || "";
    this.save();
  },
  addStockIn(entry) { this.state.stockIns.unshift({ id: uid(), ...entry }); this.save(); },
  addStockOut(entry) { this.state.stockOuts.unshift({ id: uid(), ...entry }); this.save(); },
  addDailyCheck(entry) { this.state.dailyChecks.unshift({ id: uid(), ...entry }); this.save(); },
  selectItem(id) { this.state.selectedItemId = id; this.save(); },
  exportData() {
    const blob = new Blob([JSON.stringify(this.state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sailor-piece-backup-${this.today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  importData(file, onDone) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed.items)) throw new Error("invalid");
        this.state = parsed;
        this.save();
        onDone(true);
      } catch {
        onDone(false);
      }
    };
    reader.readAsText(file, "utf-8");
  },
  reset() { this.state = structuredClone(SAMPLE_DATA); this.save(); }
};

function renderSidebar(activePage) {
  const nav = [
    ["index.html", "เริ่มต้น", "หน้าแรกของระบบ"],
    ["dashboard.html", "Dashboard", "ดูยอดขายและภาพรวม"],
    ["items.html", "รายการสินค้า", "เพิ่ม ลบ และเลือกสินค้า"],
    ["detail.html", "รายละเอียด", "วัตถุดิบและขั้นตอน"],
    ["transactions.html", "ธุรกรรม", "รับเข้าและขายออก"],
    ["daily.html", "เช็กสต๊อก", "นับของจริงประจำวัน"]
  ];
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">SP</div>
        <h1>Sailor Piece</h1>
        <p>เว็บออฟไลน์หลายหน้า เปิดจากไฟล์ได้ทันที และทุกหน้าจะใช้ข้อมูลชุดเดียวกัน</p>
      </div>
      <div class="nav-list">
        ${nav.map(([href, label, note]) => `<a class="nav-link ${activePage === href ? "active" : ""}" href="${href}"><span class="nav-label">${label}</span><span class="small-text">${note}</span></a>`).join("")}
      </div>
      <div class="sidebar-footer">
        <div class="button-row">
          <button class="primary-button" type="button" id="exportDataButton">สำรองข้อมูล</button>
          <button class="secondary-button" type="button" id="importDataButton">นำเข้า</button>
          <input type="file" id="importDataFile" accept=".json" hidden>
        </div>
        <button class="ghost-button" type="button" id="resetDataButton">รีเซ็ตตัวอย่าง</button>
        <div class="small-text">ข้อมูลเก็บใน localStorage ของ browser เครื่องนี้</div>
      </div>
    </aside>
  `;
}

function wireCommonActions(showToast) {
  document.getElementById("exportDataButton")?.addEventListener("click", () => { app.exportData(); showToast("สำรองข้อมูลเรียบร้อย"); });
  document.getElementById("importDataButton")?.addEventListener("click", () => document.getElementById("importDataFile")?.click());
  document.getElementById("importDataFile")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    app.importData(file, (ok) => {
      showToast(ok ? "นำเข้าข้อมูลเรียบร้อย" : "ไฟล์ JSON ไม่ถูกต้อง");
      if (ok) location.reload();
      event.target.value = "";
    });
  });
  document.getElementById("resetDataButton")?.addEventListener("click", () => {
    if (!confirm("ต้องการรีเซ็ตกลับเป็นข้อมูลตัวอย่างหรือไม่")) return;
    app.reset();
    showToast("รีเซ็ตข้อมูลแล้ว");
    location.reload();
  });
}

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}
