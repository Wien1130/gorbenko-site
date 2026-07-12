import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM — Gorbenko",
  robots: { index: false, follow: false },
};

export default async function CrmLogin({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/crm";
  const hasError = params.error === "1";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d0d",
        padding: 24,
      }}
    >
      <form
        method="POST"
        action="/api/crm-auth"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#141414",
          border: "1px solid #222",
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
            color: "#7c6af0",
            margin: 0,
          }}
        >
          Gorbenko · закрытая CRM
        </p>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: "8px 0 6px",
            color: "#f0eefc",
          }}
        >
          Только для меня
        </h1>
        <p style={{ fontSize: 14, color: "#a09cc4", margin: "0 0 20px" }}>
          Здесь имена, контакты, адреса и заметки по лидам. Введи пароль.
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
            border: hasError ? "1.5px solid #f87171" : "1px solid #333",
            borderRadius: 9,
            outline: "none",
            boxSizing: "border-box",
            background: "#1a1a1a",
            color: "#f0eefc",
          }}
        />
        {hasError && (
          <p style={{ color: "#f87171", fontSize: 13, margin: "8px 0 0" }}>
            Неверный пароль, попробуй ещё раз.
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
            color: "#0d0d0d",
            background: "#7c6af0",
            border: "none",
            borderRadius: 9,
            cursor: "pointer",
          }}
        >
          Открыть CRM
        </button>
      </form>
    </main>
  );
}
