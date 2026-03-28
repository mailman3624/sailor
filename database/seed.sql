insert into items (item_code, name, category, unit, opening_stock, reorder_point, price, description)
values
  ('ID001', 'Blender', 'equipment', 'unit', 5, 2, 5200, 'Main blender for drink production'),
  ('ID002', 'Cup Sealer', 'equipment', 'unit', 4, 1, 4300, 'Machine for sealing takeaway cups'),
  ('ID003', 'Electric Stove', 'equipment', 'unit', 6, 2, 3900, 'Heating equipment for production'),
  ('ID004', 'Mixing Pot', 'equipment', 'unit', 8, 3, 980, 'Main mixing container'),
  ('ID005', 'Cold Storage', 'equipment', 'unit', 3, 1, 8400, 'Cold storage for raw materials'),
  ('ID006', 'Flour Mix', 'material', 'kg', 40, 20, 65, 'Core ingredient used in several recipes'),
  ('ID007', 'Sugar', 'material', 'kg', 35, 15, 48, 'Sweetener for product recipes'),
  ('ID008', 'Fresh Milk', 'material', 'liter', 50, 20, 79, 'Fast moving chilled ingredient'),
  ('ID009', 'Cups', 'material', 'pack', 60, 30, 35, 'Packaging cups'),
  ('ID010', 'Brand Sticker', 'material', 'pack', 45, 20, 22, 'Brand label for packaging')
on conflict (item_code) do nothing;

insert into recipes (item_id, material_item_id, qty_required, unit)
select i.id, m.id, x.qty_required, x.unit
from (
  values
    ('ID001', 'ID006', 2::numeric, 'kg'),
    ('ID001', 'ID008', 3::numeric, 'liter'),
    ('ID001', 'ID009', 1::numeric, 'pack'),
    ('ID002', 'ID009', 2::numeric, 'pack'),
    ('ID002', 'ID010', 1::numeric, 'pack'),
    ('ID003', 'ID006', 1::numeric, 'kg'),
    ('ID003', 'ID007', 1::numeric, 'kg'),
    ('ID004', 'ID006', 2::numeric, 'kg'),
    ('ID004', 'ID007', 1::numeric, 'kg'),
    ('ID004', 'ID008', 2::numeric, 'liter'),
    ('ID005', 'ID008', 4::numeric, 'liter'),
    ('ID005', 'ID009', 1::numeric, 'pack')
) as x(item_code, material_code, qty_required, unit)
join items i on i.item_code = x.item_code
join items m on m.item_code = x.material_code
on conflict (item_id, material_item_id) do nothing;

insert into item_steps (item_id, step_no, step_text)
select i.id, x.step_no, x.step_text
from (
  values
    ('ID001', 1, 'Check the blender before use'),
    ('ID001', 2, 'Prepare materials according to the recipe'),
    ('ID001', 3, 'Record actual usage after production'),
    ('ID001', 4, 'Clean and store the blender'),
    ('ID002', 1, 'Warm up the cup sealer'),
    ('ID002', 2, 'Prepare cups and labels'),
    ('ID002', 3, 'Seal according to order quantity'),
    ('ID002', 4, 'Record damaged or wasted material'),
    ('ID003', 1, 'Check power and heat setting'),
    ('ID003', 2, 'Set proper cooking temperature'),
    ('ID003', 3, 'Monitor the cooking process'),
    ('ID003', 4, 'Clean after use'),
    ('ID004', 1, 'Prepare a clean mixing pot'),
    ('ID004', 2, 'Measure ingredients'),
    ('ID004', 3, 'Mix in the proper order'),
    ('ID004', 4, 'Record usage and remaining stock'),
    ('ID005', 1, 'Check internal temperature'),
    ('ID005', 2, 'Arrange items by category'),
    ('ID005', 3, 'Track stock movement'),
    ('ID005', 4, 'Summarize end-of-day balance')
) as x(item_code, step_no, step_text)
join items i on i.item_code = x.item_code
on conflict (item_id, step_no) do nothing;

insert into stock_ins (item_id, qty, received_at, note)
select i.id, x.qty, x.received_at::timestamptz, x.note
from (
  values
    ('ID006', 10::numeric, '2026-03-23 08:00:00+00', 'Morning receiving'),
    ('ID007', 8::numeric, '2026-03-23 08:15:00+00', 'Morning receiving'),
    ('ID008', 12::numeric, '2026-03-24 09:30:00+00', 'Supplier A'),
    ('ID009', 15::numeric, '2026-03-24 10:00:00+00', 'Promo preparation')
) as x(item_code, qty, received_at, note)
join items i on i.item_code = x.item_code;

insert into stock_outs (item_id, qty, price_per_unit, channel, note, sold_at)
select i.id, x.qty, x.price_per_unit, x.channel, x.note, x.sold_at::timestamptz
from (
  values
    ('ID001', 1::numeric, 5200::numeric, 'store', 'Sample equipment sale', '2026-03-23 12:00:00+00'),
    ('ID006', 6::numeric, 65::numeric, 'internal', 'Production usage', '2026-03-23 13:00:00+00'),
    ('ID008', 9::numeric, 79::numeric, 'store', 'Strong afternoon sale', '2026-03-24 14:00:00+00'),
    ('ID009', 12::numeric, 35::numeric, 'online', 'Free-shipping campaign', '2026-03-25 11:00:00+00')
) as x(item_code, qty, price_per_unit, channel, note, sold_at)
join items i on i.item_code = x.item_code;

insert into daily_checks (item_id, counted_qty, checked_at, note)
select i.id, x.counted_qty, x.checked_at::timestamptz, x.note
from (
  values
    ('ID008', 40::numeric, '2026-03-28 18:00:00+00', 'End of day check')
) as x(item_code, counted_qty, checked_at, note)
join items i on i.item_code = x.item_code;
