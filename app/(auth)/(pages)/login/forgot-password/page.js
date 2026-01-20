"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/users/passwordReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "If this email exists, you will receive a password reset link.");
      } else {
        setError(data.errors ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fafbfc",
    }}>
      <div style={{
        background: "#fff",
        width: 400,
        borderRadius: 12,
        boxShadow: "0 3px 24px rgba(0,0,0,0.07)",
        padding: "36px 40px 32px 40px",
        border: "1px solid #f2f2f2",
      }}>
        <div style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#262626",
          marginBottom: 22,
          letterSpacing: 0,
        }}>
          Password Reset
        </div>
        <div style={{
          background: "#fffbdd",
          border: "1px solid #ffe58f",
          borderRadius: 8,
          color: "#594214",
          fontSize: 15.5,
          padding: "16px 18px",
          marginBottom: 24,
          lineHeight: 1.6,
        }}>
          Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.
        </div>
        <form onSubmit={handleSubmit}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            placeholder="E-mail address"
            required
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              fontSize: 16,
              borderRadius: 8,
              border: "1.5px solid #e4e6e8",
              marginBottom: 16,
              background: "#f6f8fa",
              color: "#262626",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color .2s"
            }}
            onFocus={e => e.target.style.borderColor="#b6c2cb"}
            onBlur={e => e.target.style.borderColor="#e4e6e8"}
          />
          <button
            type="submit"
            disabled={submitting || !email}
            style={{
              width: "100%",
              background: "#21ba45",
              color: "white",
              fontWeight: 600,
              fontSize: 16.2,
              padding: "12px 0",
              border: "none",
              borderRadius: 8,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginBottom: 6,
              marginTop: 4,
            }}
          >
            {submitting ? "Sending..." : "Reset My Password"}
          </button>
          <div style={{ minHeight: 28 }}>
            {message && <p style={{ color: "#21ba45", fontSize: 14, textAlign: "center", margin: 0 }}>{message}</p>}
            {error && <p style={{ color: "#db2828", fontSize: 14, textAlign: "center", margin: 0 }}>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}