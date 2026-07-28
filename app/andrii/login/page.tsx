import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Андрей · Gorbenko",
  robots: { index: false, follow: false },
};

export default async function AndriiLogin({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/andrii";
  const hasError = params.error === "1";

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0d0d0d",
      padding: 24,
    }}>
      <form
        method="POST"
        action="/api/andrii-auth"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#141414",
          border: "1px solid #222",
          borderRadius: 16,
          padding: "36px 32px",
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg, #0d2b1f 0%, #16213e 100%)",
          border: "1px solid #333",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, marginBottom: 20,
        }}>🎬</div>

        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: ".14em",
          textTransform: "uppercase", color: "#34d399",
          margin: "0 0 6px",
        }}>
          Gorbenko · закрытый раздел
        </p>
        <h1 style={{
          fontSize: 24, fontWeight: 800, color: "#f5f5f5",
          margin: "0 0 6px", lineHeight: 1.2,
        }}>
          DACH Million
        </h1>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 28px" }}>
          Стратегия · Банк reels DE · Идеи · Автопостинг
        </p>

        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="пароль"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 15,
            background: "#1e1e1e",
            border: hasError ? "1.5px solid #c0392b" : "1px solid #2a2a2a",
            color: "#f5f5f5",
            borderRadius: 10,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {hasError && (
          <p style={{ color: "#e05252", fontSize: 13, margin: "8px 0 0" }}>
            Неверный пароль
          </p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 14,
            padding: "12px 16px",
            fontSize: 15,
            fontWeight: 700,
            color: "#04150d",
            background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Войти
        </button>
      </form>
    </main>
  );
}
