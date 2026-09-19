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
