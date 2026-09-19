import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anton · Gorbenko",
  robots: { index: false, follow: false },
};

export default async function AntonLogin({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/anton";
  const hasError = params.error === "1";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0e13",
        padding: 24,
      }}
    >
      <form
        method="POST"
        action="/api/anton-auth"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#161b26",
          border: "1px solid #242c3c",
          borderRadius: 16,
          padding: "36px 32px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#d4af6a",
            margin: "0 0 6px",
          }}
        >
          Gorbenko · закрытый раздел
        </p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#e8e6e1",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          Предложение для Антона
        </h1>
        <p style={{ fontSize: 14, color: "#9aa3b2", margin: "0 0 28px" }}>
          Время. Голова. Деньги.
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
            background: "#11151d",
            border: hasError ? "1.5px solid #f87171" : "1px solid #242c3c",
            color: "#e8e6e1",
            borderRadius: 10,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {hasError && (
          <p style={{ color: "#f87171", fontSize: 13, margin: "8px 0 0" }}>
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
            color: "#0b0e13",
            background: "#d4af6a",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Открыть
        </button>
      </form>
    </main>
  );
}
