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

  const course = await db.query.courses.findFirst({ where: eq(courses.id, courseId) });
  if (!course) notFound();

  const courseChapters = await db.query.chapters.findMany({
    where: eq(chapters.courseId, courseId),
    orderBy: asc(chapters.orderIndex),
    with: { lessons: { orderBy: asc(lessons.orderIndex) } },
  });

  const session = await auth.api.getSession({ headers: await headers() });

  let completedLessonIds = new Set<string>();
  if (session) {
    const allLessonIds = courseChapters.flatMap((c) => c.lessons.map((l) => l.id));
    if (allLessonIds.length > 0) {
      const progress = await db.query.userProgress.findMany({
        where: and(eq(userProgress.userId, session.user.id), eq(userProgress.isCompleted, true)),
      });
      completedLessonIds = new Set(
        progress.filter((p) => allLessonIds.includes(p.lessonId)).map((p) => p.lessonId)
      );
    }
  }

  const totalLessons = courseChapters.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedCount = completedLessonIds.size;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: 600 }}
          className="hover:[color:var(--accent)] transition-colors">
          ← コース一覧に戻る
        </Link>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden", marginBottom: "2rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        {course.thumbnailPath && (
          <div className="relative" style={{ aspectRatio: "16/7" }}>
            <Image src={course.thumbnailPath} alt={course.title} fill className="object-cover" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 60%)" }} />
          </div>
        )}
        <div className="p-7">
          <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, color: "var(--text)", fontSize: "2rem", lineHeight: 1.2, marginBottom: "0.6rem" }}>
            {course.title}
          </h1>
          {course.description && (
            <p style={{ color: "var(--muted)", marginBottom: "1.25rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
              {course.description}
            </p>
          )}
          {totalLessons > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2" style={{ color: "var(--muted)", fontWeight: 600 }}>
                <span>学習進捗</span>
                <span style={{ color: "var(--accent)" }}>{completedCount} / {totalLessons} 完了</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
                <div className="h-2 rounded-full transition-all"
                  style={{ width: `${Math.round((completedCount / totalLessons) * 100)}%`, background: "var(--accent)" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, fontSize: "1.4rem", color: "var(--text)", marginBottom: "1rem" }}>
        カリキュラム
      </h2>

      <div className="space-y-3">
        {courseChapters.map((chapter, ci) => (
          <div key={chapter.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.875rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <span style={{ background: "var(--tag-bg)", color: "var(--accent)", fontWeight: 700, fontSize: "0.75rem", padding: "0.15rem 0.6rem", borderRadius: "2rem" }}>
                {ci + 1}
              </span>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>
                {chapter.title}
              </h3>
            </div>
            <ul>
              {chapter.lessons.map((lesson, index) => {
                const done = completedLessonIds.has(lesson.id);
                return (
                  <li key={lesson.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <Link href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#faf9f6]"
                      style={{ color: "var(--text)" }}>
                      <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: done ? "var(--accent)" : "var(--bg)",
                          border: done ? "none" : "1.5px solid var(--border)",
                          color: done ? "#ffffff" : "var(--muted)",
                        }}>
                        {done ? "✓" : index + 1}
                      </span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{lesson.title}</span>
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
