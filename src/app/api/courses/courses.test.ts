import { describe, expect, it, vi, beforeEach } from "vitest";

// DB をモック
vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([
      { id: "test-id", title: "テストコース", description: null, thumbnailPath: null },
    ]),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  courses: {},
}));

vi.mock("drizzle-orm", () => ({
  asc: vi.fn(),
}));

describe("POST /api/courses バリデーション", () => {
  it("titleが空の場合は400を返す", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("タイトルは必須です");
  });

  it("titleがある場合は201を返す", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "テストコース" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.title).toBe("テストコース");
  });
});
