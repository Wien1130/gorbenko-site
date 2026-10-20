import { redirect } from "next/navigation";
import { requireAndriiAuth } from "../auth-check";

export const metadata = {
  title: "Дом мечты",
  robots: { index: false, follow: false },
};

export default async function AndriiDom() {
  await requireAndriiAuth("/andrii/dom");
  redirect("https://dream-house.gorbenko.at/teksty");
}
