import CourseCard from "@/components/CourseCard";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCourses = await db.select().from(courses).orderBy(asc(courses.createdAt));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div style={{
          display: "inline-block",
          background: "var(--tag-bg)",
          color: "var(--tag-text)",
          fontSize: "0.75rem",
          fontWeight: 700,
          padding: "0.25rem 0.75rem",
          borderRadius: "2rem",
          marginBottom: "0.75rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          すべてのコース
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontWeight: 400,
          color: "var(--text)",
          fontSize: "2.5rem",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>
          動画で学ぼう
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "0.5rem", fontSize: "1rem" }}>
          プログラミングを動画講座でマスターしよう
        </p>
      </div>

      {allCourses.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ border: "2px dashed var(--border)", color: "var(--muted)" }}>
          まだコースがありません
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course) => (
            <CourseCard key={course.id} id={course.id} title={course.title}
              description={course.description} thumbnailPath={course.thumbnailPath} />
          ))}
        </div>
      )}
    </div>
  );
}
