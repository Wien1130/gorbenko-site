/** Маскирует имя/телефон звёздочками, оставляя первый символ. "Дмитрий" → "Д••••••" */
export function maskValue(value: string): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";
  return trimmed[0] + "•".repeat(Math.max(trimmed.length - 1, 3));
}
