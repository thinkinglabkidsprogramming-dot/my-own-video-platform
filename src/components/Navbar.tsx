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
      }}
      className="px-6 py-4 flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            color: "var(--accent)",
            fontSize: "1.2rem",
            letterSpacing: "-0.02em",
            transition: "opacity 0.2s",
          }}
          className="group-hover:opacity-80"
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
                style={{ color: "var(--muted)", fontSize: "0.875rem" }}
                className="hover:text-white transition-colors"
              >
                管理画面
              </Link>
            )}
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              {session.user.name}
            </span>
            <button
              onClick={handleSignOut}
              style={{ color: "var(--muted)", fontSize: "0.875rem" }}
              className="hover:text-red-400 transition-colors"
            >
              ログアウト
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              background: "var(--accent)",
              color: "#0b0a12",
              fontWeight: 600,
              padding: "0.4rem 1.1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              transition: "background 0.2s",
            }}
            className="hover:opacity-90"
          >
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
}
