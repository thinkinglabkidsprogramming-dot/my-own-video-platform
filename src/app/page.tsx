import CourseCard from "@/components/CourseCard";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCourses = await db
    .select()
    .from(courses)
    .orderBy(asc(courses.createdAt));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            color: "var(--text)",
            fontSize: "2rem",
            letterSpacing: "-0.03em",
          }}
        >
          コース一覧
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "0.5rem", fontSize: "0.95rem" }}>
          動画でプログラミングを学ぼう
        </p>
      </div>

      {allCourses.length === 0 ? (
        <div
          className="text-center py-24 rounded-xl"
          style={{ border: "1px dashed var(--border)", color: "var(--muted)" }}
        >
          まだコースがありません
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              thumbnailPath={course.thumbnailPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
