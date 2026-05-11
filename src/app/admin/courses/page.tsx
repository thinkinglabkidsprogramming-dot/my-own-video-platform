import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const allCourses = await db
    .select()
    .from(courses)
    .orderBy(asc(courses.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">コース管理</h1>
        <Link
          href="/admin/courses/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + 新規コース
        </Link>
      </div>
      {allCourses.length === 0 ? (
        <p className="text-gray-500">コースがまだありません</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  タイトル
                </th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">
                  作成日
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {allCourses.map((course) => (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString("ja-JP")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      編集
                    </Link>
                    <Link
                      href={`/admin/courses/${course.id}/chapters`}
                      className="text-gray-600 hover:underline"
                    >
                      カリキュラム
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
