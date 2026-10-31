"use client";

import { useVoiceMeter } from "@/hooks/useVoiceMeter";
import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { Mic, Plus, Send, Square, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

type AskMode = "idle" | "listening" | "transcribing";

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

function Waveform({
  levels,
  frozen,
}: {
  levels: number[];
  frozen?: boolean;
}) {
  return (
    <div className={cn("dm-wave", frozen && "is-frozen")} aria-hidden>
      {levels.map((level, i) => (
        <i
          key={i}
          style={{ height: `${Math.max(3, Math.round(level * 26))}px` }}
        />
      ))}
    </div>
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
  const [frozenLevels, setFrozenLevels] = useState<number[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");
  const finishingRef = useRef(false);

  const {
    levels,
    active: meterActive,
    simulated,
    start: startMeter,
    stop: stopMeter,
  } = useVoiceMeter(40);
  const canSend = value.trim().length > 0;
  const isVoice = mode === "listening" || mode === "transcribing";

  useEffect(() => {
    if (mode !== "listening") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [mode]);

  const finishListening = useCallback(
    async (opts?: { cancel?: boolean }) => {
      if (finishingRef.current) return;
      finishingRef.current = true;

      recognitionRef.current?.stop();
      recognitionRef.current = null;

      if (opts?.cancel) {
        stopMeter();
        setFrozenLevels(null);
        setMode("idle");
        transcriptRef.current = "";
        finishingRef.current = false;
        return;
      }

      setFrozenLevels(levels);
      setMode("transcribing");
      stopMeter();

      const spoken = transcriptRef.current.trim();
      await new Promise((r) => window.setTimeout(r, spoken ? 600 : 900));

      const text = spoken || mockTranscript;
      setValue(text);
      setMode("idle");
      setFrozenLevels(null);
      transcriptRef.current = "";
      finishingRef.current = false;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        const len = text.length;
        inputRef.current?.setSelectionRange(len, len);
      });
    },
    [levels, mockTranscript, setValue, stopMeter],
  );

  const startListening = useCallback(async () => {
    if (disabled || finishingRef.current) return;
    transcriptRef.current = "";
    setFrozenLevels(null);
    setSeconds(0);
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
      recognition.lang = "en-CH";
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
  }, [disabled, startMeter]);

  // Auto-stop after ~2s of quiet levels when using the real mic.
  useEffect(() => {
    if (mode !== "listening" || !meterActive || simulated) return;
    let quietFor = 0;
    const id = window.setInterval(() => {
      const peak = Math.max(...levels.slice(-8));
      if (peak < 0.2) quietFor += 200;
      else quietFor = 0;
      if (quietFor >= 2000) void finishListening();
    }, 200);
    return () => window.clearInterval(id);
  }, [finishListening, levels, meterActive, mode, simulated]);

  // Simulated path: stop after 8s so demos don't run forever.
  useEffect(() => {
    if (mode !== "listening" || !simulated) return;
    const id = window.setTimeout(() => void finishListening(), 8000);
    return () => window.clearTimeout(id);
  }, [finishListening, mode, simulated]);

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      stopMeter();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- unmount only
    [],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend || disabled || isVoice) return;
    onSubmit?.(value.trim());
    setValue("");
  }

  if (isVoice) {
    const waveLevels = frozenLevels ?? levels;
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
          onClick={() => void finishListening({ cancel: true })}
          disabled={disabled || mode === "transcribing"}
        >
          <X strokeWidth={1.75} />
        </button>

        <div className="dm-voice">
          {mode === "listening" ? <span className="dm-rec" /> : null}
          <Waveform levels={waveLevels} frozen={mode === "transcribing"} />
          {mode === "transcribing" ? (
            <span className="dm-shimmer">{copy.askWriting}</span>
          ) : null}
        </div>

        <div>
          <span className="dm-timer">{formatTimer(seconds)}</span>
          {mode === "listening" ? (
            <button
              type="button"
              className="dm-iconbtn dm-iconbtn--live"
              aria-label={copy.askStop}
              onClick={() => void finishListening()}
            >
              <Square
                strokeWidth={0}
                fill="currentColor"
                size={14}
                aria-hidden
              />
            </button>
          ) : (
            <span style={{ width: 44, display: "inline-block" }} aria-hidden />
          )}
        </div>
      </div>
    );
  }

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
