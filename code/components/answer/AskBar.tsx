"use client";

import { useVoiceMeter } from "@/hooks/useVoiceMeter";
import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { htmlLangFor } from "@/lib/i18n";
import { readLanguage } from "@/lib/settingsPrefs";
import { Mic, Plus, Send, Square, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

type AskMode = "idle" | "listening" | "writing";

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
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onAttach?: () => void;
  /** Demo transcript when Web Speech API is unavailable */
  mockTranscript?: string;
  className?: string;
  sticky?: boolean;
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** DS AskBar: `n = Math.floor(el.clientWidth / 6)` so bars fill the voice slot. */
function Waveform({ levels }: { levels: number[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [barCount, setBarCount] = useState(() =>
    Math.max(8, levels.length || 40),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      const n = Math.floor(el.clientWidth / 6) || 40;
      setBarCount(Math.max(8, n));
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bars =
    levels.length >= barCount
      ? levels.slice(-barCount)
      : [
          ...Array.from({ length: barCount - levels.length }, () => 0.12),
          ...levels,
        ];

  return (
    <div className="dm-wave" ref={ref} aria-hidden>
      {bars.map((level, i) => (
        <i
          key={i}
          style={{ height: `${Math.max(3, Math.round(level * 26))}px` }}
        />
      ))}
    </div>
  );
}

function Dots3({ label = copy.askWriting }: { label?: string }) {
  return (
    <span className="dm-dots3" aria-label={label}>
      <i />
      <i />
      <i />
    </span>
  );
}

export function AskBar({
  placeholder = copy.askPlaceholder,
  disabled,
  defaultValue = "",
  value: controlledValue,
  onChange,
  onSubmit,
  onAttach,
  mockTranscript = "I'm expecting in March, can I go to 60 %?",
  className,
  sticky,
}: Props) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;
  const setValue = useCallback(
    (next: string) => {
      if (controlledValue === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [controlledValue, onChange],
  );

  const [mode, setMode] = useState<AskMode>("idle");
  const [focused, setFocused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [writingWords, setWritingWords] = useState<string[]>([]);
  const [writingCount, setWritingCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");
  const finishingRef = useRef(false);
  const writeTimerRef = useRef<number | null>(null);

  const {
    levels,
    active: meterActive,
    simulated,
    start: startMeter,
    stop: stopMeter,
  } = useVoiceMeter(120);
  const canSend = value.trim().length > 0;
  const isBusy = mode !== "idle";

  const clearWriteTimer = useCallback(() => {
    if (writeTimerRef.current != null) {
      window.clearInterval(writeTimerRef.current);
      writeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (mode !== "listening") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [mode]);

  const landInField = useCallback(
    (text: string) => {
      clearWriteTimer();
      setWritingWords([]);
      setWritingCount(0);
      setValue(text);
      setMode("idle");
      finishingRef.current = false;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        const len = text.length;
        inputRef.current?.setSelectionRange(len, len);
      });
    },
    [clearWriteTimer, setValue],
  );

  const startWriting = useCallback(
    (text: string) => {
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWritingWords(words);
      setWritingCount(0);
      setMode("writing");
      clearWriteTimer();

      if (words.length === 0) {
        landInField(text);
        return;
      }

      // Design system: first word appears immediately, then +140ms each
      setWritingCount(1);
      if (words.length === 1) {
        window.setTimeout(() => landInField(words.join(" ")), 350);
        return;
      }

      let k = 1;
      writeTimerRef.current = window.setInterval(() => {
        k += 1;
        setWritingCount(k);
        if (k >= words.length) {
          clearWriteTimer();
          window.setTimeout(() => landInField(words.join(" ")), 350);
        }
      }, 140);
    },
    [clearWriteTimer, landInField],
  );

  const finishListening = useCallback(
    (opts?: { cancel?: boolean }) => {
      if (finishingRef.current) return;
      finishingRef.current = true;

      recognitionRef.current?.stop();
      recognitionRef.current = null;
      stopMeter();

      if (opts?.cancel) {
        clearWriteTimer();
        setWritingWords([]);
        setWritingCount(0);
        setMode("idle");
        transcriptRef.current = "";
        finishingRef.current = false;
        return;
      }

      // Transcribing = AskBar state 5: normal bar, no recorder / waveform.
      // Cancel · words writing in · three dots. Instant cut, no fade.
      const spoken = transcriptRef.current.trim();
      const text = spoken || mockTranscript;
      transcriptRef.current = "";
      startWriting(text);
    },
    [clearWriteTimer, mockTranscript, startWriting, stopMeter],
  );

  const startListening = useCallback(async () => {
    if (disabled || finishingRef.current) return;
    clearWriteTimer();
    transcriptRef.current = "";
    setWritingWords([]);
    setWritingCount(0);
    setSeconds(0);
    finishingRef.current = false;
    setMode("listening");
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

    if (!SpeechRecognitionCtor) return;

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = `${htmlLangFor(readLanguage())}-CH`;
      recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          text += event.results[i]![0]!.transcript;
        }
        transcriptRef.current = text.trim();
      };
      recognition.onerror = () => undefined;
      recognition.onend = () => undefined;
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      recognitionRef.current = null;
    }
  }, [clearWriteTimer, disabled, startMeter]);

  useEffect(() => {
    if (mode !== "listening" || !meterActive || simulated) return;
    let quietFor = 0;
    const id = window.setInterval(() => {
      const peak = Math.max(...levels.slice(-8));
      if (peak < 0.2) quietFor += 200;
      else quietFor = 0;
      if (quietFor >= 2000) finishListening();
    }, 200);
    return () => window.clearInterval(id);
  }, [finishListening, levels, meterActive, mode, simulated]);

  useEffect(() => {
    if (mode !== "listening" || !simulated) return;
    const id = window.setTimeout(() => finishListening(), 8000);
    return () => window.clearTimeout(id);
  }, [finishListening, mode, simulated]);

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      clearWriteTimer();
      stopMeter();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- unmount only
    [],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend || disabled || isBusy) return;
    onSubmit?.(value.trim());
    setValue("");
  }

  /* 4 · Listening — recorder bar only */
  if (mode === "listening") {
    return (
      <div
        className={cn(
          "dm-ask dm-ask--voice is-focus",
          sticky && "dm-floatask",
          disabled && "is-disabled",
          className,
        )}
        role="group"
        aria-label="Voice input"
      >
        <button
          type="button"
          className="dm-iconbtn"
          aria-label={copy.askCancel}
          onClick={() => finishListening({ cancel: true })}
          disabled={disabled}
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
            aria-label={copy.askStop}
            onClick={() => finishListening()}
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
    );
  }

  /* 5 · Transcribing — normal bar, words write in, dots. No waveform. */
  if (mode === "writing") {
    return (
      <div
        className={cn(
          "dm-ask is-focus",
          sticky && "dm-floatask",
          disabled && "is-disabled",
          className,
        )}
        role="status"
        aria-live="polite"
        aria-label={copy.askWriting}
      >
        <button
          type="button"
          className="dm-iconbtn"
          aria-label={copy.askCancel}
          onClick={() => finishListening({ cancel: true })}
          disabled={disabled}
        >
          <X strokeWidth={1.75} />
        </button>
        <span className="dm-transcript is-writing">
          {writingWords.slice(0, writingCount).map((w, i) => (
            <span key={`${w}-${i}`} className="w">
              {i > 0 ? " " : ""}
              {w}
            </span>
          ))}
          <span className="dm-fakecaret" style={{ marginLeft: 2 }} />
        </span>
        <Dots3 />
      </div>
    );
  }

  /* 1–3 · Resting / focused / typing · 6 · Transcribed */
  return (
    <form
      className={cn(
        "dm-ask",
        focused && "is-focus",
        disabled && "is-disabled",
        sticky && "dm-floatask",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="dm-iconbtn"
        aria-label={copy.askAttach}
        onClick={onAttach}
        disabled={disabled}
      >
        <Plus strokeWidth={1.75} />
      </button>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {canSend ? (
        <button
          type="submit"
          className="dm-iconbtn dm-iconbtn--send"
          aria-label={copy.askSend}
          disabled={disabled}
        >
          <Send strokeWidth={1.75} />
        </button>
      ) : (
        <button
          type="button"
          className="dm-iconbtn"
          aria-label={copy.askSpeak}
          onClick={() => void startListening()}
          disabled={disabled}
        >
          <Mic strokeWidth={1.75} />
        </button>
      )}
    </form>
  );
}
