"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;          // ms per character
  startDelay?: number;     // ms before typing starts
  cursor?: boolean;        // show blinking cursor
  onComplete?: () => void; // callback when typing finishes
  soundEnabled?: boolean;  // turn ticks on/off
  soundEvery?: number;     // play sound every Nth character (default 1 = every char)
  soundVolume?: number;    // 0..1 (default 0.5)
};

export default function Typewriter({
  text,
  speed = 45,
  startDelay = 0,
  cursor = true,
  onComplete,
  soundEnabled = true,
  soundEvery = 1,
  soundVolume = 0.5,
}: Props) {
  const [output, setOutput] = useState("");
  const iRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  // --- WebAudio (primary) ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const unlockedRef = useRef(false);

  // --- HTMLAudio fallback pool ---
  const poolRef = useRef<HTMLAudioElement[] | null>(null);
  const poolIdxRef = useRef(0);

  // unlock event (fired by Start button on home page)
  useEffect(() => {
    const unlock = async () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;

      // Try WebAudio first
      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          // Resume in case it starts suspended
          if (ctx.state === "suspended") await ctx.resume();
          audioCtxRef.current = ctx;

          const gain = ctx.createGain();
          gain.gain.value = soundVolume;
          gain.connect(ctx.destination);
          gainRef.current = gain;

          const res = await fetch("/sounds/typewriter.mp3", { cache: "force-cache" });
          const arr = await res.arrayBuffer();
          bufferRef.current = await ctx.decodeAudioData(arr);
          return; // success
        }
      } catch {
        // fall through to HTMLAudio
      }

      // Fallback pool
      try {
        poolRef.current = Array.from({ length: 6 }, () => {
          const a = new Audio("/sounds/typewriter.mp3");
          a.preload = "auto";
          a.volume = soundVolume;
          return a;
        });
      } catch {
        // ignore
      }
    };

    const handler = () => unlock();
    document.addEventListener("um-audio-unlock", handler, { once: true });

    // If user already interacted (e.g., navigated directly), try unlocking anyway
    // (won’t hurt; browsers may still block until a gesture happens)
    setTimeout(unlock, 0);

    return () => document.removeEventListener("um-audio-unlock", handler);
  }, [soundVolume]);

  const playTick = () => {
    if (!soundEnabled) return;

    // Prefer WebAudio if loaded
    const ctx = audioCtxRef.current;
    const buf = bufferRef.current;
    const gain = gainRef.current;
    if (ctx && buf && gain) {
      try {
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(gain);
        // start immediately; WebAudio has minimal latency
        src.start(0);
        return;
      } catch {
        // fall through
      }
    }

    // Fallback: HTMLAudio pool
    const pool = poolRef.current;
    if (pool && pool.length) {
      const a = pool[poolIdxRef.current++ % pool.length];
      try {
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {}
    }
  };

  useEffect(() => {
    // reset state for new `text`
    iRef.current = 0;
    setOutput("");

    const startTimer = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        const i = ++iRef.current;
        setOutput(text.slice(0, i));

        // tick on cadence
        if (soundEnabled && soundEvery > 0 && i % soundEvery === 0) {
          playTick();
        }

        if (i >= text.length) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          onComplete?.();
        }
      }, Math.max(8, speed)); // clamp tiny speeds a bit
    }, Math.max(0, startDelay));

    return () => {
      window.clearTimeout(startTimer);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed, startDelay, soundEnabled, soundEvery]); // (keep volume outside loop)

  return (
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {output}
      {cursor && <span className="tw-cursor">█</span>}
    </span>
  );
}