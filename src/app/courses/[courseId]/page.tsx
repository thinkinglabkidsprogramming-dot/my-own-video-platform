import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters, courses, lessons, userProgress } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  if (!course) notFound();

  const courseChapters = await db.query.chapters.findMany({
    where: eq(chapters.courseId, courseId),
    orderBy: asc(chapters.orderIndex),
    with: {
      lessons: {
        orderBy: asc(lessons.orderIndex),
      },
    },
  });

  const session = await auth.api.getSession({ headers: await headers() });

  let completedLessonIds = new Set<string>();
  if (session) {
    const allLessonIds = courseChapters.flatMap((c) =>
      c.lessons.map((l) => l.id)
    );
    if (allLessonIds.length > 0) {
      const progress = await db.query.userProgress.findMany({
        where: and(
          eq(userProgress.userId, session.user.id),
          eq(userProgress.isCompleted, true)
        ),
      });
      completedLessonIds = new Set(
        progress
          .filter((p) => allLessonIds.includes(p.lessonId))
          .map((p) => p.lessonId)
      );
    }
  }

  const totalLessons = courseChapters.reduce(
    (sum, c) => sum + c.lessons.length,
    0
  );
  const completedCount = completedLessonIds.size;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← コース一覧に戻る
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        {course.thumbnailPath && (
          <div className="relative aspect-video">
            <Image
              src={course.thumbnailPath}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-gray-600 mb-4">{course.description}</p>
          )}
          {totalLessons > 0 && (
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>進捗</span>
                <span>
                  {completedCount} / {totalLessons} レッスン完了
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.round((completedCount / totalLessons) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {courseChapters.map((chapter) => (
          <div key={chapter.id} className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">{chapter.title}</h2>
            </div>
            <ul>
              {chapter.lessons.map((lesson, index) => {
                const done = completedLessonIds.has(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition"
                    >
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          done
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {done ? "✓" : index + 1}
                      </span>
                      <span className="text-gray-700 text-sm">
                        {lesson.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
