import type { Metadata } from "next";
import { biMarktConfigured } from "../../lib/bi-markt-auth";

export const metadata: Metadata = {
  title: "BI-рынок DACH · Gorbenko",
  robots: { index: false, follow: false },
};

export default async function BiMarktLogin({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/bi-markt";
  const hasError = params.error === "1";
  const configured = biMarktConfigured();

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        method="POST"
        action="/api/bi-markt-auth"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#141414",
          border: "1px solid #222",
          borderRadius: 16,
          padding: "36px 32px",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#0d2b1f",
            border: "1px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          📊
        </div>

        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#34d399",
            margin: "0 0 6px",
          }}
        >
          Gorbenko · закрытый материал
        </p>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#f5f5f5",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          BI-рынок DACH
        </h1>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 28px" }}>
          Исследование рынка среднего бизнеса · доступ по отдельному паролю
        </p>

        {!configured ? (
          <p
            style={{
              fontSize: 13,
              color: "#fbbf24",
              background: "#1c1200",
              border: "1px solid #451a00",
              borderRadius: 10,
              padding: "12px 14px",
              lineHeight: 1.6,
            }}
          >
            Пароль страницы не настроен на этом окружении. Задай переменную
            BI_MARKT_PASSWORD в Vercel → Settings → Environment Variables и передеплой.
          </p>
        ) : (
          <>
            <input type="hidden" name="next" value={next} />
            <input
              type="password"
              name="password"
              autoFocus
              required
              placeholder="пароль страницы"
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
              <p style={{ color: "#e05252", fontSize: 13, margin: "8px 0 0" }}>Неверный пароль</p>
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
                background: "#34d399",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Открыть
            </button>
          </>
        )}
      </form>
    </main>
  );
}
