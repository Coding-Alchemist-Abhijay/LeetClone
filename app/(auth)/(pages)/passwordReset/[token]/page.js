"use client";

import { useState } from "react";
import { toast } from "react-hot-toast"; 

export default function PasswordResetPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // get the token param from the URL
  if (typeof window !== "undefined") {
    var url = new URL(window.location.href);
    var token = url.pathname.split("/").pop();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/users/verify-new-password/" + token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, repassword: confirmPassword }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        toast.success("Password reset successful!");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        const data = await res.json();
        const errorMessage = Array.isArray(data.errors) 
          ? data.errors.join(", ") 
          : data.errors || data.message || "Failed to reset password.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          width: 420,
          borderRadius: 12,
          boxShadow: "0 2px 16px 0 rgba(20,23,28,0.07)",
          padding: "40px 40px 32px 40px",
          border: "1px solid #f2f2f3",
          fontFamily:
            "system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#262626",
            letterSpacing: 0,
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          Reset Password
        </div>

        <div
          style={{
            fontSize: 15.5,
            color: "#7d8b99",
            marginBottom: 26,
            textAlign: "center",
          }}
        >
          Enter your new LeetClone password.
        </div>

        {error && (
          <div
            style={{
              background: "#fff6f7",
              border: "1px solid #f3bdbf",
              borderRadius: 8,
              color: "#b04d49",
              fontSize: 15,
              marginBottom: 18,
              padding: "11px 12px",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: "#e6fbf3",
              border: "1px solid #60cdac",
              borderRadius: 8,
              color: "#29875f",
              fontSize: 15,
              marginBottom: 18,
              padding: "11px 12px",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Your password has been reset successfully!
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 15.6,
              color: "#38434f",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            New Password
          </div>
          <input
            type="password"
            value={password}
            disabled={submitting || success}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            style={{
              width: "100%",
              fontSize: 16,
              background: "#fafbfc",
              border: "1px solid #d2d6dc",
              borderRadius: 7,
              outline: "none",
              padding: "12px 13px",
              marginBottom: 0,
              color: "#262626",
              fontWeight: 500,
              transition: "border .18s",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 15.6,
              color: "#38434f",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Retype New Password
          </div>
          <input
            type="password"
            value={confirmPassword}
            disabled={submitting || success}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Retype new password"
            style={{
              width: "100%",
              fontSize: 16,
              background: "#fafbfc",
              border: "1px solid #d2d6dc",
              borderRadius: 7,
              outline: "none",
              padding: "12px 13px",
              marginBottom: 0,
              color: "#262626",
              fontWeight: 500,
              transition: "border .18s",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || success}
          style={{
            width: "100%",
            background:
              "linear-gradient(90deg,#6adc91,#42b882 67.19%,#29a873)",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontWeight: 700,
            fontSize: 16,
            padding: "13px 0",
            marginTop: 8,
            boxShadow: "0 1.5px 5px 0 rgba(64,112,71,0.06)",
            cursor: submitting || success ? "not-allowed" : "pointer",
            opacity: submitting || success ? 0.6 : 1,
            transition: "background .2s, opacity .2s",
          }}
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}