"use client";

import { Button } from "@/components/ui/Button";
import { useVoiceMeter } from "@/hooks/useVoiceMeter";
import { cn } from "@/lib/cn";
import {
  DEMO_SPEAK_PHRASE,
  highlightPensumQuote,
  parsePensum,
} from "@/lib/parsePensum";
import { Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type SpeakPhase = "idle" | "listening" | "heard";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
};

type Props = {
  onResolved: (pensum: number) => void;
  onChangeIt: (pensum: number) => void;
  className?: string;
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Waveform({ levels }: { levels: number[] }) {
  return (
    <div className="dm-wave" aria-hidden>
      {levels.map((level, i) => (
        <i
          key={i}
          style={{ height: `${Math.max(3, Math.round(level * 26))}px` }}
        />
      ))}
    </div>
  );
}

export function IntakeSpeak({ onResolved, onChangeIt, className }: Props) {
  const [phase, setPhase] = useState<SpeakPhase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [liveText, setLiveText] = useState("");
  const [quote, setQuote] = useState("");
  const [heardValue, setHeardValue] = useState(80);
  const [cue, setCue] = useState("That's 4 days a week.");

  const transcriptRef = useRef("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const demoTimerRef = useRef<number | null>(null);
  const finishingRef = useRef(false);

  const { levels, simulated, start: startMeter, stop: stopMeter } =
    useVoiceMeter(28);

  const clearDemo = useCallback(() => {
    if (demoTimerRef.current != null) {
      window.clearInterval(demoTimerRef.current);
      demoTimerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    finishingRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    clearDemo();
    stopMeter();
    transcriptRef.current = "";
    setLiveText("");
    setSeconds(0);
    setPhase("idle");
  }, [clearDemo, stopMeter]);

  useEffect(() => () => reset(), [reset]);

  useEffect(() => {
    if (phase !== "listening") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const finish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    recognitionRef.current?.stop();
    recognitionRef.current = null;
    clearDemo();
    stopMeter();

    const spoken =
      transcriptRef.current.trim() ||
      (simulated ? DEMO_SPEAK_PHRASE : DEMO_SPEAK_PHRASE);
    const parsed = parsePensum(spoken) ?? {
      value: 80,
      cue: "That's 4 days a week.",
    };

    setQuote(spoken);
    setHeardValue(parsed.value);
    setCue(parsed.cue);
    onResolved(parsed.value);
    setPhase("heard");
    finishingRef.current = false;
  }, [clearDemo, onResolved, simulated, stopMeter]);

  const startListening = useCallback(async () => {
    finishingRef.current = false;
    transcriptRef.current = "";
    setLiveText("");
    setSeconds(0);
    setPhase("listening");
    await startMeter();

    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? (
            window as unknown as {
              SpeechRecognition?: new () => SpeechRecognitionLike;
              webkitSpeechRecognition?: new () => SpeechRecognitionLike;
            }
          ).SpeechRecognition ||
          (
            window as unknown as {
              webkitSpeechRecognition?: new () => SpeechRecognitionLike;
            }
          ).webkitSpeechRecognition
        : undefined;

    if (SpeechRecognitionCtor) {
      try {
        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-CH";
        recognition.onresult = (event) => {
          let text = "";
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            text += event.results[i]![0]!.transcript;
          }
          const next = text.trim();
          transcriptRef.current = next;
          setLiveText(next);
        };
        recognition.onerror = () => undefined;
        recognition.onend = () => undefined;
        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch {
        recognitionRef.current = null;
      }
    }

    // Design-system demo: stream the sample phrase word by word.
    const words = DEMO_SPEAK_PHRASE.split(" ");
    let k = 0;
    demoTimerRef.current = window.setInterval(() => {
      k += 1;
      const slice = words.slice(0, k).join(" ");
      transcriptRef.current = slice;
      setLiveText(slice);
      if (k >= words.length) {
        clearDemo();
      }
    }, 330);
  }, [clearDemo, startMeter]);

  // Simulated mic: stop after the phrase finishes (~ words * 330ms + beat).
  useEffect(() => {
    if (phase !== "listening" || !simulated) return;
    const words = DEMO_SPEAK_PHRASE.split(" ").length;
    const id = window.setTimeout(() => finish(), words * 330 + 700);
    return () => window.clearTimeout(id);
  }, [finish, phase, simulated]);

  // Real mic: stop after ~2s of quiet once we have some speech.
  useEffect(() => {
    if (phase !== "listening" || simulated) return;
    let quietFor = 0;
    const id = window.setInterval(() => {
      if (!transcriptRef.current) return;
      const peak = Math.max(...levels.slice(-8));
      if (peak < 0.2) quietFor += 200;
      else quietFor = 0;
      if (quietFor >= 2000) finish();
    }, 200);
    return () => window.clearInterval(id);
  }, [finish, levels, phase, simulated]);

  if (phase === "heard") {
    return (
      <div className={cn("dm-stack", className)} style={{ gap: 10 }}>
        <div className="dm-heardval">
          <span className="dm-small dm-muted">We heard</span>
          <p
            className="dm-heard"
            style={{ margin: "2px 0 8px" }}
            dangerouslySetInnerHTML={{
              __html: `"${highlightPensumQuote(quote)}"`,
            }}
          />
          <span className="dm-heardval__v">{heardValue} %</span>
          <span className="dm-small dm-muted">{cue}</span>
        </div>
        <div className="dm-row">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onChangeIt(heardValue)}
          >
            Change it
          </Button>
          <Button variant="text" className="dm-small" onClick={reset}>
            Say it again
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "listening") {
    return (
      <div className={cn("dm-stack", className)} style={{ gap: 12 }}>
        <p
          className="dm-heard"
          aria-live="polite"
          style={{ minHeight: 48, margin: 0 }}
        >
          {liveText || (
            <span style={{ color: "var(--ink-muted)" }}>Listening…</span>
          )}
          {liveText ? (
            <span style={{ color: "var(--ink-muted)" }}> …</span>
          ) : null}
        </p>
        <div className="dm-ask dm-ask--voice is-focus" role="group" aria-label="Listening">
          <button
            type="button"
            className="dm-iconbtn"
            aria-label="Cancel"
            onClick={reset}
          >
            <X strokeWidth={1.75} />
          </button>
          <div className="dm-voice">
            <span className="dm-rec" />
            <Waveform levels={levels} />
          </div>
          <div>
            <span className="dm-timer">{formatTimer(seconds)}</span>
            <button
              type="button"
              className="dm-iconbtn dm-iconbtn--live"
              aria-label="Stop"
              onClick={finish}
            >
              <Square
                strokeWidth={0}
                fill="currentColor"
                size={14}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("dm-stack", className)} style={{ gap: 14 }}>
      <p className="dm-small dm-muted" style={{ margin: 0 }}>
        Say it your way, for example &quot;four days a week&quot; or &quot;80
        percent&quot;.
      </p>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          gap: 10,
          padding: "8px 0",
        }}
      >
        <button
          type="button"
          className="dm-speakbtn"
          aria-label="Start speaking"
          onClick={() => void startListening()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>
        <span className="dm-label">Tap and talk</span>
      </div>
    </div>
  );
}
