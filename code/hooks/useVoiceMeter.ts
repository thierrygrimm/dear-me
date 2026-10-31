"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BAR_MS = 90;
const FALLBACK_BARS = 36;

type MeterApi = {
  levels: number[];
  active: boolean;
  /** Set when real mic failed and a simulated wave is used */
  simulated: boolean;
  start: () => Promise<boolean>;
  stop: () => void;
};

/**
 * Live mic levels for the AskBar waveform.
 * Prefers Web Audio AnalyserNode; falls back to a gentle simulated wave.
 */
export function useVoiceMeter(barCount = FALLBACK_BARS): MeterApi {
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0.12),
  );
  const [active, setActive] = useState(false);
  const [simulated, setSimulated] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const tickRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const teardown = useCallback(() => {
    clearTimers();
    analyserRef.current = null;
    if (ctxRef.current) {
      void ctxRef.current.close().catch(() => undefined);
      ctxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, [clearTimers]);

  const pushLevel = useCallback(
    (raw: number) => {
      const level = Math.max(0.08, Math.min(1, raw));
      setLevels((prev) => {
        const next = prev.slice(1);
        next.push(level);
        while (next.length < barCount) next.unshift(0.12);
        return next.slice(-barCount);
      });
    },
    [barCount],
  );

  const startSimulated = useCallback(() => {
    clearTimers();
    setSimulated(true);
    tickRef.current = 0;
    intervalRef.current = window.setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      let a = ((Math.sin(t / 5) + 1) / 2) * 0.65 + Math.random() * 0.45;
      if (t % 26 < 5) a *= 0.12;
      pushLevel(a);
    }, BAR_MS);
  }, [clearTimers, pushLevel]);

  const startAnalyserLoop = useCallback(() => {
    clearTimers();
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    intervalRef.current = window.setInterval(() => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) {
        const v = (data[i]! - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      pushLevel(rms * 4.2);
    }, BAR_MS);
  }, [clearTimers, pushLevel]);

  const start = useCallback(async () => {
    teardown();
    setSimulated(false);
    setLevels(Array.from({ length: barCount }, () => 0.12));
    setActive(true);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      startSimulated();
      return true;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });
      streamRef.current = stream;
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyserRef.current = analyser;
      if (ctx.state === "suspended") await ctx.resume();
      startAnalyserLoop();
      return true;
    } catch {
      startSimulated();
      return true;
    }
  }, [barCount, startAnalyserLoop, startSimulated, teardown]);

  const stop = useCallback(() => {
    teardown();
    setActive(false);
  }, [teardown]);

  useEffect(() => () => teardown(), [teardown]);

  return { levels, active, simulated, start, stop };
}
