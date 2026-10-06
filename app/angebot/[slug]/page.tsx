import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAngebotClient, angebotSlugs } from "../../lib/angebot-clients";
import { isValidAngebotKey } from "../../lib/angebot-auth";
import LockedAngebot from "../LockedAngebot";
import AngebotView from "./AngebotView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Angebot",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return angebotSlugs().map((slug) => ({ slug }));
}

export default async function AngebotPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ k?: string; p?: string }>;
}) {
  const { slug } = await params;
  const { k, p } = await searchParams;
  const client = getAngebotClient(slug);
  if (!client) notFound();
  if (!isValidAngebotKey(k)) return <LockedAngebot />;

  return <AngebotView client={client} accessKey={k ?? ""} initialParam={p} />;
}
