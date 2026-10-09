import { randomBytes } from "crypto";
import type { PitchContent, PitchFocus } from "./types";

/**
 * Персональная страница для лида («вау-презентация»): slug, URL, UTM, юридический фильтр,
 * проверенные факты, которыми Claude может пользоваться.
 */

export const SITE = "https://gorbenko.at";
export const WHATSAPP_NUMBER = "436765920259";
export const PHONE_DISPLAY = "+43 676 59 202 59";
export const INSTAGRAM_URL = "https://www.instagram.com/ki.mit.andrii/";
/** Ссылка на YouTube-канал — задать в Vercel env PITCH_YOUTUBE_URL, иначе блок не показывается. */
export const YOUTUBE_URL = process.env.PITCH_YOUTUBE_URL ?? "";

/** Короткий непредсказуемый slug: 10 символов, без похожих букв. */
export function newPitchSlug(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(10);
  let s = "";
  for (let i = 0; i < 10; i++) s += alphabet[bytes[i] % alphabet.length];
  return s;
}

export function pitchUrl(slug: string): string {
  return `${SITE}/p/${slug}`;
}

/** UTM для всех исходящих ссылок со страницы и из письма: источник — холодные продажи, менеджер Андрей. */
export function withUtm(url: string, slug: string, content = "page"): string {
  const u = new URL(url, SITE);
  u.searchParams.set("utm_source", "coldsales");
  u.searchParams.set("utm_medium", "pitch");
  u.searchParams.set("utm_campaign", "100kunden-2026-10");
  u.searchParams.set("utm_content", `${slug}-${content}`);
  return u.toString();
}

export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Проверенные факты (см. at-recht-werbeagentur): цифры только те, что уже опубликованы на сайте
 * и подтверждены. Полмиллиона просмотров у Nagl — НЕ публикуем, нет письменной freigabe.
 */
export const VERIFIED_FACTS = `
- Andrii Gorbenko: 15 Jahre eigener Unternehmer in der Ukraine, heute Werbeagentur in Wien (gorbenko.at). Einzelunternehmer.
- Leistungen: Websites & Landingpages, digitale Assistenten (KI-Chat für Website/Instagram/WhatsApp), Content & Reels (Drehtage mit Licht, Schnitt), Meta- und Google-Werbung, Sichtbarkeit in KI-Antworten (GEO), Marketing-Strategie. Preise öffentlich ab-Preise auf gorbenko.at/preise — KEINE konkreten Preise nennen, außer Andrii hat sie im Gespräch genannt.
- Referenz Messerschmiede Stefan Nagl (Wien 1140, custom.nagl-messer.at): Landingpage, digitaler Assistent, Drehtage in der Werkstatt, Drehbuch mit über 90 Reel-Ideen, Google- und Meta-Kampagnen. Keine Reichweiten- oder Umsatzzahlen nennen.
- Erstgespräch kostenlos, vor Ort im Betrieb oder online.
`.trim();

export const FOCUS_HINT: Record<PitchFocus, string> = {
  catering:
    "Fokus CATERING: Andrii hat in der Ukraine selbst Catering-Projekte geplant und umgesetzt und kennt Angebotskalkulation, Saisonspitzen, Firmenkunden-Akquise und Anfragen-Chaos per Telefon/E-Mail aus eigener Erfahrung. Vorschläge typischerweise: Anfrage-Strecke (Website/Landingpage mit Anfrageformular + digitaler Assistent, der Anfragen rund um die Uhr aufnimmt), Firmenkunden-Ansprache, Content von echten Events, Werbung zur Saison.",
  gastro:
    "Fokus RESTAURANT/CAFÉ: Reservierungen und Anfragen automatisch aufnehmen (digitaler Assistent), Google-Maps-Profil & Bewertungen, Reels aus der Küche/vom Team, Werbung im Umkreis, Website mit Speisekarte und Reservierung.",
  general:
    "Fokus ALLGEMEIN: Vorschläge aus dem ableiten, was im Gespräch wirklich Thema war. Nicht alle Leistungen aufzählen — 2–3 passende.",
};

/**
 * Слова, которые нельзя публиковать (GewO/UWG/AI Act).
 * fix задан — заменяем автоматически (однозначный термин); нет — только подсвечиваем,
 * чтобы не ломать грамматику и не менять смысл за спиной Андрея.
 */
const FORBIDDEN: { re: RegExp; fix?: string }[] = [
  { re: /\b(Chat)?[Bb]ots?\b/g, fix: "digitaler Assistent" },
  { re: /Unternehmensberat\w*/g, fix: "Marketing-Beratung" },
  { re: /Betriebsberat\w*/g, fix: "Marketing-Beratung" },
  { re: /Organisationsberat\w*/g, fix: "Marketing-Beratung" },
  { re: /\b[Gg]arantie\w*/g },
  { re: /\bNr\.?\s?1\b/g },
  { re: /\b[Dd](ie|er|as)\s+[Bb]este[nr]?\b/g },
  { re: /\b[Ff]ührend\w*/g },
  { re: /\b[Nn]etto\b/g },
  { re: /zzgl\.?\s*USt\.?/gi },
  { re: /\bMwSt\.?/g },
];

/** Возвращает очищенный контент и список найденных слов (для показа Андрею). */
export function sanitizePitch(content: PitchContent): { content: PitchContent; flags: string[] } {
  const flags = new Set<string>();
  const clean = (s: string): string => {
    let out = s;
    for (const f of FORBIDDEN) {
      const hits = out.match(f.re);
      if (hits) {
        hits.forEach((h) => flags.add(f.fix ? `${h} → ${f.fix}` : h));
        if (f.fix) out = out.replace(f.re, f.fix);
      }
      f.re.lastIndex = 0;
    }
    return out.replace(/\s{2,}/g, " ").trim();
  };
  return {
    content: {
      headline: clean(content.headline),
      subline: clean(content.subline),
      observed: content.observed.map(clean).filter(Boolean),
      proposals: content.proposals.map((p) => ({ title: clean(p.title), text: clean(p.text) })),
      why_me: clean(content.why_me),
      next_step: clean(content.next_step),
      whatsapp_text: clean(content.whatsapp_text),
      summary_ru: content.summary_ru,
    },
    flags: [...flags],
  };
}

export function defaultFocus(businessType: string): PitchFocus {
  if (businessType === "restaurant" || businessType === "cafe") return "gastro";
  return "general";
}
