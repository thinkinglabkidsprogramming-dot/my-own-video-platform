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
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-600">
        動画講座
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                管理画面
              </Link>
            )}
            <span className="text-sm text-gray-600">{session.user.name}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              ログアウト
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
          >
            ログイン
          </Link>
        )}
      </div>
    </nav>
  );
}
