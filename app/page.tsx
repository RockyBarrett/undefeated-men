// app/page.tsx
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <h1>Choose Your Quiz</h1>
        <p className="home-sub">
          Take the quiz yourself — or guess his type and compare results.
        </p>
      </section>

      <section className="home-grid">
        {/* Guess Husband (light blue) */}
        <Link href="/guess-his" className="home-card home-card--blue">
          <div className="home-card-body">
            <h2>Guess His</h2>
            <p>Predict his motivation style in 2–3 minutes, then send him his link to compare.</p>
            <span className="home-cta">Take the Guess Quiz →</span>
          </div>
        </Link>

        {/* Men’s Test (red) -> goes to the typewriter intro page */}
        <Link href="/men" className="home-card home-card--red">
          <div className="home-card-body">
            <h2>Men’s Quiz</h2>
            <p>Find your dominant motivation type and get next steps that fit how you’re wired.</p>
            <span className="home-cta">Open Men’s Quiz →</span>
          </div>
        </Link>
      </section>
    </main>
  );
}