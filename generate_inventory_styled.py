from datetime import date, timedelta
from pathlib import Path

import xlsxwriter


BASE = Path(r"C:\sailor piece")
OUT_PATH = BASE / "sailor piece inventory system styled.xlsx"
IMG_PATH = BASE / "Screenshot 2026-03-19 161730.png"


ITEMS = [
    ("ID001", "Blender", "Equipment", "unit", 5, 2),
    ("ID002", "Cup Sealer", "Equipment", "unit", 4, 1),
    ("ID003", "Electric Stove", "Equipment", "unit", 6, 2),
    ("ID004", "Mixing Pot", "Equipment", "unit", 8, 3),
    ("ID005", "Cold Storage", "Equipment", "unit", 3, 1),
    ("ID006", "Flour Mix", "Raw Material", "kg", 40, 20),
    ("ID007", "Sugar", "Raw Material", "kg", 35, 15),
    ("ID008", "Fresh Milk", "Raw Material", "liter", 50, 20),
    ("ID009", "Cups", "Raw Material", "pack", 60, 30),
    ("ID010", "Brand Sticker", "Raw Material", "pack", 45, 20),
]

RECIPES = {
    "ID001": [("ID006", "Flour Mix", 2, "kg"), ("ID008", "Fresh Milk", 3, "liter"), ("ID009", "Cups", 1, "pack")],
    "ID002": [("ID009", "Cups", 2, "pack"), ("ID010", "Brand Sticker", 1, "pack")],
    "ID003": [("ID006", "Flour Mix", 1, "kg"), ("ID007", "Sugar", 1, "kg")],
    "ID004": [("ID006", "Flour Mix", 2, "kg"), ("ID007", "Sugar", 1, "kg"), ("ID008", "Fresh Milk", 2, "liter")],
    "ID005": [("ID008", "Fresh Milk", 4, "liter"), ("ID009", "Cups", 1, "pack")],
    "ID006": [("ID007", "Sugar", 1, "kg"), ("ID008", "Fresh Milk", 1, "liter")],
    "ID007": [("ID006", "Flour Mix", 1, "kg")],
    "ID008": [("ID007", "Sugar", 1, "kg"), ("ID009", "Cups", 1, "pack")],
    "ID009": [("ID010", "Brand Sticker", 1, "pack")],
    "ID010": [("ID009", "Cups", 1, "pack")],
}

STEPS = {
    "ID001": ["Check equipment condition before use", "Prepare required ingredients", "Run production and record actual usage", "Clean equipment after use"],
    "ID002": ["Check sealer readiness", "Prepare cups and stickers", "Seal products based on order count", "Record usage and waste"],
    "ID003": ["Check plug and power system", "Set proper temperature", "Cook based on recipe plan", "Turn off and clean after use"],
    "ID004": ["Prepare main ingredients", "Measure quantities based on recipe", "Mix in the correct order", "Record output and remaining stock"],
    "ID005": ["Check storage temperature", "Arrange materials by category", "Record stock in and out", "Summarize end-of-day balance"],
    "ID006": ["Check material lot", "Release stock based on production plan", "Record issued quantity", "Seal and store correctly"],
    "ID007": ["Measure sugar quantity", "Prepare for production batch", "Record remaining quantity after use"],
    "ID008": ["Check expiry date", "Use based on recipe", "Return to cold storage immediately"],
    "ID009": ["Check pack quantity before use", "Issue stock based on sales", "Summarize remaining packs"],
    "ID010": ["Check label completeness", "Use based on actual production", "Count daily balance"],
}

START_DATE = date(2026, 3, 23)

STOCK_ROWS = [
    (START_DATE, "ID006", 10, "kg", "Morning receiving", 42),
    (START_DATE, "ID007", 8, "kg", "Morning receiving", 30),
    (START_DATE + timedelta(days=1), "ID008", 12, "liter", "Supplier A delivery", 55),
    (START_DATE + timedelta(days=1), "ID009", 15, "pack", "Promo preparation", 18),
    (START_DATE + timedelta(days=2), "ID001", 1, "unit", "Backup machine", 3500),
    (START_DATE + timedelta(days=2), "ID010", 10, "pack", "New labels", 12),
    (START_DATE + timedelta(days=3), "ID006", 5, "kg", "Urgent refill", 41),
    (START_DATE + timedelta(days=4), "ID008", 8, "liter", "Afternoon receiving", 54),
    (START_DATE + timedelta(days=5), "ID009", 12, "pack", "Weekend sale prep", 18),
    (START_DATE + timedelta(days=6), "ID007", 6, "kg", "End-week refill", 31),
]

SALES_ROWS = [
    (START_DATE, "ID001", 1, 5200, "Store", "Sample equipment sale"),
    (START_DATE, "ID006", 6, 65, "Store", "Production usage"),
    (START_DATE + timedelta(days=1), "ID007", 4, 48, "Online", "Bulk sale"),
    (START_DATE + timedelta(days=1), "ID008", 9, 79, "Store", "Strong afternoon sale"),
    (START_DATE + timedelta(days=2), "ID009", 12, 35, "Online", "Free-shipping campaign"),
    (START_DATE + timedelta(days=2), "ID010", 5, 22, "Store", "Counter sale"),
    (START_DATE + timedelta(days=3), "ID006", 8, 65, "Store", "Extra production use"),
    (START_DATE + timedelta(days=3), "ID008", 10, 79, "Delivery", "Group order"),
    (START_DATE + timedelta(days=4), "ID009", 15, 35, "Online", "Peak day"),
    (START_DATE + timedelta(days=4), "ID007", 6, 48, "Store", "Continued sale"),
    (START_DATE + timedelta(days=5), "ID008", 11, 79, "Delivery", "Weekend demand"),
    (START_DATE + timedelta(days=5), "ID006", 7, 65, "Store", "Extra issue"),
    (START_DATE + timedelta(days=6), "ID009", 14, 35, "Online", "Week close"),
    (START_DATE + timedelta(days=6), "ID010", 4, 22, "Store", "Decoration sale"),
]


def build_formats(workbook):
    return {
        "bg": workbook.add_format({"bg_color": "#F5EFE6"}),
        "hero": workbook.add_format(
            {
                "bold": True,
                "font_size": 22,
                "font_color": "#1F3A5F",
                "align": "left",
                "valign": "vcenter",
            }
        ),
        "subhero": workbook.add_format({"font_size": 11, "font_color": "#6D7C8F"}),
        "nav": workbook.add_format(
            {
                "bold": True,
                "font_color": "#0F4C5C",
                "bg_color": "#E2ECF5",
                "border": 1,
                "align": "center",
                "valign": "vcenter",
            }
        ),
        "section": workbook.add_format(
            {
                "bold": True,
                "font_size": 12,
                "font_color": "#23405E",
                "bg_color": "#DCE7F3",
                "border": 1,
            }
        ),
        "table_header": workbook.add_format(
            {
                "bold": True,
                "font_color": "white",
                "bg_color": "#23405E",
                "border": 1,
                "align": "center",
                "valign": "vcenter",
            }
        ),
        "cell": workbook.add_format({"border": 1, "bg_color": "#FFFDFC", "font_color": "#243447"}),
        "cell_center": workbook.add_format(
            {"border": 1, "bg_color": "#FFFDFC", "font_color": "#243447", "align": "center"}
        ),
        "text": workbook.add_format(
            {"border": 1, "bg_color": "#FFFDFC", "font_color": "#243447", "text_wrap": True, "valign": "top"}
        ),
        "num": workbook.add_format(
            {"border": 1, "bg_color": "#FFFDFC", "font_color": "#243447", "num_format": "#,##0"}
        ),
        "money": workbook.add_format(
            {"border": 1, "bg_color": "#FFFDFC", "font_color": "#243447", "num_format": "#,##0.00"}
        ),
        "date": workbook.add_format(
            {"border": 1, "bg_color": "#FFFDFC", "font_color": "#243447", "num_format": "yyyy-mm-dd"}
        ),
        "ok": workbook.add_format(
            {"bold": True, "border": 1, "bg_color": "#D8F0D2", "font_color": "#295C3D", "align": "center"}
        ),
        "alert": workbook.add_format(
            {"bold": True, "border": 1, "bg_color": "#F8D7C7", "font_color": "#8B3A2E", "align": "center"}
        ),
        "metric_label": workbook.add_format({"font_size": 10, "font_color": "#6D7C8F", "align": "center"}),
        "metric_value": workbook.add_format(
            {"bold": True, "font_size": 20, "font_color": "#17324D", "align": "center", "valign": "vcenter"}
        ),
        "metric_currency": workbook.add_format(
            {
                "bold": True,
                "font_size": 20,
                "font_color": "#17324D",
                "align": "center",
                "valign": "vcenter",
                "num_format": "#,##0.00",
            }
        ),
        "tile_name": workbook.add_format(
            {"bold": True, "font_size": 11, "font_color": "#17324D", "align": "center", "text_wrap": True}
        ),
        "tile_meta": workbook.add_format({"font_size": 9, "font_color": "#6D7C8F", "align": "center"}),
        "tile_id": workbook.add_format(
            {
                "bold": True,
                "font_size": 9,
                "font_color": "#0F4C5C",
                "bg_color": "#E9F2F7",
                "align": "center",
                "border": 1,
            }
        ),
        "step_no": workbook.add_format(
            {
                "bold": True,
                "font_color": "white",
                "bg_color": "#0F4C5C",
                "align": "center",
                "valign": "vcenter",
                "border": 1,
            }
        ),
        "note": workbook.add_format({"italic": True, "font_size": 10, "font_color": "#7A6F61"}),
    }


def paint_background(ws, rows=80, cols=10, fmt=None):
    for r in range(rows):
        ws.set_row(r, 22, fmt)
    for c in range(cols):
        ws.write_blank(0, c, None, fmt)


def create_start_sheet(wb, fmts):
    ws = wb.add_worksheet("Start")
    paint_background(ws, 36, 8, fmts["bg"])
    ws.set_column("A:A", 3)
    ws.set_column("B:G", 18)
    ws.merge_range("B2:G3", "Inventory Control Workspace", fmts["hero"])
    ws.merge_range(
        "B4:F5",
        "A cleaner workbook layout for daily stock checks, item instructions, and sales analysis.",
        fmts["subhero"],
    )

    nav_links = [
        ("B7:D8", "Open Menu", "internal:'Menu'!A1"),
        ("E7:G8", "Open Stock Summary", "internal:'Stock_Summary'!A1"),
        ("B10:D11", "Open Sales Log", "internal:'Sales_Log'!A1"),
        ("E10:G11", "Open Dashboard", "internal:'Dashboard'!A1"),
    ]
    for cell_range, label, link in nav_links:
        ws.merge_range(cell_range, label, fmts["nav"])
        ws.write_url(cell_range.split(":")[0], link, fmts["nav"], label)

    ws.merge_range("B14:D17", "", fmts["cell"])
    ws.merge_range("E14:G17", "", fmts["cell"])
    ws.merge_range("B19:D22", "", fmts["cell"])

    ws.write("B14", "10", fmts["metric_value"])
    ws.write("B16", "Tracked IDs", fmts["metric_label"])
    ws.write_formula("E14", "=COUNTIF(Stock_Summary!J:J,\"Reorder\")", fmts["metric_value"])
    ws.write("E16", "Need Reorder", fmts["metric_label"])
    ws.write_formula("B19", "=SUM(Sales_Log!E:E)", fmts["metric_currency"])
    ws.write("B21", "Current Sales Amount", fmts["metric_label"])
    ws.write("B25", "Workflow", fmts["section"])
    ws.merge_range(
        "B26:G30",
        "1. Update new receipts in Stock_In.\n2. Record sold or used quantities in Sales_Log.\n3. Review Stock_Summary for reorder status.\n4. Use Menu for item instructions and Dashboard for trends.",
        fmts["text"],
    )
    ws.write("B32", "This version still uses one placeholder image. Replace item images later without changing the workbook logic.", fmts["note"])


def create_menu_sheet(wb, fmts):
    ws = wb.add_worksheet("Menu")
    paint_background(ws, 68, 10, fmts["bg"])
    ws.set_column("A:A", 3)
    ws.set_column("B:H", 18)
    ws.merge_range("B2:G3", "Item Navigator", fmts["hero"])
    ws.merge_range("B4:G4", "Click an image tile to open ingredients and process steps for that item.", fmts["subhero"])

    positions = [("B", 7), ("E", 7), ("B", 19), ("E", 19), ("B", 31), ("E", 31), ("B", 43), ("E", 43), ("B", 55), ("E", 55)]
    for index, item in enumerate(ITEMS):
        col, row = positions[index]
        item_id, name, category, _, _, _ = item
        detail_sheet = f"{item_id}_Detail"
        end_col = chr(ord(col) + 1)

        for fill_row in range(row, row + 9):
            ws.write_blank(f"{col}{fill_row}", None, fmts["cell"])
            ws.write_blank(f"{end_col}{fill_row}", None, fmts["cell"])
        ws.insert_image(
            f"{col}{row+1}",
            str(IMG_PATH),
            {
                "x_scale": 0.22,
                "y_scale": 0.22,
                "url": f"internal:'{detail_sheet}'!A1",
                "tip": f"Open {item_id} detail",
            },
        )
        ws.merge_range(f"{col}{row+6}:{end_col}{row+6}", item_id, fmts["tile_id"])
        ws.merge_range(f"{col}{row+7}:{end_col}{row+7}", name, fmts["tile_name"])
        ws.merge_range(f"{col}{row+8}:{end_col}{row+8}", category, fmts["tile_meta"])


def create_stock_summary(wb, fmts):
    ws = wb.add_worksheet("Stock_Summary")
    ws.freeze_panes(1, 0)
    ws.set_zoom(95)
    ws.set_column("A:J", 16)
    headers = ["Item ID", "Item Name", "Category", "Unit", "Opening Stock", "Stock In", "Sold/Issued", "Current Stock", "Reorder Point", "Status"]
    for col, head in enumerate(headers):
        ws.write(0, col, head, fmts["table_header"])

    for row, item in enumerate(ITEMS, start=1):
        item_id, name, category, unit, opening, reorder = item
        ws.write(row, 0, item_id, fmts["cell"])
        ws.write(row, 1, name, fmts["cell"])
        ws.write(row, 2, category, fmts["cell"])
        ws.write(row, 3, unit, fmts["cell_center"])
        ws.write_number(row, 4, opening, fmts["num"])
        ws.write_formula(row, 5, f'=SUMIFS(Stock_In!$C:$C,Stock_In!$B:$B,A{row+1})', fmts["num"])
        ws.write_formula(row, 6, f'=SUMIFS(Sales_Log!$C:$C,Sales_Log!$B:$B,A{row+1})', fmts["num"])
        ws.write_formula(row, 7, f'=E{row+1}+F{row+1}-G{row+1}', fmts["num"])
        ws.write_number(row, 8, reorder, fmts["num"])
        ws.write_formula(row, 9, f'=IF(H{row+1}<=I{row+1},"Reorder","OK")', fmts["ok"])

    ws.conditional_format(1, 9, len(ITEMS), 9, {"type": "text", "criteria": "containing", "value": "Reorder", "format": fmts["alert"]})
    ws.write("A14", "Logic", fmts["section"])
    ws.merge_range(
        "A15:J17",
        "Current stock automatically rolls forward: opening stock + all received stock - all sold or issued quantities. You only need to keep adding daily transactions.",
        fmts["text"],
    )


def create_stock_in(wb, fmts):
    ws = wb.add_worksheet("Stock_In")
    ws.freeze_panes(1, 0)
    ws.set_column("A:F", 18)
    for col, head in enumerate(["Date", "Item ID", "Qty In", "Unit", "Note", "Cost/Unit"]):
        ws.write(0, col, head, fmts["table_header"])

    for row, rec in enumerate(STOCK_ROWS, start=1):
        d, item_id, qty, unit, note, cost = rec
        ws.write_datetime(row, 0, d, fmts["date"])
        ws.write(row, 1, item_id, fmts["cell"])
        ws.write_number(row, 2, qty, fmts["num"])
        ws.write(row, 3, unit, fmts["cell_center"])
        ws.write(row, 4, note, fmts["cell"])
        ws.write_number(row, 5, cost, fmts["money"])


def create_sales_log(wb, fmts):
    ws = wb.add_worksheet("Sales_Log")
    ws.freeze_panes(1, 0)
    ws.set_column("A:G", 18)
    for col, head in enumerate(["Date", "Item ID", "Qty Sold/Used", "Price/Unit", "Amount", "Channel", "Note"]):
        ws.write(0, col, head, fmts["table_header"])

    for row, rec in enumerate(SALES_ROWS, start=1):
        d, item_id, qty, price, channel, note = rec
        ws.write_datetime(row, 0, d, fmts["date"])
        ws.write(row, 1, item_id, fmts["cell"])
        ws.write_number(row, 2, qty, fmts["num"])
        ws.write_number(row, 3, price, fmts["money"])
        ws.write_formula(row, 4, f"=C{row+1}*D{row+1}", fmts["money"])
        ws.write(row, 5, channel, fmts["cell_center"])
        ws.write(row, 6, note, fmts["cell"])


def create_summary(wb, fmts):
    ws = wb.add_worksheet("Summary")
    ws.hide()
    ws.set_column("A:F", 18)
    for col, head in enumerate(["Item ID", "Item Name", "Total Qty", "Total Sales", "Current Stock", "Priority"]):
        ws.write(0, col, head, fmts["table_header"])
    for row, item in enumerate(ITEMS, start=1):
        item_id, name, _, _, _, _ = item
        ws.write(row, 0, item_id)
        ws.write(row, 1, name)
        ws.write_formula(row, 2, f'=SUMIFS(Sales_Log!$C:$C,Sales_Log!$B:$B,A{row+1})')
        ws.write_formula(row, 3, f'=SUMIFS(Sales_Log!$E:$E,Sales_Log!$B:$B,A{row+1})')
        ws.write_formula(row, 4, f"='Stock_Summary'!H{row+1}")
        ws.write_formula(row, 5, f'=IF(C{row+1}>=10,"Focus","Monitor")')
    ws.write("H1", "Date")
    ws.write("I1", "Daily Sales")
    for i in range(7):
        row = i + 1
        current_date = START_DATE + timedelta(days=i)
        ws.write_datetime(row, 7, current_date, fmts["date"])
        ws.write_formula(row, 8, f'=SUMIFS(Sales_Log!$E:$E,Sales_Log!$A:$A,H{row+1})')


def create_dashboard(wb, fmts):
    ws = wb.add_worksheet("Dashboard")
    paint_background(ws, 42, 10, fmts["bg"])
    ws.set_column("A:A", 3)
    ws.set_column("B:H", 18)
    ws.merge_range("B2:G3", "Sales and Stock Dashboard", fmts["hero"])
    ws.write("B4", "Quick visual view for daily operations and purchasing decisions.", fmts["subhero"])

    metric_blocks = [
        ("B", 6, "Total Sales Amount", "=SUM(Sales_Log!E:E)", fmts["metric_currency"]),
        ("D", 6, "Total Qty Sold", "=SUM(Sales_Log!C:C)", fmts["metric_value"]),
        ("F", 6, "Items to Reorder", '=COUNTIF(Stock_Summary!J:J,"Reorder")', fmts["metric_value"]),
    ]
    for col, row, label, formula, fmt in metric_blocks:
        end_col = chr(ord(col) + 1)
        ws.merge_range(f"{col}{row}:{end_col}{row+2}", "", fmts["cell"])
        ws.merge_range(f"{col}{row+3}:{end_col}{row+3}", label, fmts["metric_label"])
        ws.write_formula(f"{col}{row+1}", formula, fmt)

    chart1 = wb.add_chart({"type": "column"})
    chart1.add_series(
        {
            "name": "Total Qty",
            "categories": "=Summary!$B$2:$B$11",
            "values": "=Summary!$C$2:$C$11",
            "fill": {"color": "#C97C5D"},
            "border": {"color": "#9B5D43"},
        }
    )
    chart1.set_title({"name": "Best and Lowest Moving Items"})
    chart1.set_y_axis({"name": "Quantity", "major_gridlines": {"visible": False}})
    chart1.set_chartarea({"fill": {"color": "#F8F4EE"}, "border": {"none": True}})
    chart1.set_plotarea({"fill": {"color": "#F8F4EE"}, "border": {"color": "#D5CABB"}})
    chart1.set_legend({"none": True})

    chart2 = wb.add_chart({"type": "line"})
    chart2.add_series(
        {
            "name": "Daily Sales",
            "categories": "=Summary!$H$2:$H$8",
            "values": "=Summary!$I$2:$I$8",
            "line": {"color": "#0F4C5C", "width": 2.5},
            "marker": {"type": "circle", "size": 6, "border": {"color": "#0F4C5C"}, "fill": {"color": "#DDBEA9"}},
        }
    )
    chart2.set_title({"name": "Daily Sales Trend"})
    chart2.set_y_axis({"name": "Amount", "major_gridlines": {"visible": True, "color": "#E7DDD0"}})
    chart2.set_chartarea({"fill": {"color": "#F8F4EE"}, "border": {"none": True}})
    chart2.set_plotarea({"fill": {"color": "#F8F4EE"}, "border": {"color": "#D5CABB"}})

    ws.insert_chart("B12", chart1, {"x_scale": 1.12, "y_scale": 1.18})
    ws.insert_chart("B27", chart2, {"x_scale": 1.12, "y_scale": 1.18})
    ws.write("F12", "Reading the dashboard", fmts["section"])
    ws.merge_range(
        "F13:G19",
        "Use the bar chart to identify fast-moving items. Compare those items with current stock in Stock_Summary. If an item moves quickly and current stock is near the reorder point, prioritize purchasing.",
        fmts["text"],
    )
    ws.write_url("F21", "internal:'Stock_Summary'!A1", fmts["nav"], "Go to Stock Summary")
    ws.write_url("F23", "internal:'Sales_Log'!A1", fmts["nav"], "Go to Sales Log")


def create_detail_sheets(wb, fmts):
    for item in ITEMS:
        item_id, name, category, _, _, _ = item
        ws = wb.add_worksheet(f"{item_id}_Detail")
        paint_background(ws, 48, 10, fmts["bg"])
        ws.set_column("A:A", 3)
        ws.set_column("B:H", 18)
        ws.merge_range("B2:H3", f"{item_id}  |  {name}", fmts["hero"])
        ws.write("B4", "Category", fmts["section"])
        ws.write("C4", category, fmts["cell"])
        ws.write("E4", "Current Stock", fmts["section"])
        ws.write_formula("F4", f'=IFERROR(VLOOKUP("{item_id}",Stock_Summary!A:H,8,FALSE),0)', fmts["num"])
        ws.write_url("B6", "internal:'Menu'!A1", fmts["nav"], "Back to Menu")
        ws.write_url("D6", "internal:'Dashboard'!A1", fmts["nav"], "Open Dashboard")

        ws.merge_range("B8:D18", "", fmts["cell"])
        ws.insert_image("B9", str(IMG_PATH), {"x_scale": 0.3, "y_scale": 0.3})

        ws.write("E8", "Required Ingredients", fmts["section"])
        for col, head in enumerate(["Material ID", "Material Name", "Qty Needed", "Unit", "Current Balance"], start=4):
            ws.write(8, col, head, fmts["table_header"])
        for row, rec in enumerate(RECIPES[item_id], start=9):
            rec_id, rec_name, qty, unit = rec
            ws.write(row, 4, rec_id, fmts["cell"])
            ws.write(row, 5, rec_name, fmts["cell"])
            ws.write_number(row, 6, qty, fmts["num"])
            ws.write(row, 7, unit, fmts["cell_center"])
            ws.write_formula(row, 8, f'=IFERROR(VLOOKUP(E{row+1},Stock_Summary!A:H,8,FALSE),"Not in master")', fmts["cell"])

        step_row = 12 + len(RECIPES[item_id])
        ws.write(f"E{step_row}", "Process Steps", fmts["section"])
        for idx, step in enumerate(STEPS[item_id], start=1):
            row = step_row + idx
            ws.write_number(row, 4, idx, fmts["step_no"])
            ws.merge_range(row, 5, row, 8, step, fmts["text"])

        note_start = step_row + len(STEPS[item_id]) + 3
        ws.write(f"E{note_start}", "Note", fmts["section"])
        ws.merge_range(
            note_start,
            5,
            note_start + 2,
            8,
            "Swap the placeholder image for the real item photo and update the ingredients or steps directly on this sheet.",
            fmts["text"],
        )


def main():
    workbook = xlsxwriter.Workbook(str(OUT_PATH))
    workbook.set_properties(
        {
            "title": "Styled Inventory Workbook",
            "subject": "Inventory control and sales dashboard",
            "author": "OpenAI Codex",
        }
    )
    formats = build_formats(workbook)
    create_start_sheet(workbook, formats)
    create_menu_sheet(workbook, formats)
    create_stock_summary(workbook, formats)
    create_stock_in(workbook, formats)
    create_sales_log(workbook, formats)
    create_summary(workbook, formats)
    create_dashboard(workbook, formats)
    create_detail_sheets(workbook, formats)
    workbook.close()
    print(OUT_PATH)


if __name__ == "__main__":
    main()
