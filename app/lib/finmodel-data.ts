// Источник: перенесено из Cursor-канв blinhaus-finmodel.canvas.tsx и
// blinhaus-horeca-markup.canvas.tsx (13-15.07.2026). Держим данные тут, чтобы
// оба клиентских компонента могли их импортировать без дублирования.

export function eur(n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

export function pct(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return `${n.toFixed(1)}%`;
}

export function parseNum(s: string): number {
  const v = parseFloat(s.replace(",", ".").replace(/\s/g, ""));
  return isNaN(v) ? 0 : v;
}

export type Product = {
  num: number;
  ru: string;
  de: string;
  optRaw: number | null;
  optReady: number | null;
  retailRaw: number | null;
  retailReady: number | null;
  costRawM: number | null;
  costRawL: number | null;
  costReadyM: number | null;
  costReadyL: number | null;
  // Реальное меню кафе (фото 13.07.2026): цена + себестоимость, которая ей соответствует
  // (для сырников это "готовая", а не "сырая" себестоимость — кафе продаёт готовое блюдо)
  cafeMenuM?: number;
  cafeMenuL?: number;
  cafeCostM?: number;
  cafeCostL?: number;
  cafeNote?: string;
};

// Источник: Prais Viena HoReCa (1).xlsx (Novo Trade GmbH, TM BlinHaus), 13.07.2026
export const PRODUCTS: Product[] = [
  { num: 1, ru: "Пельмени со свининой", de: "Pelmeni mit Schweinefleisch", optRaw: 12, optReady: null, retailRaw: 18, retailReady: null, costRawM: 3, costRawL: null, costReadyM: null, costReadyL: null, cafeMenuM: 6, cafeCostM: 3 },
  { num: 2, ru: "Пельмени с телятиной", de: "Pelmeni mit Kalbfleisch", optRaw: 15, optReady: null, retailRaw: 22, retailReady: null, costRawM: 3.75, costRawL: null, costReadyM: null, costReadyL: null, cafeMenuM: 7, cafeCostM: 3.75 },
  { num: 3, ru: "Пельмени с тремя видами мяса", de: "Pelmeni mit drei Fleischsorten", optRaw: 12, optReady: null, retailRaw: 18, retailReady: null, costRawM: 3, costRawL: null, costReadyM: null, costReadyL: null, cafeMenuM: 6, cafeCostM: 3 },
  { num: 4, ru: "Пельмени с курицей", de: "Pelmeni mit Hähnchen", optRaw: 12, optReady: null, retailRaw: 18, retailReady: null, costRawM: 3, costRawL: null, costReadyM: null, costReadyL: null, cafeMenuM: 6, cafeCostM: 3 },
  { num: 5, ru: "Пельмени с индейкой", de: "Pelmeni mit Pute", optRaw: 12, optReady: null, retailRaw: 18, retailReady: null, costRawM: 3, costRawL: null, costReadyM: null, costReadyL: null, cafeMenuM: 7, cafeCostM: 3 },
  { num: 6, ru: "Пельмени с бараниной", de: "Pelmeni mit Lammfleisch", optRaw: 16, optReady: null, retailRaw: 23, retailReady: null, costRawM: null, costRawL: null, costReadyM: 3.5, costReadyL: null, cafeMenuM: 7, cafeCostM: 3.5 },
  { num: 7, ru: "Пельмени со свининой, жаренные", de: "Gebratene Pelmeni mit Schweinefleisch", optRaw: null, optReady: 14.12, retailRaw: null, retailReady: 24, costRawM: null, costRawL: null, costReadyM: 3.5, costReadyL: null },
  { num: 8, ru: "Пельмени с тремя видами мяса, жаренные", de: "Gebratene Pelmeni mit drei Fleischsorten", optRaw: null, optReady: 14.12, retailRaw: null, retailReady: 24, costRawM: null, costRawL: null, costReadyM: 3.5, costReadyL: null },
  { num: 9, ru: "Пельмени с курицей, жаренные", de: "Gebratene Pelmeni mit Hähnchen", optRaw: null, optReady: 14.12, retailRaw: null, retailReady: 24, costRawM: null, costRawL: null, costReadyM: 3.5, costReadyL: null },
  { num: 10, ru: "Пельмени с индейкой, жаренные", de: "Gebratene Pelmeni mit Pute", optRaw: null, optReady: 14.12, retailRaw: null, retailReady: 24, costRawM: null, costRawL: null, costReadyM: 3.5, costReadyL: null },
  { num: 11, ru: "Вареники со свининой", de: "Wareniki mit Schweinefleisch", optRaw: 12, optReady: null, retailRaw: 18, retailReady: null, costRawM: 3, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 12, ru: "Вареники с говядиной", de: "Wareniki mit Rindfleisch", optRaw: 15, optReady: null, retailRaw: 21, retailReady: null, costRawM: 3.75, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 13, ru: "Вареники с картофелем и маслом", de: "Wareniki mit Kartoffeln und Butter", optRaw: 10, optReady: null, retailRaw: 16, retailReady: null, costRawM: 2.5, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 14, ru: "Вареники с грибами и картофелем", de: "Wareniki mit Pilzen und Kartoffeln", optRaw: 10, optReady: null, retailRaw: 16, retailReady: null, costRawM: 2.5, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 15, ru: "Вареники с капустой", de: "Wareniki mit Kohl", optRaw: 8.82, optReady: null, retailRaw: 15, retailReady: null, costRawM: 2.25, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 16, ru: "Вареники со сладким творогом", de: "Wareniki mit süßem Quark", optRaw: 12, optReady: null, retailRaw: 18, retailReady: null, costRawM: 3, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 17, ru: "Вареники с вишней", de: "Wareniki mit Kirschen", optRaw: 14, optReady: null, retailRaw: 20, retailReady: null, costRawM: 3.5, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 18, ru: "Вареники с вишней и маком", de: "Wareniki mit Kirschen und Mohn", optRaw: 14, optReady: null, retailRaw: 20, retailReady: null, costRawM: 3.5, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 19, ru: "Вареники с маком", de: "Wareniki mit Mohn", optRaw: 12, optReady: null, retailRaw: 18, retailReady: null, costRawM: 3, costRawL: null, costReadyM: null, costReadyL: null },
  { num: 20, ru: "Картофельные зразы с грибами", de: "Kartoffel-Zrazy mit Pilzen", optRaw: 12, optReady: 14, retailRaw: 18, retailReady: 20, costRawM: 2.4, costRawL: 3.6, costReadyM: 2.8, costReadyL: 4.2, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.8, cafeCostL: 4.2 },
  { num: 21, ru: "Картофельные зразы с мясом", de: "Kartoffel-Zrazy mit Fleisch", optRaw: 12, optReady: 14, retailRaw: 18, retailReady: 20, costRawM: 2.4, costRawL: 3.6, costReadyM: 2.8, costReadyL: 4.2, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.8, cafeCostL: 4.2 },
  { num: 22, ru: "Чебуреки со свининой", de: "Tschebureki mit Schweinefleisch", optRaw: 12, optReady: 14, retailRaw: 18, retailReady: 20, costRawM: 1.5, costRawL: 3, costReadyM: 3.5, costReadyL: 4.5 },
  { num: 23, ru: "Чебуреки со свининой, сыром и помидорами", de: "Tschebureki mit Schweinefleisch, Käse und Tomaten", optRaw: 13.33, optReady: 15.33, retailRaw: 20, retailReady: 22, costRawM: 1.65, costRawL: 3.3, costReadyM: 3.25, costReadyL: 4.9 },
  { num: 24, ru: "Бендерики с мясом", de: "Benderiki mit Fleisch", optRaw: 11, optReady: 13, retailRaw: 17, retailReady: 19, costRawM: 2.2, costRawL: 3.3, costReadyM: 2.6, costReadyL: 3.9, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.6, cafeCostL: 3.9 },
  { num: 25, ru: "Бендерики с курицей и моцареллой", de: "Benderiki mit Hähnchen und Mozzarella", optRaw: 11, optReady: 13, retailRaw: 17, retailReady: 19, costRawM: 2.2, costRawL: 3.3, costReadyM: 2.6, costReadyL: 3.9, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.6, cafeCostL: 3.9 },
  { num: 26, ru: "Перепелка, 1 шт", de: "Wachtel, 1 Stk.", optRaw: null, optReady: 6, retailRaw: null, retailReady: null, costRawM: null, costRawL: null, costReadyM: 6, costReadyL: null, cafeMenuM: 10, cafeCostM: 6 },
  { num: 27, ru: "Рыбный суп (уха), порция 300 гр.", de: "Fischsuppe (Ucha), Portion 300 g", optRaw: null, optReady: 3.5, retailRaw: null, retailReady: null, costRawM: null, costRawL: null, costReadyM: 3.5, costReadyL: null },
  { num: 28, ru: "Блинчики с тунцом", de: "Pfannkuchen mit Thunfisch", optRaw: null, optReady: 13, retailRaw: null, retailReady: 18, costRawM: null, costRawL: null, costReadyM: 2.4, costReadyL: 3.6 },
  { num: 29, ru: "Блинчики с лососем и шпинатом", de: "Pfannkuchen mit Lachs und Spinat", optRaw: null, optReady: 12, retailRaw: null, retailReady: 18, costRawM: null, costRawL: null, costReadyM: 2.4, costReadyL: 3.6, cafeMenuM: 9, cafeMenuL: 12, cafeCostM: 2.4, cafeCostL: 3.6 },
  { num: 30, ru: "Блинчики с говядиной", de: "Pfannkuchen mit Rindfleisch", optRaw: null, optReady: 12, retailRaw: null, retailReady: 18, costRawM: null, costRawL: null, costReadyM: 2.4, costReadyL: 3.6, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.4, cafeCostL: 3.6, cafeNote: "прокси: меню «Rindfleisch und Pute»" },
  { num: 31, ru: "Блинчики с курицей и грибами", de: "Pfannkuchen mit Hähnchen und Pilzen", optRaw: null, optReady: 11, retailRaw: null, retailReady: 17, costRawM: null, costRawL: null, costReadyM: 2.2, costReadyL: 3.3, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.2, cafeCostL: 3.3 },
  { num: 32, ru: "Блинчики с грибами", de: "Pfannkuchen mit Pilzen", optRaw: null, optReady: 11, retailRaw: null, retailReady: 17, costRawM: null, costRawL: null, costReadyM: 2.2, costReadyL: 3.3, cafeMenuM: 5, cafeMenuL: 7.5, cafeCostM: 2.2, cafeCostL: 3.3, cafeNote: "веганская версия в меню" },
  { num: 33, ru: "Блинчики с моцареллой и вялеными помидорами", de: "Pfannkuchen mit Mozzarella und getrockneten Tomaten", optRaw: null, optReady: 11, retailRaw: null, retailReady: 17, costRawM: null, costRawL: null, costReadyM: 2.2, costReadyL: 3.3, cafeMenuM: 5, cafeMenuL: 7.5, cafeCostM: 2.2, cafeCostL: 3.3 },
  { num: 34, ru: "Блинчики с малиной и маскарпоне", de: "Pfannkuchen mit Himbeeren und Mascarpone", optRaw: null, optReady: 14, retailRaw: null, retailReady: 20, costRawM: null, costRawL: null, costReadyM: 2.8, costReadyL: 4.2, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.8, cafeCostL: 4.2 },
  { num: 35, ru: "Блинчики с маком и вишней", de: "Pfannkuchen mit Mohn und Kirschen", optRaw: null, optReady: 12, retailRaw: null, retailReady: 18, costRawM: null, costRawL: null, costReadyM: 2.4, costReadyL: 3.6, cafeMenuM: 5, cafeMenuL: 7.5, cafeCostM: 2.4, cafeCostL: 3.6 },
  { num: 36, ru: "Блинчики с творогом и черникой", de: "Pfannkuchen mit Quark und Heidelbeeren", optRaw: null, optReady: 12, retailRaw: null, retailReady: 18, costRawM: null, costRawL: null, costReadyM: 2.4, costReadyL: 3.6, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.4, cafeCostL: 3.6 },
  { num: 37, ru: "Блинчики с вишней и шоколадом", de: "Pfannkuchen mit Kirschen und Schokolade", optRaw: null, optReady: 12, retailRaw: null, retailReady: 18, costRawM: null, costRawL: null, costReadyM: 2.4, costReadyL: 3.6, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.4, cafeCostL: 3.6 },
  { num: 38, ru: "Блинчики с карамелизированными яблоками", de: "Pfannkuchen mit karamellisierten Äpfeln", optRaw: null, optReady: 11, retailRaw: null, retailReady: 17, costRawM: null, costRawL: null, costReadyM: 2.2, costReadyL: 3.3, cafeMenuM: 5, cafeMenuL: 7.5, cafeCostM: 2.2, cafeCostL: 3.3, cafeNote: "веганская версия в меню" },
  { num: 39, ru: "Блинчики с творогом (сладкие)", de: "Pfannkuchen mit Quark (süß)", optRaw: null, optReady: 12, retailRaw: null, retailReady: 17, costRawM: null, costRawL: null, costReadyM: 2.4, costReadyL: 3.6, cafeMenuM: 6, cafeMenuL: 9, cafeCostM: 2.4, cafeCostL: 3.6 },
  { num: 40, ru: "Сырники классические, 1 шт. = 55 гр", de: "Klassische Syrniki 1 Stk.=55 g", optRaw: 15, optReady: 18, retailRaw: 22, retailReady: 24, costRawM: 2.5, costRawL: 3.35, costReadyM: 3, costReadyL: 4, cafeMenuM: 9, cafeMenuL: 12, cafeCostM: 3, cafeCostL: 4, cafeNote: "меню: 3 шт / 4 шт, себестоимость готовая" },
  { num: 41, ru: "Сырники с изюмом, 1 шт. = 55 гр", de: "Syrniki mit Rosinen 1 Stk.=55 g", optRaw: 15, optReady: 18, retailRaw: 22, retailReady: 24, costRawM: 2.5, costRawL: 3.35, costReadyM: 3, costReadyL: 4, cafeMenuM: 9, cafeMenuL: 12, cafeCostM: 3, cafeCostL: 4 },
  { num: 42, ru: "Сырники с шоколадными каплями, 1 шт. = 55 гр", de: "Syrniki mit Schokoladenstückchen 1 Stk.=55 g", optRaw: 15, optReady: 18, retailRaw: 22, retailReady: 24, costRawM: 2.5, costRawL: 3.35, costReadyM: 3, costReadyL: 4, cafeMenuM: 9, cafeMenuL: 12, cafeCostM: 3, cafeCostL: 4 },
  { num: 43, ru: "Орешки «Солёная карамель» (1кг=40шт)", de: "Plätzchen „Salzkaramell“ (1kg=40Stk)", optRaw: null, optReady: 31, retailRaw: null, retailReady: 46, costRawM: null, costRawL: null, costReadyM: 0.78, costReadyL: null, cafeMenuM: 1.5, cafeCostM: 0.78 },
  { num: 44, ru: "Орешки «Три шоколада» (1кг=40шт)", de: "Plätzchen „Dreifach Schokolade“ (1kg=40Stk)", optRaw: null, optReady: 31, retailRaw: null, retailReady: 46, costRawM: null, costRawL: null, costReadyM: 0.78, costReadyL: null, cafeMenuM: 1.5, cafeCostM: 0.78 },
  { num: 45, ru: "Орешки «Красная смородина» (1кг=40шт)", de: "Plätzchen „Rote Johannisbeere“ (1kg=40Stk)", optRaw: null, optReady: 31, retailRaw: null, retailReady: 46, costRawM: null, costRawL: null, costReadyM: 0.78, costReadyL: null, cafeMenuM: 1.5, cafeCostM: 0.78 },
  { num: 46, ru: "Орешки «Два молока» (1кг=40шт)", de: "Plätzchen „Zwei Milchsorten“ (1kg=40Stk)", optRaw: null, optReady: 31, retailRaw: null, retailReady: 46, costRawM: null, costRawL: null, costReadyM: 0.78, costReadyL: null, cafeMenuM: 1.5, cafeCostM: 0.78 },
];

export type Drink = { name: string; qty: number; sum: number };

// Источник: BlinHaus napoji Apr-Jun 2026.xlsx (ready2order, реальные продажи апр-июнь 2026, "Разом" колонки)
export const DRINKS_HOT: Drink[] = [
  { name: "Kleiner Cappuccino", qty: 268, sum: 683.4 },
  { name: "Großer Cappuccino", qty: 150, sum: 595 },
  { name: "Café Latte", qty: 107, sum: 515.5 },
  { name: "Verlängerter/Americano", qty: 135, sum: 334.5 },
  { name: "Kleiner schwarzer/Espresso", qty: 77, sum: 183.48 },
  { name: "Matcha Latte", qty: 40, sum: 161 },
  { name: "Chai Latte (Sortiment)", qty: 23, sum: 115 },
  { name: "Flat white", qty: 22, sum: 90.22 },
  { name: "Große schwarzer/Double espresso", qty: 32, sum: 90.15 },
  { name: "Melange", qty: 19, sum: 76 },
  { name: "Cinnamon latte", qty: 13, sum: 71.5 },
  { name: "Kakao", qty: 16, sum: 64 },
  { name: "Americano mit milch", qty: 12, sum: 48 },
  { name: "Kleine brauner/espresso with milk", qty: 17, sum: 45.9 },
  { name: "Espresso makiato", qty: 7, sum: 24.5 },
  { name: "Mokka", qty: 3, sum: 13.5 },
  { name: "Große brauner/double espresso with milk", qty: 4, sum: 12.8 },
  { name: "Warm Milk", qty: 5, sum: 7.5 },
  { name: "Englischerfrühstücks Tee", qty: 27, sum: 64.25 },
  { name: "Grünner Tee", qty: 20, sum: 47.62 },
  { name: "Herbal tea", qty: 8, sum: 16.74 },
  { name: "Roibusch Tee", qty: 4, sum: 10 },
  { name: "Pepperminz Tee", qty: 2, sum: 5 },
  { name: "Tee Erl Grey", qty: 1, sum: 2.5 },
];

export const DRINKS_BOTTLED: Drink[] = [
  { name: "Coca Cola", qty: 45, sum: 157.5 },
  { name: "Coca Cola Zero", qty: 31, sum: 108.5 },
  { name: "Limonade (Sortiment)", qty: 14, sum: 80.1 },
  { name: "Tarhun (вкл. Tarchun)", qty: 22, sum: 72.46 },
  { name: "Limonade Saperavi", qty: 22, sum: 72.44 },
  { name: "Limonade Pear", qty: 15, sum: 47.94 },
  { name: "Fuze tee Zitrone", qty: 16, sum: 46.05 },
  { name: "Fanta", qty: 12, sum: 42 },
  { name: "Fuze tee Pfirsich", qty: 13, sum: 39 },
  { name: "Sprite", qty: 2, sum: 7 },
  { name: "Cola", qty: 4, sum: 6 },
  { name: "Tarragun", qty: 3, sum: 6 },
  { name: "Grape lemonade", qty: 1, sum: 3.5 },
  { name: "Cola zero", qty: 1, sum: 1.5 },
  { name: "Rauch Apfelsaft 0.2L", qty: 46, sum: 110.4 },
  { name: "Rauch Orange 0.2L", qty: 14, sum: 34.58 },
  { name: "Borjomi", qty: 36, sum: 103.2 },
  { name: "Romerquelle Prickelnd", qty: 35, sum: 90.99 },
  { name: "Romerquelle Still", qty: 27, sum: 72.9 },
  { name: "Borjomi L", qty: 9, sum: 25.6 },
  { name: "Borjomi 0,5", qty: 2, sum: 5 },
  { name: "Stiegel Goldbräu", qty: 48, sum: 215.55 },
];

export function markup(opt: number | null, retail: number | null): { eur: number; pct: number } | null {
  if (opt === null || retail === null || opt === 0) return null;
  return { eur: retail - opt, pct: ((retail - opt) / opt) * 100 };
}

export function portionCost(p: Product): number | null {
  return p.costRawM ?? p.costRawL ?? p.costReadyM ?? p.costReadyL ?? null;
}
