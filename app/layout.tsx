import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

const GTM_ID = "GTM-KX7PQ7LP";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gorbenko.at"),
  title: {
    default: "Gorbenko — KI-Automatisierung & Marketing für Betriebe in Wien",
    template: "%s — Gorbenko | KI & Marketing Wien",
  },
  description:
    "Websites, KI-Chatbots, Content und Werbung für Wiener Betriebe — alles aus einer Hand. Kostenlose Beratung: online oder direkt bei Ihnen im Betrieb.",
  keywords: [
    "KI Agentur Wien",
    "KI Chatbot für Unternehmen",
    "Website erstellen lassen Wien",
    "Social Media Agentur Wien",
    "Facebook Instagram Werbung Wien",
    "GEO Agentur",
    "Digitalisierung KMU",
    "Automatisierung",
  ],
  openGraph: {
    title: "Gorbenko — KI-Automatisierung & Marketing für Betriebe in Wien",
    description:
      "Websites, KI-Chatbots, Content und Werbung für Wiener Betriebe — alles aus einer Hand. Kostenlose Beratung.",
    locale: "de_AT",
    type: "website",
    siteName: "Gorbenko",
    url: "https://gorbenko.at",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Gorbenko — KI-Automatisierung & Marketing",
  url: "https://gorbenko.at",
  description:
    "KI-Chatbots, Websites, Content, Werbung, GEO und Digitalisierung für kleine und mittlere Betriebe in Wien.",
  areaServed: { "@type": "City", name: "Wien" },
  address: { "@type": "PostalAddress", addressLocality: "Wien", addressCountry: "AT" },
  telephone: "+436765920259",
  email: "gorbenkomagic@gmail.com",
  founder: {
    "@type": "Person",
    name: "Andrii Gorbenko",
    jobTitle: "KI- & Marketing-Spezialist",
    sameAs: [
      "https://www.instagram.com/andrii_gorbenko/",
      "https://www.instagram.com/ki.mit.andrii/",
    ],
  },
  knowsLanguage: ["de", "en", "ru", "uk"],
  priceRange: "Kostenlose Erstberatung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        <CookieConsent />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        {/* Consent Mode v2 defaults — must run before GTM */}
        <Script id="consent-defaults" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 2000
          });
        `}</Script>

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      </body>
    </html>
  );
}
