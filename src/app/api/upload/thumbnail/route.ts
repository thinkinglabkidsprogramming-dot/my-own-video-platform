import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "JPEG、PNG、WebP形式のみ対応しています" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop();
  const filename = `thumbnails/${crypto.randomUUID()}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ path: blob.url });
}
