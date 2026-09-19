/** Голос → текст через Groq Whisper (whisper-large-v3, русский). */
export async function transcribeAudio(file: File): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY не задан");

  const form = new FormData();
  form.append("file", file, file.name || "audio.m4a");
  form.append("model", "whisper-large-v3");
  form.append("language", "ru");
  form.append("response_format", "json");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Whisper ${res.status}: ${detail.slice(0, 200)}`);
  }
  const json = await res.json();
  return (json.text ?? "").trim();
}
