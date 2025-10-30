"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  startDelay?: number;
  cursor?: boolean;
  soundEnabled?: boolean;
  soundSrc?: string;
  soundVolume?: number;
  onComplete?: () => void;
};

export default function Typewriter({
  text,
  speed = 45,
  startDelay = 0,
  cursor = true,
  soundEnabled = false,
  soundSrc,
  soundVolume = 0.45,
  onComplete,
}: Props) {
  const [output, setOutput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const indexRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  // 🔊 simple audio pool
  const poolRef = useRef<HTMLAudioElement[] | null>(null);
  const poolIdxRef = useRef(0);

  const effectiveSound = soundEnabled ? (soundSrc || "/sounds/typewriter.mp3") : undefined;

  useEffect(() => {
    if (!effectiveSound) {
      poolRef.current = null;
      return;
    }
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < 4; i++) {
      const a = new Audio(effectiveSound);
      a.preload = "auto";
      a.volume = soundVolume;
      pool.push(a);
    }
    poolRef.current = pool;
  }, [effectiveSound, soundVolume]);

  const playTick = () => {
    const pool = poolRef.current;
    if (!pool) return;
    const a = pool[poolIdxRef.current++ % pool.length];
    try {
      a.currentTime = 0;
      void a.play();
    } catch {}
  };

  // blink cursor
  useEffect(() => {
    if (!cursor) return;
    const id = window.setInterval(() => setCursorVisible((v) => !v), 550);
    return () => window.clearInterval(id);
  }, [cursor]);

  // main typing effect — only runs once per text change
  useEffect(() => {
    // prevent restarting if we've already finished typing this exact text
    if (hasFinishedRef.current && output === text) return;

    setOutput("");
    indexRef.current = 0;
    hasFinishedRef.current = false;

    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        const i = indexRef.current;
        if (i >= text.length) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          hasFinishedRef.current = true;
          onComplete?.();
          return;
        }

        const ch = text[i];
        setOutput((prev) => prev + ch);
        indexRef.current = i + 1;

        if (soundEnabled && ch && !/\s/.test(ch)) playTick();
      }, Math.max(10, speed));
    }, Math.max(0, startDelay));

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [text, speed, startDelay, soundEnabled]); // only rerun if text or key props change

  return (
    <span style={{ whiteSpace: "pre-wrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {output}
      {cursor && <span style={{ opacity: cursorVisible ? 1 : 0 }}>█</span>}
    </span>
  );
}