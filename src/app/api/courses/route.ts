import { db } from "@/lib/db";
import { chapters, courses, lessons } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db
    .select()
    .from(courses)
    .orderBy(asc(courses.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, thumbnailPath } = body;

  if (!title) {
    return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
  }

  const [course] = await db
    .insert(courses)
    .values({ title, description, thumbnailPath })
    .returning();

  return NextResponse.json(course, { status: 201 });
}
