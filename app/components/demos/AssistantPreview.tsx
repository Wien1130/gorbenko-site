type Msg = { from: "user" | "assistant"; text: string };

const PREVIEWS: Record<string, { name: string; initials: string; messages: Msg[] }> = {
  nagl: {
    initials: "SN",
    name: "Messerschmiede Nagl",
    messages: [
      { from: "user", text: "Hallo! Ich suche ein Küchenmesser als Geschenk. Liefern Sie auch nach Graz?" },
      {
        from: "assistant",
        text: "Gerne! Ja, wir liefern österreichweit. Für ein Geschenk empfehle ich ein handgeschmiedetes Küchenmesser — jedes Stück ein Unikat. Soll ich Ihnen einen Termin mit Stefan vorschlagen?",
      },
      { from: "user", text: "Ja, bitte — am liebsten Samstag." },
      {
        from: "assistant",
        text: "Samstag 10:00 ist frei. Ich habe die Anfrage an Stefan weitergeleitet, er meldet sich persönlich.",
      },
    ],
  },
  rubberik: {
    initials: "RK",
    name: "Rubberik",
    messages: [
      { from: "user", text: "Hallo! Kann ich ein Kleid in meiner Größe konfigurieren?" },
      {
        from: "assistant",
        text: "Ja. Sie wählen Farbe und Ausstattung — die Maße erfassen wir online, der Preis erscheint live. Soll ich den Konfigurator erklären?",
      },
      { from: "user", text: "Ja bitte. Liefern Sie nach Wien?" },
      {
        from: "assistant",
        text: "Ja, Lieferung in Wien ist möglich. Ich leite Ihre Anfrage an das Atelier weiter — Sie bekommen eine persönliche Antwort.",
      },
    ],
  },
};

export default function AssistantPreview({ id }: { id: "nagl" | "rubberik" }) {
  const preview = PREVIEWS[id];
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-3.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
          {preview.initials}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--card)] bg-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-medium">{preview.name}</p>
          <p className="text-xs text-[var(--accent)]">Digitaler Assistent · Instagram</p>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {preview.messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.from === "user"
                  ? "rounded-br-md bg-white/10"
                  : "rounded-bl-md border border-[var(--accent)]/15 bg-[var(--accent)]/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
