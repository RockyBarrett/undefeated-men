// app/guess-his/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Scores = {
  Achievement: number;
  Power: number;
  Affiliation: number;
  Security: number;
  Adventure: number;
};

type Option = { text: string; type: keyof Scores };
type Question = { id: number; question: string; options: Option[] };

const LETTERS = ["A", "B", "C", "D", "E"];
const START_SCORES: Scores = {
  Achievement: 0,
  Power: 0,
  Affiliation: 0,
  Security: 0,
  Adventure: 0,
};

const MEN_TEST_PATH = "/men";

const QUESTIONS: Question[] = [
  { id: 1, question: "You’re starting a fitness journey. What excites you the most?", options: [
    { text: "Following a proven plan I can trust and stick with", type: "Security" },
    { text: "Crushing PRs and reaching my peak physical shape", type: "Achievement" },
    { text: "Diving into a brand-new challenge with no limits", type: "Adventure" },
    { text: "Training side by side with brothers in a shared mission", type: "Affiliation" },
    { text: "Becoming the kind of man and leader others want to follow", type: "Power" },
  ]},
  { id: 2, question: "You hit a plateau. What’s your first move?", options: [
    { text: "Work with friends to create momentum", type: "Affiliation" },
    { text: "Adjust systems and track metrics tighter", type: "Achievement" },
    { text: "Switch things up—new modality or bold event", type: "Adventure" },
    { text: "Hire a coach or consultant to direct and guide me", type: "Power" },
    { text: "Improve sleep, recovery, and consistency", type: "Security" },
  ]},
  { id: 3, question: "On a rest day, what still feels satisfying?", options: [
    { text: "Making spontaneous plans or going on an adventure", type: "Adventure" },
    { text: "Review and planning", type: "Achievement" },
    { text: "Catching up with friends and community", type: "Affiliation" },
    { text: "Making sure I have everything ready for the week", type: "Security" },
    { text: "Organizing a group challenge/event for the week", type: "Power" },
  ]},
  { id: 4, question: "What kind of progress excites you the most?", options: [
    { text: "Being someone people want to follow", type: "Power" },
    { text: "Epic experiences and unique challenges", type: "Adventure" },
    { text: "Measurable achievements", type: "Achievement" },
    { text: "Stronger bonds with the people I care about", type: "Affiliation" },
    { text: "Steady habits and few failures", type: "Security" },
  ]},
  { id: 5, question: "How do you want to be remembered?", options: [
    { text: "As someone who lived boldly, took risks, and never settled.", type: "Adventure" },
    { text: "As someone dependable — steady, grounded, and trustworthy.", type: "Security" },
    { text: "As someone who always raised the standard and achieved excellence.", type: "Achievement" },
    { text: "As a loyal friend who brought people together and made them stronger.", type: "Affiliation" },
    { text: "As a leader who inspired others to become their best.", type: "Power" },
  ]},
  { id: 6, question: "You've got 12 weeks to focus. What would make the journey most worth it for you?", options: [
    { text: "Crossing off a bold, bucket-list style challenge", type: "Adventure" },
    { text: "Locking in a routine I can stick to without burning out", type: "Security" },
    { text: "Taking charge and leading a group to success", type: "Power" },
    { text: "Beating my personal best and proving I’ve leveled up", type: "Achievement" },
    { text: "Crushing a goal side-by-side with close friends", type: "Affiliation" },
  ]},
  { id: 7, question: "You’ve fallen off track. What’s most likely to get you back up?", options: [
    { text: "Doing something fresh or adventurous to spark energy", type: "Adventure" },
    { text: "Reconnecting with a friend for accountability", type: "Affiliation" },
    { text: "Knowing others are watching and following", type: "Power" },
    { text: "Resetting my routine so I feel grounded again", type: "Security" },
    { text: "Reminding myself of the bigger goal I’m chasing", type: "Achievement" },
  ]},
  { id: 8, question: "Your favorite kind of training is…", options: [
    { text: "Controlled: low risk, purposeful progression", type: "Security" },
    { text: "Exploratory: new places and mixed training", type: "Adventure" },
    { text: "Leading: leading a group workout", type: "Power" },
    { text: "Focused: technique, pacing, measurable sets", type: "Achievement" },
    { text: "Social: working out with a training partner", type: "Affiliation" },
  ]},
  { id: 9, question: "Which compliment would mean the most to you?", options: [
    { text: "“You’re fearless — always up for any challenge.”", type: "Adventure" },
    { text: "“You made serious, measurable progress.”", type: "Achievement" },
    { text: "“You always lift up everyone around you.”", type: "Affiliation" },
    { text: "“You’re consistent and resilient.”", type: "Security" },
    { text: "“You inspired me to work harder.”", type: "Power" },
  ]},
  { id: 10, question: "Ten weeks in on a program, you’d be most proud of…", options: [
    { text: "A routine that fits my life and lasts", type: "Security" },
    { text: "Deeper bonds with the brothers I train with", type: "Affiliation" },
    { text: "A story worth telling about an epic challenge", type: "Adventure" },
    { text: "A result I can point to: faster, stronger, leaner", type: "Achievement" },
    { text: "A reputation as a man others follow", type: "Power" },
  ]},
];

export default function GuessHisPage() {
  // Add/remove a body class so we can override global dark background for this route
  useEffect(() => {
    document.body.classList.add("gh-route");
    return () => document.body.classList.remove("gh-route");
  }, []);

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>({ ...START_SCORES });
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const current = useMemo(() => QUESTIONS[step], [step]);
  const answeredCount = useMemo(
    () => Object.values(scores).reduce((a, b) => a + b, 0),
    [scores]
  );

  const handleAnswer = (type: keyof Scores) => {
    setScores((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    if (step + 1 < QUESTIONS.length) setStep((s) => s + 1);
    else setFinished(true);
  };

  const getTopResult = () => {
    const entries = Object.entries(scores) as [keyof Scores, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const [topType] = entries[0] || ["Achievement", 0];
    return topType;
  };

  const menTestUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${MEN_TEST_PATH}`
      : MEN_TEST_PATH;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(menTestUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareLink = async () => {
    if (!navigator.share) {
      copyLink();
      return;
    }
    try {
      setSharing(true);
      await navigator.share({
        title: "Motivation Quiz",
        text: "Let’s see how closely I guessed your motivation type. Take your version here:",
        url: menTestUrl,
      });
    } catch {
      // no-op
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="gh-page">
      <main className="gh-main">
        {!started ? (
          <section className="gh-card" style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 className="gh-col-title" style={{ marginBottom: 8 }}>
              Guess-His Quiz
            </h2>
            <p className="gh-compare-hint">
              Take a 10-question quiz to predict your his motivation style. When you finish,
              you’ll get a link to send him his version and compare how closely your answers match.
            </p>
            <div className="gh-row gh-mt-6" style={{ justifyContent: "center" }}>
              <button className="gh-btn gh-btn-primary" onClick={() => setStarted(true)}>
                Start Quiz
              </button>
              <Link href={MEN_TEST_PATH} className="gh-btn" style={{ textDecoration: "none" }}>
                Open His Quiz
              </Link>
            </div>
          </section>
        ) : !finished ? (
          <>
            <div className="gh-card">
              <div className="gh-progress-head">
                <span>Progress</span>
                <span className="gh-progress-count">
                  {answeredCount}/{QUESTIONS.length}
                </span>
              </div>
              <div className="gh-progress" aria-hidden>
                <div
                  className="gh-progress-fill"
                  style={{ width: `${Math.round((answeredCount / QUESTIONS.length) * 100)}%` }}
                />
              </div>
            </div>

            <div className="gh-card gh-mt-6">
              <div className="gh-q-title">
                <h2 className="gh-q-heading">
                  Question {step + 1} of {QUESTIONS.length}
                </h2>
                <span className="gh-q-hint">Choose the option that fits best</span>
              </div>

              <p className="gh-prompt">{current.question}</p>

              <div className="gh-opts">
                {current.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(opt.type)} className="gh-opt">
                    <span className="gh-opt-label">
                      {LETTERS[idx]}. {opt.text}
                    </span>
                  </button>
                ))}
              </div>

              <div className="gh-row gh-mt-6">
                <button
                  className="gh-btn"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  Back
                </button>
                <div className="gh-row">
                  <button
                    className="gh-btn"
                    onClick={() => {
                      setStarted(false);
                      setStep(0);
                      setScores({ ...START_SCORES });
                      setFinished(false);
                    }}
                  >
                    Exit
                  </button>
                  <button
                    className="gh-btn gh-btn-primary"
                    onClick={() => {
                      if (step + 1 < QUESTIONS.length) setStep((s) => s + 1);
                      else setFinished(true);
                    }}
                  >
                    {step === QUESTIONS.length - 1 ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="gh-card" style={{ minHeight: "50vh" }}>
            <h2 className="gh-col-title">Based on your answers, he is mostly:</h2>
            <h1 className="gh-title" style={{ margin: "16px 0" }}>{getTopResult()}</h1>

            <p className="gh-compare-hint" style={{ marginTop: 8 }}>
              Want to validate your guess? Send him his version and compare how closely your answers match.
            </p>

            <div className="gh-mt-6" style={{ display: "grid", gap: 10 }}>
              <label htmlFor="his-link" className="gh-compare-label">
                His Quiz link
              </label>
              <input
                id="his-link"
                readOnly
                value={menTestUrl}
                aria-label="His quiz link"
                className="gh-select"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                onFocus={(e) => e.currentTarget.select()}
              />

              <div className="gh-row">
                <button className="gh-btn gh-btn-primary" onClick={copyLink}>
                  Copy Link
                </button>
                <button
                  className="gh-btn"
                  onClick={shareLink}
                  disabled={sharing}
                  title={typeof navigator.share === "function" ? "Share" : "Share (copies link if share unsupported)"}
                >
                  {typeof navigator.share === "function" ? (sharing ? "Sharing..." : "Share") : "Share / Copy"}
                </button>
                <Link href={MEN_TEST_PATH} className="gh-btn" style={{ textDecoration: "none", display: "inline-block" }}>
                  Open His  →
                </Link>
              </div>

              {copied && (
                <div className="gh-copy-note" role="status" aria-live="polite" style={{ fontSize: 13 }}>
                  ✅ Link copied!
                </div>
              )}
            </div>

            <div className="gh-row gh-mt-6">
              <button
                className="gh-btn"
                onClick={() => {
                  setStarted(false);
                  setStep(0);
                  setScores({ ...START_SCORES });
                  setFinished(false);
                }}
              >
                Back to Start
              </button>
              <Link href="/" className="gh-btn" style={{ textDecoration: "none", display: "inline-block" }}>
                ← Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="gh-footer">© Undefeated Men</footer>
    </div>
  );
}