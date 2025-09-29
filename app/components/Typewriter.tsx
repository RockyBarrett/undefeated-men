"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;      // ms per character (default 45)
  startDelay?: number; // ms before typing starts
  cursor?: boolean;    // show blinking cursor
  onComplete?: () => void; // callback when typing finishes
  soundVolume?: number;    // volume of the key sound (0–1)
};

export default function Typewriter({
  text,
  speed = 45,
  startDelay = 0,
  cursor = true,
  onComplete,
  soundVolume = 0.25,
}: Props) {
  const [output, setOutput] = useState("");
  const iRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // build a small pool of audio objects once on the client
  const audioPoolRef = useRef<HTMLAudioElement[] | null>(null);
  if (typeof window !== "undefined" && !audioPoolRef.current) {
    audioPoolRef.current = Array.from({ length: 4 }, () => {
      const a = new Audio("/sounds/typewriter.mp3"); // make sure file is in /public/sounds
      a.preload = "auto";
      a.volume = soundVolume;
      return a;
    });
  }
  const poolIndex = useRef(0);

  const playSound = () => {
    if (!audioPoolRef.current) return;
    const audio = audioPoolRef.current[poolIndex.current];
    audio.currentTime = 0;
    audio.play().catch(() => {}); // ignore autoplay issues
    poolIndex.current = (poolIndex.current + 1) % audioPoolRef.current.length;
  };

  useEffect(() => {
    const start = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => {
        iRef.current += 1;
        setOutput(text.slice(0, iRef.current));
        playSound();

        if (iRef.current >= text.length && timerRef.current) {
          window.clearInterval(timerRef.current);
          onComplete?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(start);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [text, speed, startDelay, onComplete]);

  return (
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {output}
      {cursor && <span className="tw-cursor">█</span>}
    </span>
  );
}