import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await params;
  const body = await request.json();
  const { title, orderIndex } = body;

  const [updated] = await db
    .update(chapters)
    .set({
      ...(title && { title }),
      ...(orderIndex !== undefined && { orderIndex }),
    })
    .where(eq(chapters.id, chapterId))
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "チャプターが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await params;
  await db.delete(chapters).where(eq(chapters.id, chapterId));
  return NextResponse.json({ success: true });
}
