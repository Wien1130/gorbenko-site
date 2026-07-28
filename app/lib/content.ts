/**
 * Единый источник контента публичного сайта: услуги + кейсы.
 * Используется страницами, навигацией, sitemap и JSON-LD.
 */

export const SITE_URL = "https://gorbenko.at";
export const CONTACT = {
  whatsapp: "https://wa.me/436765920259",
  whatsappLabel: "+43 676 59 202 59",
  phone: "+436765920259",
  phoneLabel: "+43 676 59 202 59",
  email: "gorbenkomagic@gmail.com",
  telegram: "https://t.me/GorbenkoAndrey",
  telegramLabel: "@GorbenkoAndrey",
  instagramPersonal: "https://www.instagram.com/andrii_gorbenko/",
  instagramKi: "https://www.instagram.com/ki.mit.andrii/",
  youtube: "https://gorbenko.at/yt",
};

export type Pain = { title: string; text: string };
export type Faq = { q: string; a: string };
export type Metric = {
  /** numeric part for Counter animation */
  value: number;
  prefix?: string;
  suffix?: string;
  /** if set, rendered as plain text instead of Counter (e.g. "24/7") */
  text?: string;
  label: string;
};

export type Service = {
  slug: string;
  /** short name for nav / cards */
  name: string;
  /** accent color from the palette */
  color: string;
  icon: "bot" | "globe" | "video" | "megaphone" | "sparkles" | "chart";
  /** one-liner for bento cards on homepage */
  teaser: string;
  /** longer description for /leistungen overview */
  description: string;
  h1: string;
  sub: string;
  pains: Pain[];
  /** "Was ich mache" bullet points */
  deliverables: { title: string; text: string }[];
  miniCase: {
    title: string;
    text: string;
    projectSlug: string;
    metrics: Metric[];
  };
  faqs: Faq[];
  /** optional note rendered below the page content */
  note?: string;
  seoTitle: string;
  seoDescription: string;
};

export type Project = {
  slug: string;
  client: string;
  branch: string;
  location: string;
  tags: string[];
  liveUrl?: string;
  liveLabel?: string;
  /** short teaser for cards */
  teaser: string;
  /** headline metric shown on overview card */
  headline: string;
  situation: string;
  steps: { title: string; text: string }[];
  metrics: Metric[];
  quote?: { text: string; author: string; role: string };
  /** screenshot paths relative to /public, if captured */
  screenshots: { desktop?: string; mobile?: string };
  badge?: string;
  featured?: boolean;
  seoDescription: string;
};

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const services: Service[] = [
  {
    slug: "ki-chatbots",
    name: "KI-Chatbots & Automatisierung",
    color: "var(--accent)",
    icon: "bot",
    teaser:
      "Ein digitaler Assistent, der Ihre Kunden auf Facebook, Instagram & WhatsApp bedient — 24/7, in Ihrem Ton.",
    description:
      "Ihr KI-Assistent beantwortet Fragen, nimmt Bestellungen auf und kennt Ihre Preise, Produkte und Lieferzeiten. Trainiert auf Ihren Betrieb, nicht von der Stange.",
    h1: "Ein KI-Assistent, der Ihre Kunden bedient — 24/7.",
    sub: "Auf Facebook, Instagram und WhatsApp: beantwortet Fragen, nimmt Bestellungen auf, kennt Ihre Preise, Produkte und Lieferzeiten — in Ihrem Ton.",
    pains: [
      {
        title: "Nachrichten kommen abends und am Wochenende",
        text: "Sie stehen in der Werkstatt oder Küche — und können nicht jede Nachricht sofort beantworten.",
      },
      {
        title: "Jede unbeantwortete Anfrage ist eine verlorene Bestellung",
        text: "Wer nach zwei Stunden keine Antwort bekommt, kauft beim Mitbewerber.",
      },
      {
        title: "Immer dieselben Fragen",
        text: "Preise, Öffnungszeiten, Lieferung, Größen — 80 % der Anfragen wiederholen sich.",
      },
    ],
    deliverables: [
      {
        title: "Training auf Ihren Betrieb",
        text: "Der Assistent lernt Ihr Sortiment, Ihre Preise, Lieferprozesse und Größen — und antwortet so, wie Sie es tun würden.",
      },
      {
        title: "Bestellannahme mit Benachrichtigung",
        text: "Bestellungen werden aufgenommen, Preise berechnet, und Sie bekommen sofort eine Nachricht aufs Handy.",
      },
      {
        title: "Übergabe an Menschen",
        text: "Bei komplexen Anliegen übergibt der Assistent nahtlos an Sie — kein Kunde bleibt in der Schleife hängen.",
      },
      {
        title: "Laufende Pflege",
        text: "Neue Produkte, neue Preise, neue Aktionen — der Assistent bleibt aktuell.",
      },
      {
        title: "KI-Schulung für Ihr Team",
        text: "Auf Wunsch bringe ich Ihnen und Ihrem Team bei, selbst mit KI zu arbeiten — ohne Angst vor der Technik.",
      },
    ],
    miniCase: {
      title: "BlinHaus Vienna",
      text: "Ein Wiener Café nimmt Bestellungen über Instagram und Facebook vollautomatisch entgegen.",
      projectSlug: "blinhaus",
      metrics: [
        { value: 3000, prefix: "€", label: "Mehrumsatz in 15 Tagen" },
        { value: 95, suffix: " %", label: "automatisch beantwortet" },
        { value: 10, prefix: "<", suffix: " s", label: "Antwortzeit" },
      ],
    },
    faqs: [
      {
        q: "Klingt der Assistent nicht roboterhaft?",
        a: "Nein. Der Assistent wird auf Ihren Ton trainiert — freundlich, wienerisch, per Sie oder per Du, wie Sie möchten. Ihre Kunden merken den Unterschied vor allem daran, dass sie sofort eine hilfreiche Antwort bekommen.",
      },
      {
        q: "Was passiert, wenn der Assistent etwas nicht weiß?",
        a: "Dann sagt er das ehrlich und übergibt das Gespräch an Sie. Sie bekommen eine Benachrichtigung und können persönlich übernehmen.",
      },
      {
        q: "Wie lange dauert die Einrichtung?",
        a: "In der Regel 1–2 Wochen: Daten sammeln, trainieren, testen, live gehen. Danach läuft der Assistent rund um die Uhr.",
      },
      {
        q: "Wissen meine Kunden, dass sie mit einer KI schreiben?",
        a: "Ja — der Assistent stellt sich transparent als digitaler Assistent vor, wie es der EU AI Act verlangt. Das schafft Vertrauen und ist rechtlich sauber.",
      },
    ],
    note: "Übrigens: Jeder meiner Assistenten sagt Ihren Kunden transparent, dass er ein digitaler Assistent ist — so, wie es der EU AI Act verlangt.",
    seoTitle: "KI-Chatbot für Unternehmen in Wien",
    seoDescription:
      "KI-Chatbots für Wiener Betriebe: beantwortet Kundenanfragen auf Facebook, Instagram & WhatsApp, nimmt Bestellungen auf — 24/7. Kostenlose Beratung.",
  },
  {
    slug: "websites",
    name: "Websites & Online-Shops",
    color: "var(--c-blue)",
    icon: "globe",
    teaser:
      "Blitzschnelle Websites und Online-Shops — vom Landingpage bis zum Shop mit Produkt-Konfigurator.",
    description:
      "Websites, die in einer Sekunde laden und auf ein Ziel fokussiert sind: Anfragen für Ihr Geschäft. Landingpages, Shopify-Shops, individuelle Shops mit Konfigurator.",
    h1: "Websites, die in einer Sekunde laden — und Kunden bringen.",
    sub: "Von der Landingpage bis zum Online-Shop mit Konfigurator. Modern, blitzschnell, auf ein Ziel fokussiert: Anfragen für Ihr Geschäft.",
    pains: [
      {
        title: "Ihre Website lädt langsam",
        text: "Jede Sekunde Ladezeit kostet Besucher. Google straft langsame Seiten im Ranking ab.",
      },
      {
        title: "Am Handy sieht sie schlecht aus",
        text: "Über 70 % Ihrer Besucher kommen vom Smartphone — dort entscheidet sich der erste Eindruck.",
      },
      {
        title: "Sie bringt keine Anfragen",
        text: "Eine Website ohne klares Ziel ist eine digitale Visitenkarte — hübsch, aber nutzlos.",
      },
    ],
    deliverables: [
      {
        title: "Landingpages, die konvertieren",
        text: "Ein Ziel, eine Botschaft, ein Klick zur Anfrage — wie bei der Messerschmiede Nagl.",
      },
      {
        title: "Online-Shops auf Shopify",
        text: "Katalog, Warenkorb, Zahlung, Versand — schnell live und einfach selbst zu pflegen.",
      },
      {
        title: "Individuelle Shops mit Konfigurator",
        text: "Wenn Standard nicht reicht: Produkt-Konfiguratoren mit Materialwahl, Maßerfassung und Live-Preisberechnung.",
      },
      {
        title: "Geschwindigkeit als Standard",
        text: "Lighthouse-Werte über 90 sind bei mir kein Extra, sondern Pflicht.",
      },
      {
        title: "Analytics & Pixel",
        text: "Google Analytics, Meta Pixel, Conversion-Tracking — Sie sehen, was Ihre Website bringt.",
      },
    ],
    miniCase: {
      title: "Messerschmiede Stefan Nagl",
      text: "Landingpage für handgefertigte Messer — Video-Hero, Testimonials von Wiener Köchen, WhatsApp-Direktkontakt.",
      projectSlug: "nagl",
      metrics: [
        { value: 0, text: "custom.nagl-messer.at", label: "Live-Website" },
        { value: 9, suffix: "+", label: "Video-Clips produziert" },
        { value: 0, text: "WhatsApp", label: "Direkte Anfragen" },
      ],
    },
    faqs: [
      {
        q: "Was ist besser für mich: Shopify oder eine individuelle Website?",
        a: "Für die meisten Shops ist Shopify die schnellste und günstigste Lösung. Individuell wird es, wenn Sie besondere Anforderungen haben — etwa einen Produkt-Konfigurator oder spezielle Prozesse. Das klären wir in der kostenlosen Beratung.",
      },
      {
        q: "Kann ich die Website danach selbst pflegen?",
        a: "Ja. Ich baue so, dass Sie Texte, Bilder und Produkte selbst ändern können — und zeige Ihnen, wie.",
      },
      {
        q: "Wie schnell ist die Website fertig?",
        a: "Eine Landingpage in 1–2 Wochen, ein Shop je nach Umfang in 2–6 Wochen.",
      },
    ],
    seoTitle: "Website erstellen lassen in Wien — schnell & modern",
    seoDescription:
      "Moderne Websites und Online-Shops für Wiener Betriebe: blitzschnell, mobiloptimiert, auf Anfragen fokussiert. Landingpages, Shopify, Konfiguratoren.",
  },
  {
    slug: "content-marketing",
    name: "Content & Virale Reels",
    color: "var(--c-violet)",
    icon: "video",
    teaser:
      "Ich komme mit Profi-Licht in Ihren Betrieb, drehe Reels und führe Ihren Instagram-Kanal — komplett.",
    description:
      "Content-Strategie, Drehtag vor Ort mit professionellem Equipment, Schnitt, Untertitel und Posting-Plan. Ihr Kanal lebt — ohne dass Sie sich darum kümmern müssen.",
    h1: "Content, den Ihre Kunden wirklich sehen.",
    sub: "Ich komme mit professionellem Licht und Kamera in Ihren Betrieb, drehe Reels und führe Ihren Instagram-Kanal — Strategie, Dreh, Schnitt, Posting.",
    pains: [
      {
        title: "„Man müsste was mit Social Media machen…“",
        text: "Sie wissen es — aber zwischen Kunden, Bestellungen und Alltag bleibt keine Zeit dafür.",
      },
      {
        title: "Selbst gedrehte Videos wirken nicht",
        text: "Schlechtes Licht, wackeliges Bild, kein Konzept — und das Video bekommt 40 Views.",
      },
      {
        title: "Der Kanal ist seit Monaten still",
        text: "Ein toter Instagram-Account schadet mehr, als gar keiner — er signalisiert Stillstand.",
      },
    ],
    deliverables: [
      {
        title: "Content-Strategie",
        text: "Welche Formate funktionieren für Ihr Handwerk oder Ihre Gastronomie — geplant statt geraten.",
      },
      {
        title: "Drehtag bei Ihnen vor Ort",
        text: "Ich komme mit professionellem Licht und Ton in Ihren Betrieb. Ein Drehtag liefert Material für Wochen.",
      },
      {
        title: "Schnitt, Untertitel, virale Hooks",
        text: "Jedes Reel bekommt einen Hook in den ersten 2 Sekunden, sauberen Schnitt und Untertitel.",
      },
      {
        title: "Posting & Community",
        text: "Posting-Plan, Veröffentlichung, Antworten auf Kommentare und Nachrichten — auf Wunsch mit KI-Assistent.",
      },
    ],
    miniCase: {
      title: "Messerschmiede Nagl auf Instagram",
      text: "Virale Reels aus der Werkstatt: Funken, Handwerk, echte Geschichten — gedreht mit Profi-Equipment vor Ort.",
      projectSlug: "nagl",
      metrics: [
        { value: 90, suffix: "+", label: "Reel-Ideen im Drehbuch" },
        { value: 9, label: "Rubriken entwickelt" },
        { value: 0, text: "vor Ort", label: "Dreh in der Werkstatt" },
      ],
    },
    faqs: [
      {
        q: "Muss ich selbst vor die Kamera?",
        a: "Es hilft — Menschen folgen Menschen. Aber ich mache es Ihnen leicht: kurze Takes, klare Anweisungen, kein Text zum Auswendiglernen. Nach dem ersten Drehtag ist die Scheu weg.",
      },
      {
        q: "Wie oft wird gepostet?",
        a: "Je nach Paket 2–5 Reels pro Woche. Wichtiger als Menge ist Konstanz — ein lebendiger Kanal schlägt jeden Einmal-Effekt.",
      },
      {
        q: "Was bringt mir das konkret?",
        a: "Sichtbarkeit bei lokalen Kunden, Vertrauen vor dem ersten Kontakt und Material, das auch in der Werbung funktioniert. Reels sind die günstigste Reichweite, die es 2026 gibt.",
      },
    ],
    seoTitle: "Reels & Content-Marketing für Betriebe in Wien",
    seoDescription:
      "Virale Reels und Instagram-Betreuung für Wiener Betriebe: Drehtag vor Ort mit Profi-Licht, Schnitt, Posting-Plan. Komplett aus einer Hand.",
  },
  {
    slug: "meta-ads",
    name: "Werbung auf Facebook & Instagram",
    color: "var(--c-amber)",
    icon: "megaphone",
    teaser:
      "Meta-Kampagnen mit Click-to-Messenger: Der Interessent klickt — und der KI-Assistent übernimmt sofort.",
    description:
      "Zielgruppen, Kreative aus echtem Content, Click-to-Messenger-Kampagnen und sauberes Tracking. Auch Google Ads und TikTok — je nachdem, wo Ihre Kunden sind.",
    h1: "Werbung, die direkt in Bestellungen mündet.",
    sub: "Meta-Kampagnen mit Click-to-Messenger: Der Interessent klickt auf die Anzeige — und mein KI-Assistent übernimmt sofort das Gespräch. Keine verlorenen Leads.",
    pains: [
      {
        title: "„Boosten“ hat nichts gebracht",
        text: "Geld weg, ein paar Likes, keine einzige Bestellung — der Klassiker ohne Strategie.",
      },
      {
        title: "Agenturen sind zu teuer",
        text: "Monatsbudgets, die sich ein KMU nicht leisten kann — plus Setup-Gebühren und lange Verträge.",
      },
      {
        title: "Keine Ahnung, was die Werbung bringt",
        text: "Ohne Pixel und Tracking ist jede Kampagne ein Blindflug.",
      },
    ],
    deliverables: [
      {
        title: "Strategie & Zielgruppen",
        text: "Wien, Umgebung oder ganz Österreich — nach Sprache, Interessen und Verhalten. Kein Streuverlust.",
      },
      {
        title: "Kreative aus echtem Content",
        text: "Die Reels aus Ihrem Betrieb werden zu Anzeigen — authentisch schlägt Stock-Foto.",
      },
      {
        title: "Click-to-Messenger + KI-Assistent",
        text: "Der Interessent landet nicht auf einer toten Seite, sondern im Gespräch — und der Assistent qualifiziert ihn sofort.",
      },
      {
        title: "Pixel, Tracking, Reporting",
        text: "Sie sehen schwarz auf weiß, was jede Kampagne kostet und bringt.",
      },
      {
        title: "Auch Google Ads & TikTok",
        text: "Wo Ihre Kunden suchen, wird geworben — Google für aktive Suche, TikTok für junge Zielgruppen.",
      },
    ],
    miniCase: {
      title: "Kampagnen für Wiener Betriebe",
      text: "Messerschmiede Nagl, BlinHaus und Rubberik — laufende Kampagnen auf Meta, Google und TikTok.",
      projectSlug: "blinhaus",
      metrics: [
        { value: 3, label: "Betriebe mit laufenden Kampagnen" },
        { value: 3, label: "Plattformen: Meta, Google, TikTok" },
        { value: 0, text: "Bot", label: "übernimmt jeden Klick sofort" },
      ],
    },
    faqs: [
      {
        q: "Mit welchem Budget muss ich rechnen?",
        a: "Werbebudget ab etwa €10–20 pro Tag ist für lokale Betriebe ein sinnvoller Start. Die genaue Empfehlung hängt von Ziel und Branche ab — das rechnen wir in der Beratung gemeinsam durch.",
      },
      {
        q: "Wie schnell sehe ich Ergebnisse?",
        a: "Erste Daten nach wenigen Tagen, belastbare Ergebnisse nach 2–4 Wochen Optimierung.",
      },
      {
        q: "Was ist Click-to-Messenger?",
        a: "Eine Anzeige, die statt auf eine Website direkt in den Messenger-Chat führt. Dort übernimmt der KI-Assistent: beantwortet Fragen, nimmt die Bestellung auf. Kein Formular, keine Hürde.",
      },
    ],
    seoTitle: "Facebook & Instagram Werbung für Betriebe in Wien",
    seoDescription:
      "Meta Ads mit Click-to-Messenger für Wiener KMU: Anzeige klicken, KI-Assistent übernimmt das Gespräch. Strategie, Kreative, Tracking — aus einer Hand.",
  },
  {
    slug: "geo-ai-sichtbarkeit",
    name: "GEO: Sichtbar in ChatGPT & Co.",
    color: "var(--c-rose)",
    icon: "sparkles",
    teaser:
      "Immer mehr Kunden fragen KI statt Google. Ich sorge dafür, dass ChatGPT Ihren Betrieb kennt und empfiehlt.",
    description:
      "GEO (Generative Engine Optimization): strukturierte Daten, llms.txt und Inhalte, die KI-Assistenten zitieren können. Diese Website ist selbst der Beweis.",
    h1: "Wenn jemand ChatGPT fragt — wird Ihr Betrieb empfohlen?",
    sub: "Immer mehr Kunden suchen nicht mehr bei Google, sondern fragen KI. GEO (Generative Engine Optimization) sorgt dafür, dass KI-Assistenten Ihren Betrieb kennen und empfehlen.",
    pains: [
      {
        title: "ChatGPT kennt Sie nicht",
        text: "Kunden fragen nach dem „besten Betrieb in Wien“ — und Ihr Name kommt nicht vor.",
      },
      {
        title: "Ihre Website ist für KI unsichtbar",
        text: "KI-Crawler lesen anders als Google. Was für sie unlesbar ist, existiert nicht.",
      },
      {
        title: "SEO allein reicht nicht mehr",
        text: "2026 beginnt ein wachsender Teil der Kaufentscheidungen in einem KI-Chat — nicht in einer Suchmaschine.",
      },
    ],
    deliverables: [
      {
        title: "GEO-Audit",
        text: "Wie sichtbar ist Ihr Betrieb heute in ChatGPT, Perplexity und Google AI? Ich messe es — mit konkreten Anfragen echter Kunden.",
      },
      {
        title: "Strukturierte Daten",
        text: "JSON-LD, Schema.org, saubere Metadaten — damit Maschinen verstehen, wer Sie sind und was Sie anbieten.",
      },
      {
        title: "llms.txt & KI-lesbare Inhalte",
        text: "Inhalte, die KI-Assistenten zitieren können: klare Antworten, FAQ, Fakten statt Marketing-Floskeln.",
      },
      {
        title: "Monitoring",
        text: "Regelmäßige Checks: Wird Ihr Betrieb empfohlen? Bei welchen Fragen? Mit welcher Beschreibung?",
      },
    ],
    miniCase: {
      title: "Diese Website ist der Beweis",
      text: "gorbenko.at ist selbst nach GEO-Prinzipien gebaut: sitemap, llms.txt, strukturierte Daten, FAQ auf jeder Seite. Fragen Sie ChatGPT nach einer KI-Agentur in Wien.",
      projectSlug: "nagl",
      metrics: [
        { value: 0, text: "llms.txt", label: "für KI-Crawler" },
        { value: 0, text: "JSON-LD", label: "auf jeder Seite" },
        { value: 0, text: "FAQ", label: "in KI-zitierbarer Form" },
      ],
    },
    faqs: [
      {
        q: "Was ist der Unterschied zwischen SEO und GEO?",
        a: "SEO optimiert für Suchmaschinen-Rankings (Liste mit 10 Links). GEO optimiert dafür, dass KI-Assistenten wie ChatGPT Ihren Betrieb in ihrer Antwort direkt empfehlen. Die Techniken überschneiden sich, aber GEO braucht zusätzlich KI-lesbare Strukturen und zitierbare Inhalte.",
      },
      {
        q: "Funktioniert das wirklich schon?",
        a: "Ja. KI-Assistenten beantworten heute Millionen von „Wo finde ich…“-Fragen pro Tag. Wer dort nicht vorkommt, verliert diese Kunden — meist ohne es zu merken.",
      },
      {
        q: "Wie lange dauert es, bis man Ergebnisse sieht?",
        a: "Technische Grundlagen wirken innerhalb von Wochen, inhaltlicher Aufbau über 2–3 Monate. GEO ist ein Vorsprung, den sich früh sichert, wer zuerst startet.",
      },
    ],
    seoTitle: "GEO Agentur — sichtbar in ChatGPT, Perplexity & Google AI",
    seoDescription:
      "Generative Engine Optimization für Betriebe in Wien: Damit ChatGPT & Co. Ihren Betrieb empfehlen. GEO-Audit, strukturierte Daten, llms.txt, Monitoring.",
  },
  {
    slug: "digitalisierung",
    name: "Digitalisierung & Dashboards",
    color: "var(--c-lime)",
    icon: "chart",
    teaser:
      "Finanzmodelle, Live-Dashboards und automatisierte Berichte statt Zettelwirtschaft.",
    description:
      "Ich schaue mir Ihren Betrieb an, finde, was sich automatisieren lässt, und baue Dashboards, mit denen Sie Ihre Zahlen endlich auf einen Blick sehen.",
    h1: "Ihre Zahlen. Endlich auf einen Blick.",
    sub: "Finanzmodelle, Live-Dashboards und automatisierte Berichte statt Zettelwirtschaft. Ich digitalisiere Ihre Abläufe — von der Bestellung bis zur Auswertung.",
    pains: [
      {
        title: "Zahlen in Heften und Excel-Listen verstreut",
        text: "Kassa im Heft, Lieferungen im Chat, Ausgaben im Kopf — niemand sieht das Ganze.",
      },
      {
        title: "Sie wissen nicht, was sich wirklich lohnt",
        text: "Welches Produkt bringt Marge? Welcher Kanal bringt Kunden? Ohne Daten bleibt es Bauchgefühl.",
      },
      {
        title: "Prozesse hängen an einer Person",
        text: "Wenn der eine Mitarbeiter ausfällt, der alles im Kopf hat, steht der Betrieb.",
      },
    ],
    deliverables: [
      {
        title: "Finanzmodell & Unit Economics",
        text: "Was kostet ein Produkt wirklich, was bleibt übrig — durchgerechnet und interaktiv.",
      },
      {
        title: "Live-Dashboards",
        text: "Umsatz, Bestellungen, Kanäle — täglich aktuell, vom Handy abrufbar.",
      },
      {
        title: "Prozess-Analyse vor Ort",
        text: "Ich schaue mir Ihren Betrieb an und finde, was sich automatisieren lässt — konkret, nicht theoretisch.",
      },
      {
        title: "Schulung Ihres Teams",
        text: "Damit Sie die Werkzeuge selbst bedienen können — ohne Angst vor der Technik.",
      },
    ],
    miniCase: {
      title: "BlinHaus Vienna",
      text: "Finanzmodell, digitalisierte Lieferprozesse und automatische Berichte für ein Wiener Café mit Lieferservice.",
      projectSlug: "blinhaus",
      metrics: [
        { value: 3, label: "Vertriebskanäle ausgewertet" },
        { value: 0, text: "Live", label: "Finanzmodell & Reports" },
        { value: 0, text: "0 Hefte", label: "alles digital erfasst" },
      ],
    },
    faqs: [
      {
        q: "Mein Betrieb ist klein — lohnt sich das überhaupt?",
        a: "Gerade dann. Kleine Betriebe haben keine Controlling-Abteilung — ein einfaches Dashboard ersetzt sie. Oft reichen ein paar Tage Aufbau, um jahrelange Blindflüge zu beenden.",
      },
      {
        q: "Brauche ich dafür neue Software?",
        a: "Meist nicht. Ich baue auf dem auf, was Sie haben — Kassa, Excel, Lieferdienst-Portale — und verbinde es zu einem Gesamtbild.",
      },
      {
        q: "Kann ich das danach selbst bedienen?",
        a: "Ja, das ist das Ziel. Ich baue verständlich, dokumentiere alles und schule Sie und Ihr Team.",
      },
    ],
    seoTitle: "Digitalisierung & Dashboards für KMU in Wien",
    seoDescription:
      "Digitalisierung für Wiener Betriebe: Finanzmodelle, Live-Dashboards, automatisierte Berichte. Ihre Zahlen auf einen Blick — verständlich und bedienbar.",
  },
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: "nagl",
    client: "Messerschmiede Stefan Nagl",
    branch: "Handwerk · Messerschmiede",
    location: "Wien 1140",
    tags: ["Website", "KI-Chatbot", "Content & Reels", "Werbung"],
    liveUrl: "https://custom.nagl-messer.at",
    liveLabel: "custom.nagl-messer.at",
    teaser:
      "Eine traditionsreiche Wiener Messerschmiede wird digital: Landingpage, KI-Assistent, virale Reels und Werbung — alles aus einer Hand.",
    headline: "Vom Handwerksbetrieb zum digitalen Auftritt",
    situation:
      "Die Messerschmiede Nagl besteht seit über 40 Jahren, der Werkstattstandort hat eine über 150-jährige Handwerksgeschichte. Das Handwerk ist erstklassig — aber digital war der Betrieb kaum sichtbar. Das Geschäft mit handgefertigten Custom-Messern brauchte einen eigenen, modernen Auftritt.",
    steps: [
      {
        title: "Landingpage für Custom-Messer",
        text: "Video-Hero mit Funkenflug aus der Werkstatt, Testimonials von Wiener Köchen, FAQ und WhatsApp-Direktkontakt — blitzschnell geladen, auf ein Ziel fokussiert: die kostenlose Beratung.",
      },
      {
        title: "KI-Assistent",
        text: "Beantwortet Anfragen zu Stahlsorten, Preisklassen und Lieferung — und nimmt Anfragen auf, auch wenn Stefan am Schmiedefeuer steht.",
      },
      {
        title: "Instagram & virale Reels",
        text: "Drehtage mit professionellem Licht direkt in der Werkstatt: Funken, Handwerk, echte Geschichten. Drehbuch mit über 90 Reel-Ideen in 9 Rubriken.",
      },
      {
        title: "Google Ads & Meta-Kampagnen",
        text: "Kampagnen für aktive Suche (Google) und Entdeckung (Instagram/Facebook), mit sauberem Conversion-Tracking.",
      },
    ],
    metrics: [
      { value: 9, suffix: "+", label: "Video-Clips & Interview produziert" },
      { value: 90, suffix: "+", label: "Reel-Ideen im Drehbuch" },
      { value: 40, suffix: "+", label: "Jahre Handwerkstradition, digital sichtbar gemacht" },
    ],
    quote: {
      text: "Andrii hat aus meiner Werkstatt einen digitalen Betrieb gemacht — Website, Videos, Werbung. Ich schmiede, er kümmert sich um den Rest.",
      author: "Stefan Nagl",
      role: "Messerschmied, Wien",
    },
    screenshots: {
      desktop: "/portfolio/nagl/desktop.webp",
      mobile: "/portfolio/nagl/mobile.webp",
    },
    featured: true,
    seoDescription:
      "Case Study: Wiener Messerschmiede digital — Landingpage, KI-Assistent, virale Reels und Werbekampagnen für Messerschmiede Stefan Nagl.",
  },
  {
    slug: "blinhaus",
    client: "BlinHaus Vienna",
    branch: "Gastronomie · Café & Lieferservice",
    location: "Wien",
    tags: ["KI-Chatbot", "Content & Reels", "Werbung", "Digitalisierung"],
    teaser:
      "Ein Wiener Café nimmt Bestellungen vollautomatisch über Instagram und Facebook entgegen — und kennt endlich seine Zahlen.",
    headline: "€3.000 Mehrumsatz in 15 Tagen",
    situation:
      "BlinHaus erhielt täglich dutzende Nachrichten über Instagram und Facebook — Bestellungen, Fragen zur Speisekarte, Lieferzeiten. Der Inhaber konnte nicht rund um die Uhr antworten. Verlorene Bestellungen, frustrierte Kunden — und die Geschäftszahlen verteilten sich auf Hefte und Chats.",
    steps: [
      {
        title: "KI-Assistent auf Instagram & Facebook",
        text: "Kennt die Speisekarte, nimmt Bestellungen auf, berechnet Preise und benachrichtigt den Inhaber sofort — 24/7.",
      },
      {
        title: "Content-Marketing",
        text: "Regelmäßige Reels und Posts, die das Produkt zeigen und Bestellungen auslösen.",
      },
      {
        title: "Meta-Kampagnen",
        text: "Click-to-Messenger-Werbung: Der Interessent klickt auf die Anzeige und bestellt direkt im Chat.",
      },
      {
        title: "Digitalisierung der Lieferprozesse",
        text: "Bestellwege, Kassa-Auswertung und ein interaktives Finanzmodell: alle Kanäle und Margen auf einen Blick.",
      },
    ],
    metrics: [
      { value: 3000, prefix: "€", label: "Mehrumsatz in 15 Tagen" },
      { value: 95, suffix: " %", label: "der Anfragen automatisch beantwortet" },
      { value: 10, prefix: "<", suffix: " s", label: "Antwortzeit" },
      { value: 0, text: "24/7", label: "erreichbar" },
    ],
    quote: {
      text: "Der Assistent beantwortet Kundenanfragen sofort und nimmt Bestellungen auf — auch nachts und am Wochenende. Wir haben dadurch deutlich mehr Bestellungen erhalten.",
      author: "Anatoly",
      role: "Inhaber, BlinHaus Vienna",
    },
    screenshots: {},
    featured: true,
    seoDescription:
      "Case Study: Wiener Café automatisiert Bestellannahme mit KI-Chatbot — €3.000 Mehrumsatz in 15 Tagen, 95 % automatisch beantwortet.",
  },
  {
    slug: "rubberik",
    client: "Rubberik",
    branch: "Mode · Maßanfertigung",
    location: "Wien",
    tags: ["Online-Shop", "Konfigurator", "Werbung"],
    liveUrl: "https://rubberik.at",
    liveLabel: "rubberik.at",
    teaser:
      "Ein Wiener Atelier für maßgefertigte Designer-Mode bekommt einen neuen Shop mit Produkt-Konfigurator: Material wählen, Maße erfassen, Preis live berechnet.",
    headline: "Online-Shop mit Maß-Konfigurator",
    situation:
      "Das Atelier fertigt Designer-Mode nach Maß — aber der alte Shop war technisch veraltet, langsam und konnte den wichtigsten Schritt nicht abbilden: die individuelle Konfiguration. Jede Bestellung brauchte manuelle Abstimmung per E-Mail.",
    steps: [
      {
        title: "Neuer Shop mit moderner Architektur",
        text: "Headless-Aufbau (Medusa + Next.js): blitzschnell, flexibel und bereit für den europäischen Markt.",
      },
      {
        title: "Produkt-Konfigurator",
        text: "Material und Farbe wählen, Maße online erfassen, Preis wird live berechnet — der komplette Bestellprozess ohne E-Mail-Pingpong.",
      },
      {
        title: "Meta-Kampagnen",
        text: "Laufende Werbung auf Instagram und Facebook für den DACH-Raum.",
      },
    ],
    metrics: [
      { value: 0, text: "Live", label: "Preisberechnung im Konfigurator" },
      { value: 0, text: "Maße", label: "online erfasst statt per E-Mail" },
      { value: 0, text: "Headless", label: "Medusa + Next.js Architektur" },
    ],
    screenshots: {},
    badge: "Launch in Kürze",
    featured: true,
    seoDescription:
      "Case Study: Neuer Online-Shop mit Produkt-Konfigurator für ein Wiener Mode-Atelier — Materialwahl, Maßerfassung, Live-Preisberechnung.",
  },
  {
    slug: "gbike",
    client: "G-Bike Wien",
    branch: "Handel · E-Mobilität",
    location: "Staglgasse 12, 1150 Wien",
    tags: ["Online-Shop", "TikTok"],
    liveUrl: "https://gbikewien.at",
    liveLabel: "gbikewien.at",
    teaser:
      "E-Scooter-Store in Wien: Shopify-Shop mit komplettem Katalog und Bestellfunktion, plus Einstieg auf TikTok.",
    headline: "Shopify-Shop für E-Scooter",
    situation:
      "G-Bike verkauft E-Scooter und E-Bikes im Geschäft in Wien 1150 — aber online war der Betrieb nicht präsent. Kunden konnten weder das Sortiment sehen noch Preise vergleichen.",
    steps: [
      {
        title: "Shopify-Shop",
        text: "Kompletter Katalog mit Produkten, Varianten und Bestellfunktion — schnell live, einfach zu pflegen.",
      },
      {
        title: "TikTok-Kanal",
        text: "Einstieg auf TikTok: kurze Produkt-Videos für eine junge, urbane Zielgruppe.",
      },
    ],
    metrics: [
      { value: 8, suffix: "+", label: "Produkte online" },
      { value: 0, text: "TikTok", label: "Kanal eingeführt" },
      { value: 0, text: "Shopify", label: "einfach selbst zu pflegen" },
    ],
    screenshots: {
      desktop: "/portfolio/gbike/desktop.webp",
      mobile: "/portfolio/gbike/mobile.webp",
    },
    seoDescription:
      "Case Study: Shopify-Online-Shop für G-Bike Wien — E-Scooter-Katalog, Bestellfunktion und TikTok-Einstieg für den Store in Wien 1150.",
  },
  {
    slug: "zum-eisbaeren",
    client: "Zum Eisbären",
    branch: "Handel · Parfümerie & Kosmetik",
    location: "Hietzinger Hauptstraße 72, 1130 Wien",
    tags: ["Online-Shop"],
    liveUrl: "https://zum-eisbaeren.at",
    liveLabel: "zum-eisbaeren.at",
    teaser:
      "Eine Wiener Parfümerie mit über 50 Jahren Tradition geht online: Shopify-Shop mit Sortiment, Events, Newsletter und Magazin.",
    headline: "Traditionsbetrieb, digital erweitert",
    situation:
      "Zum Eisbären berät seine Kundinnen und Kunden seit über 50 Jahren persönlich in Hietzing. Das Sortiment — Guerlain, Shiseido, Clarins und mehr — war offline stark, online aber unsichtbar. Events und Aktionen erreichten nur, wer zufällig vorbeikam.",
    steps: [
      {
        title: "Shopify-Shop",
        text: "Das komplette Sortiment online: Parfum, Pflege, Make-up — mit Bestellfunktion und Produktpflege durch das Team selbst.",
      },
      {
        title: "Events & Aktionen online",
        text: "Beauty-Workshops, Beratungstage und Monatsangebote — sichtbar für alle Kundinnen, nicht nur für Laufkundschaft.",
      },
      {
        title: "Newsletter & Magazin",
        text: "Digitale Kundenbindung für einen Betrieb, der von persönlicher Beratung lebt.",
      },
    ],
    metrics: [
      { value: 50, suffix: "+", label: "Jahre Tradition, jetzt online" },
      { value: 0, text: "Events", label: "digital buchbar & sichtbar" },
      { value: 0, text: "Shopify", label: "vom Team selbst pflegbar" },
    ],
    screenshots: {
      desktop: "/portfolio/zum-eisbaeren/desktop.webp",
      mobile: "/portfolio/zum-eisbaeren/mobile.webp",
    },
    seoDescription:
      "Case Study: Shopify-Shop für die Wiener Parfümerie Zum Eisbären — 50 Jahre Tradition, jetzt mit Online-Sortiment, Events und Newsletter.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
