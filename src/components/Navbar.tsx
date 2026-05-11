"use client";

import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav
      style={{ background: "var(--nav-bg)" }}
      className="px-6 py-4 flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-3">
        <div style={{
          background: "var(--accent)",
          width: "2rem",
          height: "2rem",
          borderRadius: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.882V19a1 1 0 01-1.447.894L15 18M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          color: "#ffffff",
          fontSize: "1.1rem",
          letterSpacing: "-0.01em",
        }}>
          動画講座
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {session ? (
          <>
            {session.user.role === "admin" && (
              <Link href="/admin" style={{ color: "var(--nav-text)", fontSize: "0.875rem", fontWeight: 600 }}
                className="hover:text-white transition-colors">
                管理画面
              </Link>
            )}
            <span style={{ color: "var(--nav-text)", fontSize: "0.875rem" }}>
              {session.user.name}
            </span>
            <button onClick={handleSignOut}
              style={{ color: "var(--nav-text)", fontSize: "0.875rem", fontWeight: 600 }}
              className="hover:text-red-400 transition-colors">
              ログアウト
            </button>
          </>
        ) : (
          <Link href="/login" style={{
            background: "var(--accent)",
            color: "#ffffff",
            fontWeight: 700,
            padding: "0.45rem 1.2rem",
            borderRadius: "2rem",
            fontSize: "0.875rem",
          }}
            className="hover:opacity-90 transition-opacity">
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
}
