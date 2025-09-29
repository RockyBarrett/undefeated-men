"use client";

import { useEffect, useRef, useState } from "react";

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

  // Keep latest callback without re-subscribing effect
  const onCompleteRef = useRef<Props["onComplete"]>(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Small audio pool so ticks don’t get cut off
  const poolRef = useRef<HTMLAudioElement[] | null>(null);
  const poolIdxRef = useRef(0);

  useEffect(() => {
    if (!soundEnabled) {
      poolRef.current = null;
      return;
    }
    const pool = Array.from({ length: 4 }, () => {
      const a = new Audio("/sounds/typewriter.mp3");
      a.preload = "auto";
      a.volume = soundVolume;
      return a;
    });
    poolRef.current = pool;

    return () => {
      poolRef.current?.forEach((a) => {
        a.pause();
        try { a.currentTime = 0; } catch {}
      });
      poolRef.current = null;
    };
  }, [soundEnabled, soundVolume]);

  const playTick = () => {
    const pool = poolRef.current;
    if (!soundEnabled || !pool || pool.length === 0) return;
    const el = pool[poolIdxRef.current];
    try {
      el.currentTime = 0;
      void el.play();
    } catch {}
    poolIdxRef.current = (poolIdxRef.current + 1) % pool.length;
  };

  // --- Typing logic (robust, no duplicates) ---
  const runIdRef = useRef(0);          // guard for overlapping runs
  const timeoutRef = useRef<number | undefined>(undefined); // active timeout id

  useEffect(() => {
    const myRun = ++runIdRef.current;

    // reset state
    setOutput("");

    // clear any leftover timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const s = Math.max(8, speed);
    const start = Math.max(0, startDelay);

    let i = 0;

    const typeNext = () => {
      // If another run started, stop this one
      if (runIdRef.current !== myRun) return;

      i += 1;
      const next = text.slice(0, i);
      setOutput(next);

      // tick for non-whitespace
      const ch = next.charAt(next.length - 1);
      if (ch && !/\s/.test(ch)) playTick();

      if (i < text.length) {
        timeoutRef.current = window.setTimeout(typeNext, s);
      } else {
        onCompleteRef.current?.();
      }
    };

    // initial delay then start
    timeoutRef.current = window.setTimeout(typeNext, start);

    // cleanup this run
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, startDelay]); // intentionally exclude onComplete/playTick

  return (
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {output}
      {cursor && <span className="tw-cursor">█</span>}
    </span>
  );
}