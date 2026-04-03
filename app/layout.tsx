import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gorbenko — KI-Assistent für Ihr Unternehmen in Wien",
  description:
    "Ihr KI-Assistent antwortet Ihren Kunden 24/7 auf Facebook & Instagram. Bestellungen, Fragen, Leads — automatisch und in Ihrem Ton. Made in Wien.",
  keywords: [
    "KI Assistent",
    "Chatbot",
    "Facebook Messenger Bot",
    "Instagram Bot",
    "Wien",
    "Automatisierung",
    "AI",
    "Kundenservice",
  ],
  openGraph: {
    title: "Gorbenko — KI-Assistent für Ihr Unternehmen in Wien",
    description:
      "Ihr KI-Assistent antwortet Ihren Kunden 24/7 auf Facebook & Instagram.",
    locale: "de_AT",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
