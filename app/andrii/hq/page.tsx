import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";
import HqClient from "./HqClient";

export const metadata = {
  title: "Штаб",
  robots: { index: false, follow: false },
};

export default async function AndriiHq() {
  await requireAndriiAuth("/andrii/hq");

  return (
    <AndriiShell>
      <div className="page-label">Личная система</div>
      <h1 className="page-title">Штаб Андрея</h1>
      <p className="page-sub">
        Один экран правды: деньги · клиенты · ритуалы · цели · принципы. Варианты, не фиксация.
      </p>
      <HqClient />
    </AndriiShell>
  );
}
