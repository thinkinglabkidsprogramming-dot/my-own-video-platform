import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { courseId, title, orderIndex } = body;

  if (!courseId || !title) {
    return NextResponse.json(
      { error: "courseIdとtitleは必須です" },
      { status: 400 }
    );
  }

  const [chapter] = await db
    .insert(chapters)
    .values({ courseId, title, orderIndex: orderIndex ?? 0 })
    .returning();

  return NextResponse.json(chapter, { status: 201 });
}
