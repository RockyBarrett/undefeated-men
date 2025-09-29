"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

  // small audio pool to avoid cut-offs on fast typing
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const poolIndexRef = useRef<number>(0);

  // rebuild audio pool when volume/flag changes
  useEffect(() => {
    if (!soundEnabled) {
      audioPoolRef.current = [];
      return;
    }
    const pool: HTMLAudioElement[] = Array.from({ length: 4 }, () => {
      const a = new Audio("/sounds/typewriter.mp3");
      a.preload = "auto";
      a.volume = soundVolume;
      return a;
    });
    audioPoolRef.current = pool;

    return () => {
      audioPoolRef.current.forEach((a) => {
        a.pause();
        try {
          a.currentTime = 0;
        } catch {
          /* noop */
        }
      });
      audioPoolRef.current = [];
    };
  }, [soundEnabled, soundVolume]);

  const playTick = useCallback(() => {
    const pool = audioPoolRef.current;
    if (!soundEnabled || pool.length === 0) return;
    const el = pool[poolIndexRef.current];
    try {
      el.currentTime = 0;
      void el.play();
    } catch {
      /* ignore */
    }
    poolIndexRef.current = (poolIndexRef.current + 1) % pool.length;
  }, [soundEnabled]);

  // main typing effect
  useEffect(() => {
    setOutput("");
    idxRef.current = 0;

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startTimeoutRef.current !== null) {
      window.clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }

    startTimeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        idxRef.current += 1;
        const next = text.slice(0, idxRef.current);
        setOutput(next);

        const lastChar = next.charAt(next.length - 1);
        if (lastChar && !/\s/.test(lastChar)) {
          playTick();
        }

        if (idxRef.current >= text.length && intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          onCompleteRef.current?.();
        }
      }, Math.max(8, speed));
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
  }, [text, speed, startDelay, playTick]);

  return (
    <span className="typewriter-text">
      {output}
      {cursor && <span className="tw-cursor">█</span>}
    </span>
  );
}