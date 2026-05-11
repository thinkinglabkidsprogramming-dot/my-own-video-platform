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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          style={{ color: "var(--muted)", fontSize: "0.875rem" }}
          className="hover:[color:var(--accent)] transition-colors"
        >
          ← コース一覧に戻る
        </Link>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
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
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              color: "var(--text)",
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            {course.title}
          </h1>
          {course.description && (
            <p style={{ color: "var(--muted)", marginBottom: "1rem", fontSize: "0.95rem" }}>
              {course.description}
            </p>
          )}
          {totalLessons > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-1.5" style={{ color: "var(--muted)" }}>
                <span>進捗</span>
                <span>{completedCount} / {totalLessons} レッスン完了</span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: "var(--border)" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.round((completedCount / totalLessons) * 100)}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {courseChapters.map((chapter) => (
          <div
            key={chapter.id}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
          >
            <div
              className="px-5 py-3.5"
              style={{
                borderBottom: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  color: "var(--text)",
                  fontSize: "0.95rem",
                }}
              >
                {chapter.title}
              </h2>
            </div>
            <ul>
              {chapter.lessons.map((lesson, index) => {
                const done = completedLessonIds.has(lesson.id);
                return (
                  <li key={lesson.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <Link
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:[background:var(--surface)]"
                      style={{ color: "var(--text)" }}
                    >
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                        style={{
                          background: done ? "var(--accent)" : "transparent",
                          borderColor: done ? "var(--accent)" : "var(--border)",
                          color: done ? "#0b0a12" : "var(--muted)",
                        }}
                      >
                        {done ? "✓" : index + 1}
                      </span>
                      <span className="text-sm">{lesson.title}</span>
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
