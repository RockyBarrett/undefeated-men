// app/guess-his/layout.tsx
import React from "react";
import "./guess-his.css"; // route-specific styling only for this page

export default function GuessHisLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="gh-page">
      <header className="gh-header">
        <div className="gh-badge">GH</div>
        <div className="gh-title-wrap">
          <h1 className="gh-title">Guess-His Quiz</h1>
          <p className="gh-sub">For wives: predict how he’d answer.</p>
        </div>
      </header>
      <main className="gh-main">{children}</main>
      <footer className="gh-footer">
        <p></p>
      </footer>
    </section>
  );
}