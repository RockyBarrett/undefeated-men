"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;          // ms per character (default 45)
  startDelay?: number;     // ms before typing starts
  cursor?: boolean;        // show blinking cursor
  onComplete?: () => void; // callback when typing finishes
  soundEnabled?: boolean;  // play tick per letter
  soundVolume?: number;    // 0..1 volume
};

export default function Typewriter({
  text,
  speed = 45,
  startDelay = 0,
  cursor = true,
  onComplete,
  soundEnabled = false,
  soundVolume = 0.35,
}: Props) {
  const [output, setOutput] = useState("");

  // typing state
  const idxRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<number | null>(null);

  // keep latest onComplete in a ref to avoid re-subscribing effect
  const onCompleteRef = useRef<Props["onComplete"]>(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // --- AUDIO POOL ---
  const poolRef = useRef<HTMLAudioElement[] | null>(null);
  const poolIdxRef = useRef<number>(0);

  // (re)create pool when sound flags change
  useEffect(() => {
    if (!soundEnabled) {
      poolRef.current?.forEach((a) => {
        a.pause();
        try { a.currentTime = 0; } catch {}
      });
      poolRef.current = null;
      return;
    }

    const pool = Array.from({ length: 4 }, () => {
      const a = new Audio("/sounds/typewriter.mp3");
      a.preload = "auto";
      a.volume = Math.min(1, Math.max(0, soundVolume));
      return a;
    });
    poolRef.current = pool;

    return () => {
      pool.forEach((a) => {
        a.pause();
        try { a.currentTime = 0; } catch {}
      });
      poolRef.current = null;
    };
  }, [soundEnabled, soundVolume]);

  // stable tick player
  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    const pool = poolRef.current;
    if (!pool || pool.length === 0) return;

    const el = pool[poolIdxRef.current];
    try {
      el.currentTime = 0;
      void el.play(); // ignore promise for iOS
    } catch {
      // ignore
    }
    poolIdxRef.current = (poolIdxRef.current + 1) % pool.length;
  }, [soundEnabled]);

  // --- MAIN TYPING EFFECT ---
  useEffect(() => {
    // reset state for new text
    setOutput("");
    idxRef.current = 0;

    // clear old timers
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startTimeoutRef.current !== null) {
      window.clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }

    // start after delay
    startTimeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        const i = idxRef.current + 1;
        idxRef.current = i;

        const next = text.slice(0, i);
        setOutput(next);

        // play tick for this character (if enabled and not whitespace)
        const lastChar = next.charAt(next.length - 1);
        if (lastChar && !/\s/.test(lastChar)) {
          playTick();
        }

        // done?
        if (i >= text.length && intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          onCompleteRef.current?.();
        }
      }, Math.max(8, speed)); // clamp for sanity
    }, Math.max(0, startDelay));

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (startTimeoutRef.current !== null) {
        window.clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
    };
  }, [text, speed, startDelay, playTick]); // include playTick to satisfy ESLint and keep behavior stable

  return (
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {output}
      {cursor && <span className="tw-cursor">█</span>}
    </span>
  );
}