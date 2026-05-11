"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      <div className="hidden lg:flex flex-1 items-center justify-center"
        style={{ background: "var(--nav-bg)" }}>
        <div className="text-center px-12">
          <div style={{
            background: "var(--accent)",
            width: "4rem", height: "4rem",
            borderRadius: "1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.882V19a1 1 0 01-1.447.894L15 18M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            color: "#ffffff",
            fontSize: "2rem",
            lineHeight: 1.3,
            marginBottom: "1rem",
          }}>
            動画で学ぶ、<br />楽しいプログラミング
          </p>
          <p style={{ color: "var(--nav-text)", fontSize: "0.95rem" }}>
            動画講座で、いつでもどこでも学習できます
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <p style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              color: "var(--text)",
              fontSize: "1.75rem",
            }}>
              動画講座
            </p>
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            color: "var(--text)",
            fontSize: "1.75rem",
            marginBottom: "0.5rem",
          }}>
            ログイン
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            アカウントにログインして学習を始めよう
          </p>

          <button onClick={handleGoogleLogin} disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              background: loading ? "var(--border)" : "var(--accent)",
              color: "#ffffff",
              fontWeight: 700,
              padding: "0.85rem 1.25rem",
              borderRadius: "0.75rem",
              fontSize: "0.95rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 14px rgba(224,92,58,0.35)",
            }}
            className="hover:opacity-90">
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="rgba(255,255,255,0.9)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="rgba(255,255,255,0.7)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? "接続中..." : "Googleでログイン"}
          </button>
        </div>
      </div>
    </div>
  );
}
