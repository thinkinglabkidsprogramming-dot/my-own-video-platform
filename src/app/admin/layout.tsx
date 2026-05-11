import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-900 text-gray-200 flex flex-col p-4">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          管理画面
        </p>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-lg hover:bg-gray-700 text-sm transition"
          >
            ダッシュボード
          </Link>
          <Link
            href="/admin/courses"
            className="block px-3 py-2 rounded-lg hover:bg-gray-700 text-sm transition"
          >
            コース管理
          </Link>
        </nav>
        <div className="mt-auto">
          <Link
            href="/"
            className="block px-3 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            ← サイトに戻る
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
