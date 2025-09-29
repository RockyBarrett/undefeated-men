"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;          // ms per character (default 45)
  startDelay?: number;     // ms before typing starts
  cursor?: boolean;        // show blinking cursor
  onComplete?: () => void; // callback when typing finishes
  soundEnabled?: boolean;  // default true
  soundVolume?: number;    // 0..1 (default 0.5)
  soundEvery?: number;     // play click every N chars (default 1)
};

export default function Typewriter({
  text,
  speed = 45,
  startDelay = 0,
  cursor = true,
  onComplete,
  soundEnabled = true,
  soundVolume = 0.5,
  soundEvery = 1,
}: Props) {
  const [output, setOutput] = useState("");

  const charIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const sessionRef = useRef(0); // prevent overlapping loops

  // Hold latest onComplete in a ref so we don't resubscribe the effect
  const onCompleteRef = useRef<(() => void) | undefined>(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // ---- AUDIO POOL (optional clicks) ----
  const poolRef = useRef<HTMLAudioElement[] | null>(null);
  const poolIdxRef = useRef(0);

  useEffect(() => {
    if (!soundEnabled) return;

    let url: string | null = null;
    let cancelled = false;

    const setup = async () => {
      try {
        const res = await fetch("/sounds/typewriter.mp3", { cache: "force-cache" });
        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        if (cancelled) return;

        const make = () => {
          const a = new Audio(url!);
          a.preload = "auto";
          a.volume = soundVolume;
          return a;
        };
        poolRef.current = [make(), make(), make()];
      } catch {
        const make = () => {
          const a = new Audio("/sounds/typewriter.mp3");
          a.preload = "auto";
          a.volume = soundVolume;
          return a;
        };
        poolRef.current = [make(), make(), make()];
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
      poolRef.current?.forEach((a) => {
        try { a.pause(); } catch {}
      });
      poolRef.current = null;
    };
  }, [soundEnabled, soundVolume]);

  const clickSound = () => {
    if (!soundEnabled || !poolRef.current) return;
    const pool = poolRef.current;
    const a = pool[poolIdxRef.current % pool.length];
    poolIdxRef.current++;
    try {
      a.currentTime = 0;
      void a.play().catch(() => {});
    } catch {}
  };

  // ---- TYPING LOOP (runs once per text/speed/startDelay change) ----
  useEffect(() => {
    const mySession = ++sessionRef.current;

    // reset
    charIndexRef.current = 0;
    setOutput("");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const startAt = performance.now() + startDelay;
    let nextDue = startAt + speed;

    const tick = () => {
      if (mySession !== sessionRef.current) return; // abort old sessions

      const now = performance.now();
      if (now >= nextDue) {
        const nextIndex = charIndexRef.current + 1;
        charIndexRef.current = nextIndex;

        const nextOut = text.slice(0, nextIndex);
        setOutput(nextOut);

        if (soundEnabled && soundEvery > 0 && nextIndex % soundEvery === 0) {
          clickSound();
        }

        if (nextIndex >= text.length) {
          onCompleteRef.current?.();
          return; // stop
        }

        nextDue += speed;
      }

      const delay = Math.max(8, Math.min(speed, nextDue - now));
      timerRef.current = window.setTimeout(tick, delay);
    };

    timerRef.current = window.setTimeout(tick, Math.max(0, startDelay));

    return () => {
      if (mySession === sessionRef.current && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, speed, startDelay, /* deliberately NOT depending on onComplete */, soundEnabled, soundEvery]);

  return (
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {output}
      {cursor && <span className="tw-cursor">█</span>}
    </span>
  );
}