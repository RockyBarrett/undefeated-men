"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "You’re starting a fitness journey. What excites you the most?",
    options: [
      { text: "Following a proven plan I can trust and stick with", type: "Security" },
      { text: "Crushing PRs and reaching my peak physical shape", type: "Achievement" },
      { text: "Diving into a brand-new challenge with no limits", type: "Adventure" },
      { text: "Training side by side with brothers in a shared mission", type: "Affiliation" },
      { text: "Becoming the kind of man and leader others want to follow", type: "Power" },
    ],
  },
  {
    id: 2,
    question: "You hit a plateau. What’s your first move?",
    options: [
      { text: "Work with friends to create momentum", type: "Affiliation" },
      { text: "Adjust systems and track metrics tighter", type: "Achievement" },
      { text: "Switch things up—new modality or bold event", type: "Adventure" },
      { text: "Hire a coach or consultant to direct and guide me", type: "Power" },
      { text: "Improve sleep, recovery, and consistency", type: "Security" },
    ],
  },
  {
    id: 3,
    question: "On a rest day, what still feels satisfying?",
    options: [
      { text: "Making spontaneous plans or going on an adventure", type: "Adventure" },
      { text: "Review and planning", type: "Achievement" },
      { text: "Catching up with friends and community", type: "Affiliation" },
      { text: "Making sure I have everything ready for the week", type: "Security" },
      { text: "Organizing a group challenge/event for the week", type: "Power" },
    ],
  },
  {
    id: 4,
    question: "What kind of progress excites you the most?",
    options: [
      { text: "Being someone people want to follow", type: "Power" },
      { text: "Epic experiences and unique challenges", type: "Adventure" },
      { text: "Measurable achievements", type: "Achievement" },
      { text: "Stronger bonds with the people I care about", type: "Affiliation" },
      { text: "Steady habits and few failures", type: "Security" },
    ],
  },
  {
    id: 5,
    question: "How do you want to be remembered?",
    options: [
      { text: "As someone who lived boldly, took risks, and never settled.", type: "Adventure" },
      { text: "As someone dependable — steady, grounded, and trustworthy.", type: "Security" },
      { text: "As someone who always raised the standard and achieved excellence.", type: "Achievement" },
      { text: "As a loyal friend who brought people together and made them stronger.", type: "Affiliation" },
      { text: "As a leader who inspired others to become their best.", type: "Power" },
    ],
  },
  {
    id: 6,
    question: "You've got 12 weeks to focus. What would make the journey most worth it for you?",
    options: [
      { text: "Crossing off a bold, bucket-list style challenge", type: "Adventure" },
      { text: "Locking in a routine I can stick to without burning out", type: "Security" },
      { text: "Taking charge and leading a group to success", type: "Power" },
      { text: "Beating my personal best and proving I’ve leveled up", type: "Achievement" },
      { text: "Crushing a goal side-by-side with close friends", type: "Affiliation" },
    ],
  },
  {
    id: 7,
    question: "You’ve fallen off track. What’s most likely to get you back up?",
    options: [
      { text: "Doing something fresh or adventurous to spark energy", type: "Adventure" },
      { text: "Reconnecting with a friend for accountability", type: "Affiliation" },
      { text: "Knowing others are watching and following", type: "Power" },
      { text: "Resetting my routine so I feel grounded again", type: "Security" },
      { text: "Reminding myself of the bigger goal I’m chasing", type: "Achievement" },
    ],
  },
  {
    id: 8,
    question: "Your favorite kind of training is…",
    options: [
      { text: "Controlled: low risk, purposeful progression", type: "Security" },
      { text: "Exploratory: new places and mixed training", type: "Adventure" },
      { text: "Leading: leading a group workout", type: "Power" },
      { text: "Focused: technique, pacing, measurable sets", type: "Achievement" },
      { text: "Social: working out with a training partner", type: "Affiliation" },
    ],
  },
  {
    id: 9,
    question: "Which compliment would mean the most to you?",
    options: [
      { text: "“You’re fearless — always up for any challenge.”", type: "Adventure" },
      { text: "“You made serious, measurable progress.”", type: "Achievement" },
      { text: "“You always lift up everyone around you.”", type: "Affiliation" },
      { text: "“You’re consistent and resilient.”", type: "Security" },
      { text: "“You inspired me to work harder.”", type: "Power" },
    ],
  },
  {
    id: 10,
    question: "Ten weeks in on a program, you’d be most proud of…",
    options: [
      { text: "A routine that fits my life and lasts", type: "Security" },
      { text: "Deeper bonds with the brothers I train with", type: "Affiliation" },
      { text: "A story worth telling about an epic challenge", type: "Adventure" },
      { text: "A result I can point to: faster, stronger, leaner", type: "Achievement" },
      { text: "A reputation as a man others follow", type: "Power" },
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

  const getTopResult = (): keyof Scores => {
    const entries = Object.entries(scores) as [keyof Scores, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const [topType] = entries[0] || ["Achievement", 0];
    return topType;
  };

  const resultType = getTopResult();

  return (
    <section className="container" style={{ textAlign: "center" }}>
      {!finished ? (
        <>
          <h2 style={{ marginBottom: "1rem", color: "#e63946" }}>
            Q{step + 1} of {QUESTIONS.length}
          </h2>

          <div className="card" style={{ minHeight: "65vh", padding: "2rem" }}>
            <h2>{current.question}</h2>

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
        <div className="card" style={{ minHeight: "60vh", padding: "2rem" }}>
          <h2>Your motivation type is:</h2>
          <h1 style={{ color: "#e63946", margin: "1.25rem 0", fontSize: "2.5rem" }}>
            {resultType}
          </h1>

          <p style={{ marginTop: "0.5rem" }}>
            To see the <strong>strengths and challenges</strong> of the{" "}
            <strong>{resultType}</strong> type, enter your details below and we’ll send you a
            detailed report on how to maximize your strengths, overcome weaknesses, and dominate
            your goals.
          </p>

          <p style={{ fontWeight: 500, marginTop: "0.5rem" }}>
            Plus, get a <strong>free 10-Day Workout Challenge</strong>.
          </p>

          {/* ---------- Mailchimp ---------- */}
          {(() => {
            const TAGS_BY_TYPE: Record<keyof Scores, string> = {
              Achievement: "3553809,3553647,3553787",
              Power: "3553647,3553787,3553810",
              Affiliation: "3553811,3553647,3553787",
              Security: "3553647,3553787,3553812",
              Adventure: "3553813,3553647,3553787",
            };

            const sourcePath =
              typeof window !== "undefined" ? window.location.pathname : "/test";
            const originUrl =
              typeof window !== "undefined" ? window.location.href : "";

            return (
              <form
                action="https://undefeatedmen.us7.list-manage.com/subscribe/post?u=a8d1a9f39dde15bd94349588e&id=0009a53116&f_id=0027dde0f0"
                method="post"
                target="_blank"
                noValidate
                className="card mc-form"
              >
                <input type="hidden" name="RESULT_TYPE" value={resultType} />
                <input type="hidden" name="SOURCE" value={`men-result:${sourcePath}`} />
                <input type="hidden" name="ORIGIN_URL" value={originUrl} />
                <input type="hidden" name="tags" value={TAGS_BY_TYPE[resultType]} />

                <div className="mc-group">
                  <label htmlFor="mce-EMAIL">Email Address *</label>
                  <input
                    id="mce-EMAIL"
                    name="EMAIL"
                    type="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mc-row">
                  <div className="mc-group">
                    <label htmlFor="mce-FNAME">First Name *</label>
                    <input
                      id="mce-FNAME"
                      name="FNAME"
                      type="text"
                      required
                      placeholder="First name"
                    />
                  </div>
                  <div className="mc-group">
                    <label htmlFor="mce-LNAME">Last Name *</label>
                    <input
                      id="mce-LNAME"
                      name="LNAME"
                      type="text"
                      required
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="mc-group">
                  <label htmlFor="mce-PHONE">Phone Number (optional)</label>
                  <input id="mce-PHONE" name="PHONE" type="text" placeholder="(optional)" />
                </div>

                <div
                  style={{ position: "absolute", left: -5000 }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_a8d1a9f39dde15bd94349588e_0009a53116"
                    tabIndex={-1}
                    defaultValue=""
                  />
                </div>

                <div className="mc-actions">
                  <button type="submit">Send My Free Report</button>
                </div>
              </form>
            );
          })()}
          {/* ---------- /Mailchimp ---------- */}

          <Link href="/" style={{ marginTop: "1rem" }}>
            <button>← Back to Home</button>
          </Link>
        </div>
      )}
    </section>
  );
}