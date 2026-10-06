/**
 * Движок конструктора оффера.
 * Источник: ~/gorbenko/me/PRICING.md + канва gorbenko-preis-konstruktor (17.09.2026).
 * Правило: если есть Setup, 1-й месяц = только Setup, ведение со 2-го (×2 за 3 мес).
 */

export type PricingBlock = {
  id: string;
  rubrik: string;
  name: string;
  kurz: string;
  loest: string;
  einmalig: number;
  monatlich: number;
  ab?: boolean;
  hinweis?: string;
  enthaelt: string[];
  fremd?: string;
};

export type PricingPackage = {
  id: string;
  name: string;
  preis: number;
  ziel: string;
  blocks: string[];
  fremd: string;
};

export const RUBRIKEN = [
  "Analyse",
  "Websites & Shops",
  "Werbung",
  "Content & Instagram",
  "Automatisierung & AI",
] as const;

export const BLOCKS: PricingBlock[] = [
  {
    id: "analyse",
    kurz: "Business-Analyse",
    rubrik: "Analyse",
    name: "Business-Analyse + Automatisierungsplan",
    loest: "Wo verliert der Betrieb Geld — und was bringt zuerst Ergebnis?",
    einmalig: 2500,
    monatlich: 0,
    hinweis: "2–3 Tage im Betrieb + schriftlicher Plan",
    enthaelt: [
      "2–3 Tage in der Praxis, Gespräche mit Ihnen und dem Team",
      "Schriftlicher Plan: wo Geld verloren geht, was zuerst Ergebnis bringt",
      "Prioritäten für Website, Werbung, Automatisierung",
      "Nicht enthalten: die Umsetzung selbst",
    ],
  },
  {
    id: "landing",
    kurz: "Website scharf / Landingpage",
    rubrik: "Websites & Shops",
    name: "Landingpage / Website (neu oder bestehende scharf schalten)",
    loest: "Zwei große Angebote, ein Weg zum Termin — dann Werbung darauf",
    einmalig: 3500,
    monatlich: 0,
    hinweis: "Patienten-Videos: vorhandene nutzen, sonst im Reels-Paket drehen",
    fremd: "* Domain ca. 20–40 €/Jahr — an den Registrar, nicht an uns",
    enthaelt: [
      "Ein spezialisiertes Angebot im Zentrum — nicht „alles ein bisschen“",
      "Zweiter Weg auf derselben Seite: große Taste",
      "Gesichter/Videos: vorhandene nutzen, sonst drehen wir — mit Einwilligung",
      "Klarer CTA: schreiben / Fall anschauen lassen. Keine Behandlungspreise",
      "Danach erst Werbung auf diese eine Seite",
    ],
  },
  {
    id: "shop",
    kurz: "Online-Shop einfach",
    rubrik: "Websites & Shops",
    name: "Online-Shop (einfach)",
    loest: "Verkaufen rund um die Uhr, Zahlung und Versand automatisch",
    einmalig: 6500,
    monatlich: 0,
    enthaelt: [
      "Katalog, Warenkorb, Zahlung, Versand",
      "Bestellungen landen bei Ihnen, nicht im E-Mail-Chaos",
      "Nicht enthalten: Produktfotos und komplexe Konfiguratoren",
    ],
  },
  {
    id: "shopComplex",
    kurz: "Online-Shop komplex",
    rubrik: "Websites & Shops",
    name: "Online-Shop (komplex, Konfigurator)",
    loest: "Individuelle Produkte online bestellbar — ohne Anruf und E-Mail-Chaos",
    einmalig: 10500,
    monatlich: 0,
    ab: true,
    hinweis: "ab-Preis — Fixangebot nach kurzem Gespräch über den Umfang",
    enthaelt: [
      "Konfigurator: der Kunde stellt das Produkt selbst zusammen",
      "Abhängige Optionen, Checkout, weniger Anrufe",
      "Fixpreis nach kurzem Gespräch über den Umfang — ab 10.500 €",
      "Nicht enthalten: Produktfotos",
    ],
  },
  {
    id: "meta",
    kurz: "Targeting + Remarketing (Meta)",
    rubrik: "Werbung",
    name: "Meta-Werbung: Targeting + Remarketing (Facebook + Instagram)",
    loest: "Neue Patienten über Targeting; wer die Website schon gesehen hat, kommt per Remarketing zurück",
    einmalig: 800,
    monatlich: 500,
    hinweis: "1. Monat = nur Setup 800 €, Betreuung 500 €/Mon. ab dem 2. Monat",
    fremd: "* mind. 500 €/Mon. Werbebudget an Meta — Ihr Konto, nicht unsere Rechnung",
    enthaelt: [
      "Kampagnen auf Facebook und Instagram",
      "Targeting neuer Interessenten + Remarketing der Website-Besucher",
      "Betreuung ab Monat 2; Werbebudget extra, läuft über Ihr Konto",
      "Nicht enthalten: das Werbegeld selbst",
    ],
  },
  {
    id: "google",
    kurz: "Google Ads (Suche)",
    rubrik: "Werbung",
    name: "Google Ads — Suche (Setup + Betreuung)",
    loest: "Wer aktiv sucht, findet Sie — nicht den Mitbewerber",
    einmalig: 700,
    monatlich: 400,
    hinweis: "1. Monat = nur Setup 700 €, Betreuung 400 €/Mon. ab dem 2. Monat",
    fremd: "* mind. 800 €/Mon. Werbebudget an Google — Ihr Konto, nicht unsere Rechnung",
    enthaelt: [
      "Suchanzeigen für aktive Nachfrage",
      "Keywords, Anzeigentexte, Conversion-Tracking",
      "Betreuung ab Monat 2; Werbebudget extra, über Ihr Konto",
      "Nicht enthalten: das Werbegeld · Remarketing/Targeting ist das Meta-Paket",
    ],
  },
  {
    id: "reels",
    kurz: "8 Reels / Monat",
    rubrik: "Content & Instagram",
    name: "Reels-Paket: 8 Videos / Monat",
    loest: "Gesicht + Vertrauen: Interessenten kommen schon „vorgewärmt“",
    einmalig: 0,
    monatlich: 1500,
    hinweis: "Drehtag (Licht + Technik) ist im Paket enthalten — nicht extra",
    enthaelt: [
      "8 Videos / Monat: Idee, Dreh mit Licht, Schnitt",
      "Drehtag (Licht + Technik) ist enthalten — nicht extra",
      "Kurzer CTA: schreiben, Fall anschauen lassen",
      "Nicht enthalten: tägliche DM-Antworten (das ist IG-Betreuung)",
    ],
  },
  {
    id: "video1",
    kurz: "Einzelvideo",
    rubrik: "Content & Instagram",
    name: "Einzelnes Video",
    loest: "Ein Anlass, ein Video — ohne Monatspaket",
    einmalig: 250,
    monatlich: 0,
    enthaelt: [
      "Ein Video, ein Anlass — ohne Monatspaket",
      "Idee + Schnitt; Drehtag nur wenn extra gebucht",
    ],
  },
  {
    id: "igRepack",
    kurz: "Instagram-Neuverpackung",
    rubrik: "Content & Instagram",
    name: "Instagram-Neuverpackung (Bio, Highlights, Struktur)",
    loest: "Profil erklärt in 5 Sekunden: wer, für wen, warum schreiben",
    einmalig: 600,
    monatlich: 0,
    enthaelt: [
      "Bio, Highlights, eine klare Handlung in 5 Sekunden",
      "Struktur: wer, für wen, warum schreiben",
      "Nicht enthalten: laufendes Posten und Reels",
    ],
  },
  {
    id: "igBetreuung",
    kurz: "IG-Betreuung + DM",
    rubrik: "Content & Instagram",
    name: "Instagram-Betreuung + DM-Antworten",
    loest: "Follower werden zu Terminen — niemand bleibt unbeantwortet",
    einmalig: 0,
    monatlich: 500,
    enthaelt: [
      "Antworten im Direct, leichte Pflege des Profils",
      "Kein Lead bleibt unbeantwortet",
      "Nicht enthalten: 8 Reels / Monat (das ist das Reels-Paket)",
    ],
  },
  {
    id: "bot",
    kurz: "AI-Assistent 24/7",
    rubrik: "Automatisierung & AI",
    name: "AI-Assistent (Instagram / Facebook / WhatsApp / Website)",
    loest: "Antwortet 24/7, stellt die richtigen Fragen, bucht Termine",
    einmalig: 2200,
    monatlich: 250,
    fremd:
      "* WhatsApp-API nur falls Business-API: wenige € an Meta; AI-Tools stecken in unseren 250 €",
    enthaelt: [
      "Digitaler Assistent: Instagram, Facebook, WhatsApp, Website",
      "Erste Antwort sagt klar: das ist kein Mensch (EU-Recht)",
      "Qualifiziert die Anfrage und übergibt an die Rezeption",
      "Nicht enthalten: direkte Anbindung an jede Praxis-Software",
    ],
  },
  {
    id: "crm",
    kurz: "CRM + SMS + Prozesse",
    rubrik: "Automatisierung & AI",
    name: "CRM + SMS + Team-Prozesse (3-Monats-Projekt)",
    loest: "Jeder Kunde erfasst, SMS automatisch, Team weiß, wer was macht",
    einmalig: 2800,
    monatlich: 250,
    fremd: "* SMS nach Verbrauch — direkt an den SMS-Anbieter, nicht an uns",
    enthaelt: [
      "Jeder Kontakt erfasst; Team weiß, wer was macht",
      "SMS-Erinnerungen — Tool-Kosten nach Verbrauch",
      "3-Monats-Projekt inkl. Schulung",
    ],
  },
  {
    id: "dashboard",
    kurz: "Messung + Wochenbericht",
    rubrik: "Automatisierung & AI",
    name: "Messung + Dashboard (Pixel, Quelle, Wochenbericht)",
    loest: "Sie sehen jede Woche: Anfragen → Termine → Umsatz. Keine Hoffnung, Zahlen",
    einmalig: 2000,
    monatlich: 200,
    hinweis: "2.000 € Einrichtung, danach 200 €/Mon. Betreuung + Bericht",
    enthaelt: [
      "Pixel + Events: Termin-Klick, WhatsApp, Formular",
      "Feld „Woher?“ — ohne Quelle schließt die Rezeption den Kontakt nicht",
      "Jede Woche ein kurzer Bericht: Anfragen → Termine → gekommen",
      "Nicht enthalten: die Werbung selbst",
    ],
  },
  {
    id: "reakt",
    kurz: "Kunden-Rückholung",
    rubrik: "Automatisierung & AI",
    name: "Kunden-Rückholung (Kostenplan / Recall)",
    loest:
      "Alle, die einen Kostenplan bekommen und nie geantwortet haben, kriegen eine persönliche Nachricht mit einem Grund zurückzukommen",
    einmalig: 500,
    monatlich: 0,
    hinweis: "Liste → 2–3 Nachrichten pro Person → Antworten landen bei der Rezeption",
    fremd: "* SMS/WhatsApp-Welle ca. 50–150 € — direkt an den Anbieter, nicht an uns",
    enthaelt: [
      "Liste: Kostenplan ohne Termin, ggf. Recall",
      "2–3 Nachrichten von der Praxis, nicht von der Agentur",
      "Antworten landen bei der Rezeption; eine Welle, danach kurze Auswertung",
      "Nicht enthalten: monatliche Autowelle, neues CRM",
    ],
  },
];

export const HOMAYUNI_PACKAGES: PricingPackage[] = [
  {
    id: "start",
    name: "Start",
    preis: 1900,
    ziel: "Sehen wir überhaupt, woher die Patienten kommen?",
    blocks: ["landing", "dashboard", "reakt"],
    fremd: "* Extra, nicht an uns: Domain 20–40 €/Jahr · SMS-Welle ca. 50–150 €",
  },
  {
    id: "wachstum",
    name: "Wachstum",
    preis: 3500,
    ziel: "Wer schon sucht, findet uns — und kommt vorgewärmt.",
    blocks: ["landing", "dashboard", "reakt", "reels", "igRepack", "google"],
    fremd:
      "* Extra, nicht an uns: Google Ads mind. 800 €/Mon. auf Ihr Konto · Domain · SMS-Welle 50–150 €",
  },
  {
    id: "system",
    name: "System",
    preis: 4900,
    ziel: "Suche, Remarketing, Targeting — und nachts antwortet der Assistent.",
    fremd:
      "* Extra, nicht an uns: Google mind. 800 €/Mon. + Meta mind. 500 €/Mon. = ab 1.300 €/Mon. auf Ihre Werbekonten",
    blocks: [
      "landing",
      "dashboard",
      "reakt",
      "reels",
      "igRepack",
      "google",
      "meta",
      "bot",
    ],
  },
];

export function getBlock(id: string): PricingBlock | undefined {
  return BLOCKS.find((b) => b.id === id);
}

export function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}

export function euro(n: number): string {
  return `${n.toLocaleString("de-AT")} €`;
}

/** Цена блока за 3 месяца. Setup + ведение ×2, иначе ×3. */
export function kosten3M(b: PricingBlock): number {
  if (b.einmalig > 0 && b.monatlich > 0) return b.einmalig + b.monatlich * 2;
  return b.einmalig + b.monatlich * 3;
}

export function blockPreisLabel(b: PricingBlock): string {
  const ab = b.ab ? "ab " : "";
  if (b.einmalig > 0 && b.monatlich > 0) {
    return `${ab}${euro(b.einmalig)} + ${euro(b.monatlich)}/Mon.`;
  }
  if (b.monatlich > 0) return `${ab}${euro(b.monatlich)}/Mon.`;
  return `${ab}${euro(b.einmalig)}`;
}

export function matchPackage(
  selected: string[],
  packages: PricingPackage[],
): PricingPackage | null {
  return packages.find((p) => sameSet(p.blocks, selected)) ?? null;
}

export function summarize(selected: string[]) {
  const chosen = selected
    .map(getBlock)
    .filter((b): b is PricingBlock => Boolean(b));
  const monat1 = chosen.reduce(
    (s, b) => s + b.einmalig + (b.einmalig === 0 ? b.monatlich : 0),
    0,
  );
  const abMonat2 = chosen.reduce((s, b) => s + b.monatlich, 0);
  const einzel3M = chosen.reduce((s, b) => s + kosten3M(b), 0);
  const fremd = chosen.map((b) => b.fremd).filter((x): x is string => Boolean(x));
  return { chosen, monat1, abMonat2, einzel3M, fremd };
}

export function parseSelectionParam(
  raw: string | undefined,
  packages: PricingPackage[],
  fallback: string[],
): string[] {
  if (!raw) return fallback;
  const preset = packages.find((p) => p.id === raw);
  if (preset) return [...preset.blocks];
  const ids = raw
    .split(",")
    .map((x) => x.trim())
    .filter((id) => BLOCKS.some((b) => b.id === id));
  return ids.length ? ids : fallback;
}

export function selectionToParam(
  selected: string[],
  packages: PricingPackage[],
): string {
  const pack = matchPackage(selected, packages);
  return pack ? pack.id : selected.join(",");
}
