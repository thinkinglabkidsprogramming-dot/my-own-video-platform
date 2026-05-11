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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">コース一覧</h1>
      {allCourses.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          まだコースがありません
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
