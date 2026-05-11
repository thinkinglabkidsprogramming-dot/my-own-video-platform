import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [courseCount] = await db.select({ count: count() }).from(courses);
  const [lessonCount] = await db.select({ count: count() }).from(lessons);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">コース数</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {courseCount.count}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">レッスン数</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {lessonCount.count}
          </p>
        </div>
      </div>
      <Link
        href="/admin/courses/new"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
      >
        + 新規コース作成
      </Link>
    </div>
  );
}
