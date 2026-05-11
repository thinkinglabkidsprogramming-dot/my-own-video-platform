import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;

  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });

  if (!lesson) {
    return NextResponse.json(
      { error: "レッスンが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(lesson);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const body = await request.json();
  const { title, youtubeVideoId, durationSeconds, orderIndex } = body;

  const [updated] = await db
    .update(lessons)
    .set({
      ...(title && { title }),
      ...(youtubeVideoId && { youtubeVideoId }),
      ...(durationSeconds !== undefined && { durationSeconds }),
      ...(orderIndex !== undefined && { orderIndex }),
    })
    .where(eq(lessons.id, lessonId))
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "レッスンが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  await db.delete(lessons).where(eq(lessons.id, lessonId));
  return NextResponse.json({ success: true });
}
