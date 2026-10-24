import type { ClientReport, FunnelWindow } from "../../lib/analytics-os/types";

function formatEur(cents: number): string {
  const neg = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const euros = Math.trunc(abs / 100);
  const rem = String(abs % 100).padStart(2, "0");
  const grouped = new Intl.NumberFormat("de-AT").format(euros);
  return `${neg ? "−" : ""}€${grouped},${rem}`;
}

function formatInt(n: number): string {
  return new Intl.NumberFormat("de-AT", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function formatCount(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  const whole = Math.abs(rounded - Math.round(rounded)) < 0.001;
  return new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: whole ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(rounded);
}

function formatPct(ratio: number): string {
  const text = new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(ratio * 100);
  return `${text} %`;
}

function formatRoas(n: number): string {
  return new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatFull(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

function formatDay(iso: string): string {
  const [, m, d] = iso.slice(0, 10).split("-");
  if (!m || !d) return iso;
  return `${d}.${m}.`;
}

function formatStamp(iso: string, tz: string): string {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "–";
  try {
    const parts = new Intl.DateTimeFormat("de-AT", {
      timeZone: tz || "Europe/Vienna",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(dt);
    const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
    return `${pick("day")}.${pick("month")}. ${pick("hour")}:${pick("minute")}`;
  } catch {
    return "–";
  }
}

function dash(show: boolean, value: string): string {
  return show ? value : "–";
}

function windowMetrics(w: FunnelWindow | undefined) {
  if (!w) {
    const empty = "–";
    return {
      spend: empty,
      clicks: empty,
      cpc: empty,
      intents: empty,
      leads: empty,
      orders: empty,
      revenue: empty,
      cpl: empty,
      cr: empty,
      cac: empty,
      roas: empty,
    };
  }
  return {
    spend: formatEur(w.cost_cents),
    clicks: formatInt(w.clicks),
    cpc: dash(w.clicks >= 1, formatEur(w.cpc_cents)),
    intents: formatInt(w.contact_intents),
    leads: formatInt(w.leads_echt),
    orders: formatInt(w.orders),
    revenue: formatEur(w.revenue_cents),
    cpl: dash(w.leads_echt >= 1, formatEur(w.cpl_cents)),
    cr: dash(w.clicks >= 1, formatPct(w.cr1)),
    cac: dash(w.orders >= 1, formatEur(w.cac_cents)),
    roas: dash(w.cost_cents >= 1, formatRoas(w.roas)),
  };
}

const ROWS: Array<{ key: keyof ReturnType<typeof windowMetrics>; label: string; rule?: boolean }> = [
  { key: "spend", label: "Ausgaben" },
  { key: "clicks", label: "Klicks" },
  { key: "cpc", label: "CPC" },
  { key: "intents", label: "Kontaktabsicht" },
  { key: "leads", label: "Anfragen (echt)" },
  { key: "orders", label: "Bestellungen" },
  { key: "revenue", label: "Umsatz" },
  { key: "cpl", label: "CPL", rule: true },
  { key: "cr", label: "CR" },
  { key: "cac", label: "CAC" },
  { key: "roas", label: "ROAS" },
];

function barWidth(value: number, max: number): string {
  if (value <= 0 || max <= 0) return "0%";
  return `${Math.max(2, Math.round((value / max) * 100))}%`;
}

function Block({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4 sm:p-6">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
      {note ? <p className="mt-4 text-xs leading-relaxed text-[#9ca3af]">{note}</p> : null}
    </section>
  );
}

export function ReportView({ report, isDemo }: { report: ClientReport; isDemo: boolean }) {
  const w7 = windowMetrics(report.windows.find((w) => w.window_days === 7));
  const w28 = windowMetrics(report.windows.find((w) => w.window_days === 28));
  const maxCost = Math.max(1, ...report.daily.map((d) => d.cost_cents));
  const maxClicks = Math.max(1, ...report.daily.map((d) => d.clicks));
  const lastWeek = report.platformVsFact[report.platformVsFact.length - 1]?.week_start;

  return (
    <main className="min-h-screen bg-[#0d0d0d] px-4 py-8 text-[#f3f3f3] sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
              {report.client.name}
              <span className="text-[#8d8d8d]"> · Werbe-Auswertung</span>
            </h1>
          </div>
          <div className="text-sm sm:text-right">
            {isDemo ? (
              <p className="mb-1.5 inline-block rounded-full border border-[#fbbf24]/40 bg-[#fbbf24]/10 px-2.5 py-1 text-xs font-medium text-[#fbbf24]">
                Demo-Daten · fiktive Zahlen
              </p>
            ) : null}
            <p className="text-[#c8c8c8]">
              Stand: Daten bis {report.standBis ? formatFull(report.standBis) : "–"}
            </p>
            {report.lastLoad ? (
              <p className="text-[#9ca3af]">zuletzt geladen {formatStamp(report.lastLoad, report.client.tz)}</p>
            ) : null}
          </div>
        </header>

        <Block
          title="Trichter"
          note="Kontaktabsicht = Klick auf WhatsApp, Telefon oder Formular. Anfrage = bestätigter Kontakt."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              ["7 Tage", w7],
              ["28 Tage", w28],
            ].map(([title, values]) => (
              <div key={title as string}>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#00d4aa]">{title as string}</h3>
                <dl>
                  {ROWS.map((row) => (
                    <div
                      key={row.key}
                      className={`flex items-baseline justify-between gap-4 py-1.5 ${
                        row.rule ? "mt-2 border-t border-[#2a2a2a] pt-2.5" : ""
                      }`}
                    >
                      <dt className="text-sm text-[#9ca3af]">{row.label}</dt>
                      <dd className="text-sm tabular-nums">{(values as typeof w7)[row.key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Ausgaben & Klicks pro Tag (28 Tage)">
          <div className="mb-3 flex gap-4 text-[11px] text-[#9ca3af]">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded-sm bg-[#00d4aa]" /> Ausgaben
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded-sm bg-[#38bdf8]" /> Klicks
            </span>
            <span className="text-[#fbbf24]">● Kontaktabsicht</span>
            <span className="text-[#00d4aa]">● Anfrage</span>
          </div>
          <div className="flex flex-col gap-2">
            {report.daily.map((day) => (
              <div key={day.date} className="grid grid-cols-[3.25rem_1fr] items-center gap-3">
                <div className="text-[11px] tabular-nums text-[#9ca3af]">{formatDay(day.date)}</div>
                <div className="min-w-0">
                  <div className="flex h-2 items-center">
                    <div className="h-2 rounded-sm bg-[#00d4aa]" style={{ width: barWidth(day.cost_cents, maxCost) }} />
                  </div>
                  <div className="mt-1 flex h-1.5 items-center">
                    <div className="h-1.5 rounded-sm bg-[#38bdf8]" style={{ width: barWidth(day.clicks, maxClicks) }} />
                  </div>
                  <p className="mt-0.5 text-[11px] tabular-nums text-[#bdbdbd]">
                    {formatEur(day.cost_cents)} · {formatInt(day.clicks)} Klicks
                    {day.contact_intents > 0 ? (
                      <span className="text-[#fbbf24]">
                        {" "}
                        · {formatInt(day.contact_intents)}{" "}
                        {day.contact_intents === 1 ? "Kontaktabsicht" : "Kontaktabsichten"}
                      </span>
                    ) : null}
                    {day.leads_echt > 0 ? (
                      <span className="text-[#00d4aa]">
                        {" "}
                        · {formatInt(day.leads_echt)} {day.leads_echt === 1 ? "Anfrage" : "Anfragen"}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Kampagnen (28 Tage)">
          {report.campaigns.length === 0 ? (
            <p className="text-sm text-[#9ca3af]">Keine Kampagnen im Zeitraum.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="text-xs text-[#9ca3af]">
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 text-right font-medium">Klicks</th>
                    <th className="py-2 pr-3 text-right font-medium">Ausgaben</th>
                    <th className="py-2 pr-3 text-right font-medium">Kontaktabsicht</th>
                    <th className="py-2 pr-3 text-right font-medium">Anfragen</th>
                    <th className="py-2 text-right font-medium">Bestellungen</th>
                  </tr>
                </thead>
                <tbody>
                  {report.campaigns.map((row) => (
                    <tr key={row.campaign_id ?? row.name} className="border-b border-[#222]">
                      <td className="py-2 pr-3">{row.name}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatInt(row.clicks)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatEur(row.cost_cents)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatInt(row.contact_intents)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatInt(row.leads_echt)}</td>
                      <td className="py-2 text-right tabular-nums">{formatInt(row.orders)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Block>

        <Block
          title="Suchanfragen mit Kosten, aber ohne Anfrage (28 Tage)"
          note="Grundlage für Ausschluss-Begriffe – Entscheidung nach Freigabe."
        >
          {report.zeroTerms.length === 0 ? (
            <p className="text-sm text-[#9ca3af]">Keine Suchanfragen mit Kosten und ohne Anfrage.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-[#9ca3af]">
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="py-2 pr-3 font-medium">Suchanfrage</th>
                    <th className="py-2 pr-3 text-right font-medium">Klicks</th>
                    <th className="py-2 text-right font-medium">Kosten</th>
                  </tr>
                </thead>
                <tbody>
                  {report.zeroTerms.map((row) => (
                    <tr key={row.term} className="border-b border-[#222]">
                      <td className="py-2 pr-3">{row.term}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatInt(row.clicks)}</td>
                      <td className="py-2 text-right tabular-nums">{formatEur(row.cost_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Block>

        <Block
          title="Laut Google / laut uns"
          note="Google-Zahlen reifen bis zu 7 Tage nach; die letzte Woche ist noch nicht vergleichbar."
        >
          {report.platformVsFact.length === 0 ? (
            <p className="text-sm text-[#9ca3af]">Keine Wochenwerte.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="text-xs text-[#9ca3af]">
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="py-2 pr-3 font-medium">Woche</th>
                    <th className="py-2 pr-3 text-right font-medium">Google Conversions</th>
                    <th className="py-2 pr-3 text-right font-medium">Kontaktabsichten</th>
                    <th className="py-2 pr-3 text-right font-medium">Anfragen</th>
                    <th className="py-2 text-right font-medium">Bestellungen</th>
                  </tr>
                </thead>
                <tbody>
                  {report.platformVsFact.map((row) => (
                    <tr key={row.week_start} className="border-b border-[#222]">
                      <td className="py-2 pr-3">
                        ab {formatDay(row.week_start)}
                        {row.week_start === lastWeek ? (
                          <span className="mt-0.5 block text-[11px] text-[#9ca3af]">noch nicht vergleichbar</span>
                        ) : null}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatCount(row.google_conversions)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatCount(row.our_intents)}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{formatCount(row.our_leads)}</td>
                      <td className="py-2 text-right tabular-nums">{formatCount(row.our_orders)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Block>

        <p className="text-xs leading-relaxed text-[#8d8d8d]">
          Zahlen aus der Datenbank der Gorbenko Werbeagentur · Aktualisierung alle 15 Minuten · Empfehlungen sind
          Hinweise, Entscheidung und Umsetzung nach Freigabe.
        </p>
      </div>
    </main>
  );
}
