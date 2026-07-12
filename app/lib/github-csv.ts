const GITHUB_REPO = process.env.COLD_LEADS_GITHUB_REPO ?? "Wien1130/entrepreneur-os";

function githubHeaders() {
  const token = process.env.COLD_LEADS_GITHUB_TOKEN;
  return token
    ? { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }
    : null;
}

/** Читает произвольный CSV из приватного репо (server-side, токен не уходит на клиент). */
export async function fetchCsv<T>(path: string): Promise<T[]> {
  const headers = githubHeaders();
  if (!headers) return [];

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
    cache: "no-store",
  });
  if (!res.ok) return [];

  const text = await res.text();
  if (!text.trim()) return [];

  const [headerLine, ...lines] = text.trim().split("\n");
  const cols = headerLine.split(",");
  return lines
    .filter((l) => l.trim())
    .map((line) => {
      const cells = parseCsvLine(line);
      const row: Record<string, string> = {};
      cols.forEach((c, i) => {
        row[c] = cells[i] ?? "";
      });
      return row as T;
    });
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

function csvEscape(value: string): string {
  const v = (value ?? "").replace(/\r?\n/g, " ").trim();
  return /[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Дописывает строку в CSV в приватном репо, создавая файл с заголовком, если его нет. */
export async function appendCsvRow(path: string, header: string[], row: Record<string, string>): Promise<boolean> {
  const headers = githubHeaders();
  if (!headers) return false;

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;
  let existingContent = header.join(",") + "\n";
  let sha: string | undefined;

  const getRes = await fetch(url, { headers, cache: "no-store" });
  if (getRes.ok) {
    const json = await getRes.json();
    sha = json.sha;
    existingContent = Buffer.from(json.content, "base64").toString("utf-8");
    if (!existingContent.endsWith("\n")) existingContent += "\n";
  }

  const line = header.map((h) => csvEscape(row[h] ?? "")).join(",");
  const newContent = existingContent + line + "\n";

  const putRes = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `append ${path}`,
      content: Buffer.from(newContent, "utf-8").toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  return putRes.ok;
}
