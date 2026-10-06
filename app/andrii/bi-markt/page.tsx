import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

/** Материал переехал на отдельный URL со своим паролем. */
export default function AndriiBiMarktRedirect() {
  redirect("/bi-markt");
}
