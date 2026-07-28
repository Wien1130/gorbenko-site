import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отчёты — Gorbenko",
  robots: { index: false, follow: false },
};

export default async function ReportsLogin({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/reports/blinhaus-june-2026";
  const hasError = params.error === "1";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf9f7",
        padding: 24,
      }}
    >
      <form
        method="POST"
        action="/api/reports-auth"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          border: "1px solid #e7e5e4",
          borderRadius: 14,
          padding: "32px 28px",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#c75b39",
            margin: 0,
          }}
        >
          Gorbenko · отчёты
        </p>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: "8px 0 6px",
            color: "#1c1917",
          }}
        >
          Закрытый раздел
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px" }}>
          Введите пароль, чтобы открыть отчёт.
        </p>

        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="Пароль"
          style={{
            width: "100%",
            padding: "11px 14px",
            fontSize: 15,
            border: hasError ? "1.5px solid #c0392b" : "1px solid #d6d3d1",
            borderRadius: 9,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {hasError && (
          <p style={{ color: "#c0392b", fontSize: 13, margin: "8px 0 0" }}>
            Неверный пароль, попробуйте ещё раз.
          </p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 14,
            padding: "11px 14px",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            background: "#1c1917",
            border: "none",
            borderRadius: 9,
            cursor: "pointer",
          }}
        >
          Открыть отчёт
        </button>
      </form>
    </main>
  );
}
