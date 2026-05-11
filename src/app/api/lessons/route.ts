import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { chapterId, title, youtubeVideoId, durationSeconds, orderIndex } =
    body;

  if (!chapterId || !title || !youtubeVideoId) {
    return NextResponse.json(
      { error: "chapterId、title、youtubeVideoIdは必須です" },
      { status: 400 }
    );
  }

  const [lesson] = await db
    .insert(lessons)
    .values({
      chapterId,
      title,
      youtubeVideoId,
      durationSeconds,
      orderIndex: orderIndex ?? 0,
    })
    .returning();

  return NextResponse.json(lesson, { status: 201 });
}
