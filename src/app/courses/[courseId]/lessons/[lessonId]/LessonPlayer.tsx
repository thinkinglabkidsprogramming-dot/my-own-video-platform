"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  videoId: string;
  lessonId: string;
  title: string;
  isCompleted: boolean;
  isLoggedIn: boolean;
};

export default function LessonPlayer({
  videoId,
  lessonId,
  title,
  isCompleted,
  isLoggedIn,
}: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

  async function toggleComplete() {
    if (!isLoggedIn) return;
    setLoading(true);

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, isCompleted: !completed }),
    });

    setCompleted(!completed);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <VideoPlayer videoId={videoId} title={title} />
      {isLoggedIn ? (
        <button
          onClick={toggleComplete}
          disabled={loading}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
            background: completed ? "rgba(74,222,128,0.15)" : "var(--accent)",
            color: completed ? "var(--success)" : "#0b0a12",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading
            ? "更新中..."
            : completed
              ? "✓ 完了済み（クリックで取り消し）"
              : "完了済みにする"}
        </button>
      ) : (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          進捗を記録するには
          <a
            href="/login"
            style={{ color: "var(--accent)", margin: "0 0.25rem" }}
            className="hover:underline"
          >
            ログイン
          </a>
          してください
        </p>
      )}
    </div>
  );
}
