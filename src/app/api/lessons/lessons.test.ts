import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([
      {
        id: "lesson-id",
        chapterId: "chapter-id",
        title: "テストレッスン",
        youtubeVideoId: "dQw4w9WgXcQ",
        orderIndex: 0,
      },
    ]),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  lessons: {},
}));

describe("POST /api/lessons バリデーション", () => {
  it("chapterIdが欠けている場合は400を返す", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "レッスン", youtubeVideoId: "abc" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("titleが欠けている場合は400を返す", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId: "chapter-id", youtubeVideoId: "abc" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("youtubeVideoIdが欠けている場合は400を返す", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId: "chapter-id", title: "レッスン" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("必須項目がすべてある場合は201を返す", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId: "chapter-id",
        title: "テストレッスン",
        youtubeVideoId: "dQw4w9WgXcQ",
      }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.youtubeVideoId).toBe("dQw4w9WgXcQ");
  });
});
