"use client";
import { useEffect } from "react";

export default function MailchimpForm({ resultType }: { resultType?: string }) {
  useEffect(() => {
    // Load Mailchimp validation script
    const script = document.createElement("script");
    script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ Dynamic tag mapping by result type
  const tagByType: Record<string, string> = {
    Achievement: "3553809,3553647,3553787",
    Power: "3553810,3553647,3553787",
    Affiliation: "3553811,3553647,3553787",
    Security: "3553812,3553647,3553787",
    Adventure: "3553813,3553647,3553787",
  };

  const tags = resultType ? tagByType[resultType] || "3553647,3553787" : "3553647,3553787";

  return (
    <div id="mc_embed_signup" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <form
        action="https://undefeatedmen.us7.list-manage.com/subscribe/post?u=a8d1a9f39dde15bd94349588e&id=0009a53116&f_id=0027dde0f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
        noValidate
      >
        <h2>Subscribe</h2>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          Join the Undefeated list for updates and new resources.
        </p>

        {/* Visible fields */}
        <div className="mc-field-group">
          <label htmlFor="mce-FNAME">First Name *</label>
          <input type="text" name="FNAME" id="mce-FNAME" required />
        </div>

        <div className="mc-field-group">
          <label htmlFor="mce-LNAME">Last Name *</label>
          <input type="text" name="LNAME" id="mce-LNAME" required />
        </div>

        <div className="mc-field-group">
          <label htmlFor="mce-EMAIL">Email Address *</label>
          <input type="email" name="EMAIL" id="mce-EMAIL" required />
        </div>

        <div className="mc-field-group">
          <label htmlFor="mce-PHONE">Phone Number</label>
          <input type="text" name="PHONE" id="mce-PHONE" />
        </div>

        {/* ✅ Hidden dynamic fields */}
        {resultType && <input type="hidden" name="RESULT_TYPE" value={resultType} />}
        <input
          type="hidden"
          name="SOURCE_PATH"
          value={typeof window !== "undefined" ? window.location.pathname : "/"}
        />
        <input type="hidden" name="SOURCE_TEST" value="Mens Motivation Quiz" />
        <input type="hidden" name="tags" value={tags} />

        {/* Anti-bot honeypot */}
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input
            type="text"
            name="b_a8d1a9f39dde15bd94349588e_0009a53116"
            tabIndex={-1}
            defaultValue=""
          />
        </div>

        {/* Submit */}
        <div style={{ marginTop: "1rem" }}>
          <input
            type="submit"
            name="subscribe"
            id="mc-embedded-subscribe"
            className="button"
            value="Subscribe"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          />
        </div>
      </form>
    </div>
  );
}