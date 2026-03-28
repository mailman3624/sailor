export type RecipeItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  openingStock: number;
  reorderPoint: number;
  price: number;
  description: string;
  recipe: RecipeItem[];
  steps: string[];
};

export type StockInEntry = {
  id: string;
  itemId: string;
  date: string;
  qty: number;
  note: string;
};

export type StockOutEntry = {
  id: string;
  itemId: string;
  date: string;
  qty: number;
  price: number;
  channel: string;
  note: string;
};

export type DailyCheckEntry = {
  id: string;
  itemId: string;
  date: string;
  counted: number;
  note: string;
};

export type AppState = {
  items: InventoryItem[];
  stockIns: StockInEntry[];
  stockOuts: StockOutEntry[];
  dailyChecks: DailyCheckEntry[];
  selectedItemId: string;
};
