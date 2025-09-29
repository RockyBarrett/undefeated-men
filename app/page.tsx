"use client";

import { useEffect, useRef, useState } from "react";
import Typewriter from "./components/Typewriter";

export default function HomePage() {
  // Gate the whole sequence
  const [started, setStarted] = useState(false);

  // Step flags
  const [showAchievement, setShowAchievement] = useState(false);
  const [showPower, setShowPower] = useState(false);
  const [showAffiliation, setShowAffiliation] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showClickLine, setShowClickLine] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const termRef = useRef<HTMLDivElement | null>(null);

  // ---------- SOUND ----------
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const beepRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickRef.current = new Audio("/sounds/button-click.mp3");
    beepRef.current = new Audio("/sounds/button-beep.mp3");

    if (clickRef.current) {
      clickRef.current.preload = "auto";
      clickRef.current.volume = 0.7;
    }
    if (beepRef.current) {
      beepRef.current.preload = "auto";
      beepRef.current.volume = 0.6;
    }
  }, []);

  // Play click for first button + unlock WebAudio for Typewriter
  const handleStart = () => {
    setStarted(true);
    try {
      // unlock WebAudio in Typewriter (mobile-friendly)
      document.dispatchEvent(new Event("um-audio-unlock"));

      if (clickRef.current) {
        clickRef.current.currentTime = 0;
        void clickRef.current.play();
      }
    } catch {}
  };

  // Beep when CTA appears
  useEffect(() => {
    if (!showCTA) return;
    try {
      if (beepRef.current) {
        beepRef.current.currentTime = 0;
        void beepRef.current.play();
      }
    } catch {}
  }, [showCTA]);

  // ---------- SCROLL ----------
  const smoothScrollToBottom = (duration = 450) => {
    const el = termRef.current;
    if (!el) return;
    const start = el.scrollTop;
    const end = el.scrollHeight - el.clientHeight;
    const dist = end - start;
    if (dist <= 0) return;

    const startTime = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const step = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      el.scrollTop = start + dist * ease(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const afterLine = (delay = 600, next?: () => void) => {
    setTimeout(() => {
      smoothScrollToBottom();
      next?.();
    }, delay);
  };

  return (
    <section className="hero">
      <h1>Undefeated Men</h1>
      <h2>Motivation Test</h2>

      {/* START GATE — show this until user clicks */}
      {!started && (
        <div style={{ marginTop: "1rem" }}>
          <button
            className="cta-btn"
            onClick={handleStart}
            aria-label="Start intro"
          >
            Start
          </button>
        </div>
      )}

      {/* Terminal sequence appears only after Start is clicked */}
      {started && (
        <div className="terminal" ref={termRef}>
          <div className="feed">
            {/* 1. Adventure */}
            <div className="line">
              <Typewriter
                text="Adventure"
                speed={90}
                cursor={false}
                onComplete={() => afterLine(500, () => setShowAchievement(true))}
              />
            </div>

            {/* 2. Achievement */}
            {showAchievement && (
              <div className="line">
                <Typewriter
                  text="Achievement"
                  speed={90}
                  cursor={false}
                  onComplete={() => afterLine(500, () => setShowPower(true))}
                />
              </div>
            )}

            {/* 3. Power */}
            {showPower && (
              <div className="line">
                <Typewriter
                  text="Power"
                  speed={90}
                  cursor={false}
                  onComplete={() =>
                    afterLine(500, () => setShowAffiliation(true))
                  }
                />
              </div>
            )}

            {/* 4. Affiliation */}
            {showAffiliation && (
              <div className="line">
                <Typewriter
                  text="Affiliation"
                  speed={90}
                  cursor={false}
                  onComplete={() => afterLine(500, () => setShowSecurity(true))}
                />
              </div>
            )}

            {/* 5. Security */}
            {showSecurity && (
              <div className="line">
                <Typewriter
                  text="Security"
                  speed={90}
                  cursor={false}
                  onComplete={() => afterLine(650, () => setShowQuestion(true))}
                />
              </div>
            )}

            {/* Question line (no cursor) */}
            {showQuestion && (
              <div className="line">
                <Typewriter
                  text="What motivation type are you?"
                  speed={65}
                  cursor={false}
                  onComplete={() => afterLine(900, () => setShowClickLine(true))}
                />
              </div>
            )}

            {/* Click line + big pulsing red button (no trailing cursor) */}
            {showClickLine && (
              <div className="line inline-line">
                <Typewriter
                  text="Click here to find out"
                  speed={65}
                  cursor={false}
                  onComplete={() => afterLine(500, () => setShowCTA(true))}
                />

                {showCTA && (
                  <>
                    <span className="cta-arrow" aria-hidden>
                      ➜
                    </span>
                    <a href="/test" className="inline-cta" aria-label="Start the test">
                      <button className="cta-btn-pulse">Start the Test</button>
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}