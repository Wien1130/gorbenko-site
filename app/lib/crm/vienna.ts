/** Локальное время Europe/Vienna → UTC. Не использует фиксированный +01 круглый год. */
export function viennaLocalToUtc(date: string, hour: number, minute: number): Date {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) throw new Error("bad date");
  for (const offsetHours of [1, 2]) {
    const utc = new Date(Date.UTC(y, m - 1, d, hour - offsetHours, minute, 0));
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Vienna",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(utc).map((p) => [p.type, p.value]),
    );
    if (
      Number(parts.year) === y &&
      Number(parts.month) === m &&
      Number(parts.day) === d &&
      Number(parts.hour) === hour &&
      Number(parts.minute) === minute
    ) {
      return utc;
    }
  }
  throw new Error(`Нет соответствия Europe/Vienna для ${date} ${hour}:${minute}`);
}

/** "2026-11-12" → 09:00 по Вене; полный ISO — как есть. Пусто — null. */
export function parseSendAt(v: unknown): Date | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const s = v.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return viennaLocalToUtc(s, 9, 0);
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function formatVienna(d: Date): string {
  return d.toLocaleString("ru-RU", {
    timeZone: "Europe/Vienna",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function weekdayDe(ymd: string): string {
  const utc = viennaLocalToUtc(ymd, 12, 0);
  return utc.toLocaleDateString("de-AT", { weekday: "long", timeZone: "Europe/Vienna" });
}

/** Условие отправляющего cron. needs_review и send_at NULL сюда не входят. */
export function cronWouldSend(status: string, sendAt: Date | null, now: Date): boolean {
  return status === "scheduled" && sendAt != null && sendAt.getTime() <= now.getTime();
}
