"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Option = { text: string; type: keyof Scores };
type Question = { id: number; question: string; options: Option[] };
type Scores = {
  Achievement: number;
  Power: number;
  Affiliation: number;
  Security: number;
  Adventure: number;
};

const LETTERS = ["A", "B", "C", "D", "E"];
const START_SCORES: Scores = {
  Achievement: 0,
  Power: 0,
  Affiliation: 0,
  Security: 0,
  Adventure: 0,
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "You’re starting a fitness journey. What excites you the most?",
    options: [
      { text: "Crushing PRs and reaching my peak physical shape", type: "Achievement" },
      { text: "Becoming the kind of man and leader others want to follow", type: "Power" },
      { text: "Training side by side with brothers in a shared mission", type: "Affiliation" },
      { text: "Following a proven plan I can trust and stick with", type: "Security" },
      { text: "Diving into a brand-new challenge with no limits", type: "Adventure" },
    ],
  },
  {
    id: 2,
    question: "You hit a plateau. What’s your first move?",
    options: [
      { text: "Adjust systems and track metrics tighter", type: "Achievement" },
      { text: "Hire a coach or consultant to direct and guide me", type: "Power" },
      { text: "Work with friends to create momentum", type: "Affiliation" },
      { text: "Improve sleep, recovery, and consistency", type: "Security" },
      { text: "Switch things up—new modality or bold event", type: "Adventure" },
    ],
  },
  {
    id: 3,
    question: "On a rest day, what still feels satisfying?",
    options: [
      { text: "Review and planning", type: "Achievement" },
      { text: "Organizing a group challenge/event for the week", type: "Power" },
      { text: "Catching up with friends and community", type: "Affiliation" },
      { text: "Making sure I have everything ready for the week", type: "Security" },
      { text: "Making spontaneous plans or going on an adventure", type: "Adventure" },
    ],
  },
  {
    id: 4,
question: "What kind of progress excites you the most?",
options: [
  { text: "Measurable achievements", type: "Achievement" },
  { text: "Being someone people want to follow", type: "Power" },
  { text: "Stronger bonds with the people I care about", type: "Affiliation" },
  { text: "Steady habits and few failures", type: "Security" },
  { text: "Epic experiences and unique challenges", type: "Adventure" },
],
  },
  {
    id: 5,
    question: "A unexpected obsticle occurs?",
    options: [
      { text: "Fine if it still helps me hit targets", type: "Achievement" },
      { text: "Stay in control, keep moving", type: "Power" },
      { text: "Work together and overcome", type: "Affiliation" },
      { text: "Take a step back and make a plan", type: "Security" },
      { text: "Love it—surprise me", type: "Adventure" },
    ],
  },
  {
    id: 6,
  question: "You've got 12 weeks to focus. What would make the journey most worth it for you?",
  options: [
    { text: "Beating my personal best and proving I’ve leveled up.", type: "Achievement" },
    { text: "Taking charge and leading a group to success.", type: "Power" },
    { text: "Crushing a goal side-by-side with close friends.", type: "Affiliation" },
    { text: "Locking in a routine I can stick to without burning out.", type: "Security" },
    { text: "Crossing off a bold, bucket-list style challenge.", type: "Adventure" },
  ],
  },
  {
    id: 7,
  question: "You’ve fallen off track. What’s most likely to get you back up?",
  options: [
    { text: "Reminding myself of the bigger goal I’m chasing", type: "Achievement" },
    { text: "Knowing others are watching and following", type: "Power" },
    { text: "Reconnecting with a friend for accountability", type: "Affiliation" },
    { text: "Resetting my routine so I feel grounded again", type: "Security" },
    { text: "Doing something fresh or adventurous to spark energy", type: "Adventure" },
  ],
  },
  {
    id: 8,
    question: "Your favorite kind of training is…",
    options: [
      { text: "Focused: technique, pacing, measurable sets", type: "Achievement" },
      { text: "Leading: leading a group workout", type: "Power" },
      { text: "Social: working out with a training patner", type: "Affiliation" },
      { text: "Controlled: low risk, purposeful progression", type: "Security" },
      { text: "Exploratory: new places and mixed training", type: "Adventure" },
    ],
  },
  {
    id: 9,
    question: "Which compliment would mean the most to you?",
    options: [
      { text: "“You made serious, measurable progress.”", type: "Achievement" },
      { text: "“You inspired me to work harder.”", type: "Power" },
      { text: "“You always lift up everyone around you.”", type: "Affiliation" },
      { text: "“You’re consistent and resilient.”", type: "Security" },
      { text: "“You’re fearless — always up for any challenge.”", type: "Adventure" },
    ],
  },
  {
    id: 10,
    question: "Ten weeks in on a program, you’d be most proud of…",
    options: [
      { text: "A result I can point to: faster, stronger, leaner", type: "Achievement" },
      { text: "A reputation as a man others follow", type: "Power" },
      { text: "Deeper bonds with the brothers I train with", type: "Affiliation" },
      { text: "A routine that fits my life and lasts", type: "Security" },
      { text: "A story worth telling about an epic challenge", type: "Adventure" },
    ],
  },
];

export default function TestPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>({ ...START_SCORES });
  const [finished, setFinished] = useState(false);

  const current = useMemo(() => QUESTIONS[step], [step]);

  const handleAnswer = (type: keyof Scores) => {
    setScores((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    if (step + 1 < QUESTIONS.length) {
      setStep((s) => s + 1);
    } else {
      setFinished(true);
    }
  };

  const getTopResult = () => {
    const entries = Object.entries(scores) as [keyof Scores, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const [topType] = entries[0] || ["Achievement", 0];
    return topType;
  };

  return (
    <section className="container" style={{ textAlign: "center" }}>
      {!finished ? (
        <>
          <h2 style={{ marginBottom: "1rem", color: "#e63946" }}>
            Q{step + 1} of {QUESTIONS.length}
          </h2>

          <div
            className="card"
            style={{
              minHeight: "65vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "2rem",
              gap: "1.25rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>{current.question}</h2>

            <div>
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.type)}
                  style={{
                    display: "block",
                    margin: "0.75rem auto",
                    width: "85%",
                    maxWidth: "600px",
                    fontSize: "1.1rem",
                    padding: "0.9rem 1rem",
                    textAlign: "left",
                  }}
                >
                  {LETTERS[idx]}. {opt.text}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div
          className="card"
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <h2>Your dominant motivation type is:</h2>
          <h1 style={{ color: "#e63946", margin: "1.25rem 0", fontSize: "2.5rem" }}>
            {getTopResult()}
          </h1>
          <p style={{ marginTop: "1rem" }}>
            Thanks for taking the test. This is just the start—lock in a goal and we’ll help you
            train in a way that fits how you’re wired.
          </p>
          <a href="/" style={{ marginTop: "2rem" }}>
            <button>← Back to Home</button>
          </a>
        </div>
      )}
    </section>
  );
}