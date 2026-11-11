import { headers } from "next/headers";
import { Manrope } from "next/font/google";
import type { Metadata } from "next";
import ClassicShell from "./ClassicShell";
import StudioChrome from "./StudioChrome";
import "../../studio-home.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-studio",
});

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  if (h.get("x-site-variant") === "klassisch") {
    return { robots: { index: false, follow: false } };
  }
  return {};
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  if (h.get("x-site-variant") === "klassisch") {
    return <ClassicShell>{children}</ClassicShell>;
  }
  return (
    <div className={`${manrope.variable} studio-root`}>
      <StudioChrome>{children}</StudioChrome>
    </div>
  );
}
