import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isClientSlug, kundenNext, kundenPassword } from "../../../lib/kunden-auth";

export const metadata: Metadata = {
  title: "Kundenbereich",
  robots: { index: false, follow: false },
};

export default async function KundenLogin({
  params,
  searchParams,
}: {
  params: Promise<{ client: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { client } = await params;
  if (!isClientSlug(client)) notFound();
  if (client === "demo") redirect("/kunden/demo");

  const query = await searchParams;
  const hasError = query.error === "1";
  const next = kundenNext(client, query.next ?? "");

  if (!kundenPassword(client)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 text-[#f5f5f5]">
        <p className="max-w-sm text-center text-sm text-[#9ca3af]">Seite noch nicht freigeschaltet.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 py-16 text-[#f5f5f5]">
      <form
        method="POST"
        action="/api/kunden-auth"
        className="w-full max-w-[380px] rounded-2xl border border-[#2a2a2a] bg-[#141414] px-8 py-9"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00d4aa]">
          Kundenbereich · Gorbenko Werbeagentur
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Werbe-Auswertung</h1>
        <p className="mt-1 mb-7 text-sm text-[#8a8a8a]">Zugang nur mit dem Passwort für diesen Betrieb.</p>

        <input type="hidden" name="client" value={client} />
        <input type="hidden" name="next" value={next} />

        <label htmlFor="password" className="mb-2 block text-sm text-[#cfcfcf]">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoFocus
          required
          autoComplete="current-password"
          className={`w-full rounded-[10px] bg-[#1e1e1e] px-4 py-3 text-[15px] text-[#f5f5f5] outline-none ${
            hasError ? "border-[1.5px] border-[#c0392b]" : "border border-[#2a2a2a]"
          }`}
        />
        {hasError && <p className="mt-2 text-[13px] text-[#e05252]">Das Passwort stimmt nicht.</p>}

        <button
          type="submit"
          className="mt-3.5 w-full cursor-pointer rounded-[10px] bg-[#00d4aa] px-4 py-3 text-[15px] font-semibold text-[#04150d]"
        >
          Öffnen
        </button>
      </form>
    </main>
  );
}
