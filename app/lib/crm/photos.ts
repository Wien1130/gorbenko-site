/** Загрузка фото захода в приватный GitHub-репо (тот же паттерн, что у старого бота). */

const GITHUB_REPO = process.env.COLD_LEADS_GITHUB_REPO ?? "Wien1130/entrepreneur-os";

export async function uploadPhoto(file: File): Promise<string> {
  const token = process.env.COLD_LEADS_GITHUB_TOKEN;
  if (!token) return "";

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (file.type.split("/")[1] ?? "jpg").replace("jpeg", "jpg");
  const name = `crm_${Date.now()}.${ext}`;
  const path = `knowledge/cold_leads_photos/${name}`;

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: `crm photo ${name}`, content: buf.toString("base64") }),
  });
  if (!res.ok) return "";
  return `https://github.com/${GITHUB_REPO}/blob/main/${path}`;
}

/** Фото стенда: путь в репозитории (для показа через CRM) и страница файла (для истории лида). */
export async function uploadStandPhoto(file: File): Promise<{ path: string; pageUrl: string } | null> {
  const token = process.env.COLD_LEADS_GITHUB_TOKEN;
  if (!token) return null;
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > 4 * 1024 * 1024) return null;
  const name = `crm_${Date.now()}.jpg`;
  const path = `knowledge/cold_leads_photos/${name}`;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: `crm stand photo ${name}`, content: buf.toString("base64") }),
  });
  if (!res.ok) return null;
  return { path, pageUrl: `https://github.com/${GITHUB_REPO}/blob/main/${path}` };
}

const PHOTO_PATH = /^knowledge\/cold_leads_photos\/crm_\d+\.jpe?g$/;

/** Байты фото из приватного репозитория. Путь только из нашей папки. */
export async function readStandPhoto(path: string): Promise<{ bytes: ArrayBuffer; type: string } | null> {
  if (!PHOTO_PATH.test(path)) return null;
  const token = process.env.COLD_LEADS_GITHUB_TOKEN;
  if (!token) return null;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.raw" },
  });
  if (!res.ok) return null;
  return { bytes: await res.arrayBuffer(), type: res.headers.get("content-type") || "image/jpeg" };
}
