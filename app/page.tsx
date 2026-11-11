import type { Metadata } from "next";
import { headers } from "next/headers";
import ClassicHome from "./components/home/ClassicHome";
import StudioHome from "./components/home/StudioHome";
import ClassicShell from "./components/studio/ClassicShell";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const klassisch = h.get("x-site-variant") === "klassisch";
  return {
    title: {
      absolute: "Gorbenko — Websites, Shops und Kampagnen aus Wien",
    },
    description:
      "Websites, Shops und Apps. Content und Kampagnen. Von der ersten Idee bis zur nächsten Anfrage. Andrii Gorbenko, Wien.",
    ...(klassisch ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Home() {
  const h = await headers();
  if (h.get("x-site-variant") === "klassisch") {
    return (
      <ClassicShell>
        <ClassicHome />
      </ClassicShell>
    );
  }
  return <StudioHome />;
}
