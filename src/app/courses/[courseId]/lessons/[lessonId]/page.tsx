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
    with: { chapter: { with: { course: true } } },
  });
  if (!lesson) notFound();

  const courseChapters = await db.query.chapters.findMany({
    where: eq(chapters.courseId, courseId),
    orderBy: asc(chapters.orderIndex),
    with: { lessons: { orderBy: asc(lessons.orderIndex) } },
  });

  const session = await auth.api.getSession({ headers: await headers() });

  let completedLessonIds = new Set<string>();
  if (session) {
    const progress = await db.query.userProgress.findMany({
      where: and(eq(userProgress.userId, session.user.id), eq(userProgress.isCompleted, true)),
    });
    completedLessonIds = new Set(progress.map((p) => p.lessonId));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <Link href={`/courses/${courseId}`}
            style={{ color: "var(--muted)", fontSize: "0.875rem", fontWeight: 600 }}
            className="hover:[color:var(--accent)] transition-colors">
            ← コース詳細に戻る
          </Link>
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontWeight: 400,
          color: "var(--text)",
          fontSize: "1.4rem",
          marginBottom: "1rem",
          lineHeight: 1.3,
        }}>
          {lesson.title}
        </h1>
        <LessonPlayer
          videoId={lesson.youtubeVideoId}
          lessonId={lessonId}
          title={lesson.title}
          isCompleted={completedLessonIds.has(lessonId)}
          isLoggedIn={!!session}
        />
      </div>

      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <div className="sticky top-4 overflow-hidden"
          style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--nav-bg)" }}>
            <p className="text-sm truncate" style={{ fontWeight: 700, color: "#ffffff", fontFamily: "'Nunito', sans-serif" }}>
              {lesson.chapter.course.title}
            </p>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            {courseChapters.map((chapter) => (
              <div key={chapter.id}>
                <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest"
                  style={{ background: "var(--bg)", color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {chapter.title}
                </div>
                <ul>
                  {chapter.lessons.map((l) => {
                    const done = completedLessonIds.has(l.id);
                    const active = l.id === lessonId;
                    return (
                      <li key={l.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <Link href={`/courses/${courseId}/lessons/${l.id}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-[#faf9f6]"
                          style={{
                            background: active ? "var(--tag-bg)" : "transparent",
                            color: active ? "var(--accent)" : "var(--muted)",
                            fontWeight: active ? 700 : 500,
                          }}>
                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                              background: done ? "var(--accent)" : "transparent",
                              border: done ? "none" : "1.5px solid var(--border)",
                              color: done ? "#ffffff" : "var(--border)",
                            }}>
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
