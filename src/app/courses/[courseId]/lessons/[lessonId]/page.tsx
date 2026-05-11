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
            style={{ color: "var(--muted)", fontSize: "0.875rem" }}
            className="hover:text-[var(--accent)] transition-colors"
          >
            ← コース詳細に戻る
          </Link>
        </div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            color: "var(--text)",
            fontSize: "1.25rem",
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          {lesson.title}
        </h1>
        <LessonPlayer
          videoId={lesson.youtubeVideoId}
          lessonId={lessonId}
          title={lesson.title}
          isCompleted={isCompleted}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <div
          className="sticky top-4 overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
          }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <p
              className="text-sm truncate"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              {lesson.chapter.course.title}
            </p>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            {courseChapters.map((chapter) => (
              <div key={chapter.id}>
                <div
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                  style={{
                    background: "var(--surface)",
                    color: "var(--muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {chapter.title}
                </div>
                <ul>
                  {chapter.lessons.map((l) => {
                    const done = completedLessonIds.has(l.id);
                    const active = l.id === lessonId;
                    return (
                      <li key={l.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <Link
                          href={`/courses/${courseId}/lessons/${l.id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{
                            background: active ? "rgba(232,184,75,0.1)" : "transparent",
                            color: active ? "var(--accent)" : "var(--muted)",
                            fontWeight: active ? 600 : 400,
                          }}
                        >
                          <span
                            className="flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[10px]"
                            style={{
                              background: done ? "var(--accent)" : "transparent",
                              borderColor: done ? "var(--accent)" : "var(--border)",
                              color: done ? "#0b0a12" : "var(--border)",
                            }}
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
