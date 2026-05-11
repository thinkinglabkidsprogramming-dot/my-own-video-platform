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
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      className="px-6 py-4 flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-2">
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            color: "var(--accent)",
            fontSize: "1.2rem",
            letterSpacing: "-0.02em",
          }}
        >
          動画講座
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {session ? (
          <>
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: 500 }}
                className="hover:[color:var(--accent)] transition-colors"
              >
                管理画面
              </Link>
            )}
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              {session.user.name}
            </span>
            <button
              onClick={handleSignOut}
              style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: 500 }}
              className="hover:text-red-500 transition-colors"
            >
              ログアウト
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              background: "var(--accent)",
              color: "#ffffff",
              fontWeight: 600,
              padding: "0.4rem 1.1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
}
