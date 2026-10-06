"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AssistantAvatar, { type AvatarState } from "./AssistantAvatar";
import { AI_DISCLOSURE_DE } from "../../lib/site-assist-copy";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  { label: "Welche Leistungen?", text: "Welche Leistungen bieten Sie an?" },
  { label: "Projekte zeigen", text: "Welche Projekte kann ich mir ansehen?" },
  { label: "Beratung buchen", href: "/kontakt" as const },
];

const LISTEN_TIMEOUT_MS = 12000;

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike> & { length: number };
};

type SpeechRecognitionErrorLike = { error?: string };

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function speechErrorMessage(code: string | undefined): string | null {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Mikrofon-Zugriff verweigert — bitte in den Browser-Einstellungen erlauben.";
    case "no-speech":
      return "Nichts gehört — nochmal aufs Mikro tippen und deutlich sprechen.";
    case "audio-capture":
      return "Kein Mikrofon gefunden.";
    case "network":
      return "Spracherkennung braucht Internet. Am zuverlässigsten in Chrome.";
    case "aborted":
      return null;
    default:
      return "Spracherkennung fehlgeschlagen — bitte tippen oder Chrome nutzen.";
  }
}

export default function SiteAssistant({
  variant = "hero",
  onClose,
}: {
  variant?: "hero" | "panel";
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: AI_DISCLOSURE_DE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttsOn, setTtsOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState({ stt: false, tts: false });
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const primingStreamRef = useRef<MediaStream | null>(null);
  const listenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesRef = useRef(messages);
  const loadingRef = useRef(loading);
  const finalTranscriptRef = useRef("");
  const sentVoiceRef = useRef(false);
  const intentionalStopRef = useRef(false);

  messagesRef.current = messages;
  loadingRef.current = loading;

  /** Hard-release mic + recognition so OS indicator (yellow dot) goes off. */
  function releaseMic(opts?: { keepTranscript?: boolean }) {
    intentionalStopRef.current = true;
    if (listenTimerRef.current) {
      clearTimeout(listenTimerRef.current);
      listenTimerRef.current = null;
    }

    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      try {
        recognition.abort();
      } catch {
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
      }
    }

    const priming = primingStreamRef.current;
    primingStreamRef.current = null;
    if (priming) {
      priming.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          /* ignore */
        }
      });
    }

    if (typeof window !== "undefined") {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
    }

    setListening(false);
    if (!opts?.keepTranscript) {
      // leave typed/interim text; only clear listening UI
    }
  }

  useEffect(() => {
    setSpeechSupported({
      stt: !!getSpeechRecognition(),
      tts: typeof window !== "undefined" && "speechSynthesis" in window,
    });

    const onHide = () => releaseMic();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      releaseMic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const avatarState: AvatarState = listening
    ? "listening"
    : loading
      ? "thinking"
      : ttsOn && messages.at(-1)?.role === "assistant" && !loading
        ? "speaking"
        : "idle";

  function speak(text: string) {
    if (!ttsOn || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "de-DE";
    utter.rate = 1.05;
    window.speechSynthesis.speak(utter);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loadingRef.current) return;
    // Never keep mic open while waiting for the model.
    releaseMic({ keepTranscript: true });
    setError(null);
    setInput("");
    const next: Msg[] = [...messagesRef.current, { role: "user", content: trimmed }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/site-assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        const code = data?.error ?? "error";
        setError(
          code === "rate_limited"
            ? "Zu viele Anfragen — bitte später nochmal versuchen."
            : code === "not_configured"
              ? "Assistent ist gerade nicht verfügbar. Schreiben Sie mir über /kontakt."
              : "Etwas ist schiefgelaufen. Bitte über /kontakt melden."
        );
        return;
      }
      const reply = String(data.reply);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      speak(reply);
    } catch {
      setError("Netzwerkfehler — bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleMic() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setError("Spracherkennung wird von diesem Browser nicht unterstützt — bitte tippen oder Chrome nutzen.");
      return;
    }

    // Stop → hard release (abort), so yellow OS mic indicator turns off.
    if (listening || recognitionRef.current) {
      releaseMic();
      return;
    }

    setError(null);
    finalTranscriptRef.current = "";
    sentVoiceRef.current = false;
    intentionalStopRef.current = false;

    // Safari: request mic once, keep stream only while recognition runs, then stop tracks.
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        primingStreamRef.current = stream;
      } catch {
        setError("Mikrofon-Zugriff verweigert — bitte erlauben und nochmal tippen.");
        return;
      }
    }

    const recognition = new Ctor();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const piece = ev.results[i][0]?.transcript ?? "";
        if (ev.results[i].isFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current} ${piece}`.trim();
        } else {
          interim += piece;
        }
      }
      const shown = (finalTranscriptRef.current || interim).trim();
      if (shown) setInput(shown);
    };

    recognition.onerror = (ev) => {
      if (intentionalStopRef.current || ev.error === "aborted") {
        releaseMic();
        return;
      }
      const msg = speechErrorMessage(ev.error);
      releaseMic();
      if (msg) setError(msg);
    };

    recognition.onend = () => {
      if (listenTimerRef.current) {
        clearTimeout(listenTimerRef.current);
        listenTimerRef.current = null;
      }
      // Drop any leftover tracks immediately when recognition ends.
      const priming = primingStreamRef.current;
      primingStreamRef.current = null;
      priming?.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          /* ignore */
        }
      });

      recognitionRef.current = null;
      setListening(false);

      if (intentionalStopRef.current) return;

      const text = finalTranscriptRef.current.trim();
      if (text && !sentVoiceRef.current) {
        sentVoiceRef.current = true;
        void send(text);
      }
    };

    recognitionRef.current = recognition;
    setListening(true);
    listenTimerRef.current = setTimeout(() => {
      // Safety: never leave mic open forever (phone camera / yellow macOS dot).
      const text = finalTranscriptRef.current.trim();
      releaseMic({ keepTranscript: true });
      if (text && !sentVoiceRef.current) {
        sentVoiceRef.current = true;
        void send(text);
      } else if (!text) {
        setError("Aufnahme-Zeit abgelaufen — bitte nochmal tippen oder kurz sprechen.");
      }
    }, LISTEN_TIMEOUT_MS);

    try {
      recognition.start();
    } catch {
      releaseMic();
      setError("Spracherkennung konnte nicht starten — bitte tippen oder Chrome nutzen.");
    }
  }

  function handleClose() {
    releaseMic();
    onClose?.();
  }

  const shell =
    variant === "hero"
      ? "overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/40"
      : "flex h-[min(560px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/50";

  return (
    <div className={shell}>
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5 sm:px-5">
        <AssistantAvatar state={avatarState} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Gorbenko Assistent</p>
          <p className="text-xs text-[var(--accent)]">
            {listening ? "Ich höre zu… (Mikro tippen = Stop)" : "Digitaler Assistent · Online"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {speechSupported.tts && (
            <button
              type="button"
              onClick={() => {
                setTtsOn((v) => {
                  if (v && typeof window !== "undefined") window.speechSynthesis?.cancel();
                  return !v;
                });
              }}
              className={`rounded-lg p-2 text-xs transition ${
                ttsOn ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "text-[var(--muted)] hover:bg-white/5"
              }`}
              aria-label={ttsOn ? "Stimme aus" : "Stimme an"}
              title={ttsOn ? "Stimme aus" : "Antworten vorlesen"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {ttsOn ? (
                  <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                ) : (
                  <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                )}
              </svg>
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/5"
              aria-label="Schließen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div
        ref={listRef}
        className={`space-y-3 overflow-y-auto p-4 sm:p-5 ${
          variant === "hero" ? "min-h-[300px] max-h-[380px]" : "flex-1"
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={`${i}-${msg.role}`}
            className={`flex animate-fade-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animationDuration: "0.3s" }}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-md bg-white/10"
                  : "rounded-bl-md border border-[var(--accent)]/15 bg-[var(--accent)]/10"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--accent)]/15 bg-[var(--accent)]/10 px-4 py-3">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-400">
            {error}{" "}
            <Link href="/kontakt" className="underline">
              Kontakt
            </Link>
          </p>
        )}
      </div>

      <div className="border-t border-[var(--border)] px-3 pb-3 pt-2 sm:px-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) =>
            "href" in s && s.href ? (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {s.label}
              </Link>
            ) : (
              <button
                key={s.label}
                type="button"
                onClick={() => "text" in s && s.text && void send(s.text)}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {s.label}
              </button>
            )
          )}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Sprechen Sie jetzt…" : "Frage stellen…"}
            disabled={loading}
            className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]/50"
          />
          {speechSupported.stt && (
            <button
              type="button"
              onClick={() => void toggleMic()}
              className={`rounded-xl p-2.5 transition ${
                listening
                  ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-400/40"
                  : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
              aria-label={listening ? "Aufnahme stoppen" : "Sprechen"}
              title={listening ? "Mikrofon aus" : "Per Sprache fragen"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[var(--accent)] px-3.5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 disabled:opacity-40"
          >
            Senden
          </button>
        </form>
      </div>
    </div>
  );
}
