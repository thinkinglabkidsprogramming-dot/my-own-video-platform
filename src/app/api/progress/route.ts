import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  const progress = await db.query.userProgress.findMany({
    where: eq(userProgress.userId, session.user.id),
    with: {
      lesson: {
        with: {
          chapter: true,
        },
      },
    },
  });

  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { lessonId, isCompleted } = body;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonIdは必須です" }, { status: 400 });
  }

  const existing = await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, session.user.id),
      eq(userProgress.lessonId, lessonId)
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(userProgress)
      .set({
        isCompleted: isCompleted ?? true,
        completedAt: isCompleted ? new Date() : null,
      })
      .where(eq(userProgress.id, existing.id))
      .returning();
    return NextResponse.json(updated);
  }

  const [created] = await db
    .insert(userProgress)
    .values({
      userId: session.user.id,
      lessonId,
      isCompleted: isCompleted ?? true,
      completedAt: isCompleted ? new Date() : null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
