import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters, courses, lessons, userProgress } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import LessonPlayer from "./LessonPlayer";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      chapter: {
        with: {
          course: true,
        },
      },
    },
  });

  if (!lesson) notFound();

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
    const progress = await db.query.userProgress.findMany({
      where: and(
        eq(userProgress.userId, session.user.id),
        eq(userProgress.isCompleted, true)
      ),
    });
    completedLessonIds = new Set(progress.map((p) => p.lessonId));
  }

  const isCompleted = completedLessonIds.has(lessonId);
  const isLoggedIn = !!session;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <Link
            href={`/courses/${courseId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← コース詳細に戻る
          </Link>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
        <LessonPlayer
          videoId={lesson.youtubeVideoId}
          lessonId={lessonId}
          title={lesson.title}
          isCompleted={isCompleted}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <div className="bg-white rounded-xl shadow overflow-hidden sticky top-4">
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm text-gray-800 truncate">
              {lesson.chapter.course.title}
            </p>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            {courseChapters.map((chapter) => (
              <div key={chapter.id}>
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {chapter.title}
                </div>
                <ul>
                  {chapter.lessons.map((l) => {
                    const done = completedLessonIds.has(l.id);
                    const active = l.id === lessonId;
                    return (
                      <li key={l.id}>
                        <Link
                          href={`/courses/${courseId}/lessons/${l.id}`}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm transition ${
                            active
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "hover:bg-gray-50 text-gray-600"
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              done
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {done ? "✓" : ""}
                          </span>
                          <span className="truncate">{l.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
