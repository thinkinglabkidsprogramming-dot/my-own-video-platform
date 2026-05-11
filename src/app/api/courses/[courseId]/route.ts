import { db } from "@/lib/db";
import { chapters, courses, lessons } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  if (!course) {
    return NextResponse.json({ error: "コースが見つかりません" }, { status: 404 });
  }

  const courseChapters = await db.query.chapters.findMany({
    where: eq(chapters.courseId, courseId),
    orderBy: asc(chapters.orderIndex),
    with: {
      lessons: {
        orderBy: asc(lessons.orderIndex),
      },
    },
  });

  return NextResponse.json({ ...course, chapters: courseChapters });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const body = await request.json();
  const { title, description, thumbnailPath } = body;

  const [updated] = await db
    .update(courses)
    .set({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(thumbnailPath !== undefined && { thumbnailPath }),
      updatedAt: new Date(),
    })
    .where(eq(courses.id, courseId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "コースが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  await db.delete(courses).where(eq(courses.id, courseId));

  return NextResponse.json({ success: true });
}
