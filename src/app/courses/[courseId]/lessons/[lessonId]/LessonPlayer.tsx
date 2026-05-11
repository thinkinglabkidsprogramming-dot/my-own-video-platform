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

export default function LessonPlayer({ videoId, lessonId, title, isCompleted, isLoggedIn }: Props) {
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
    <div className="space-y-5">
      <VideoPlayer videoId={videoId} title={title} />
      {isLoggedIn ? (
        <button onClick={toggleComplete} disabled={loading}
          style={{
            padding: "0.6rem 1.75rem",
            borderRadius: "2rem",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: loading ? 0.6 : 1,
            background: completed ? "#d1fae5" : "var(--accent)",
            color: completed ? "#065f46" : "#ffffff",
            border: completed ? "1.5px solid #6ee7b7" : "none",
            boxShadow: completed ? "none" : "0 4px 14px rgba(224,92,58,0.3)",
          }}>
          {loading ? "更新中..." : completed ? "✓ 完了済み（クリックで取り消し）" : "完了済みにする"}
        </button>
      ) : (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          進捗を記録するには
          <a href="/login" style={{ color: "var(--accent)", margin: "0 0.25rem", fontWeight: 600 }}
            className="hover:underline">ログイン</a>
          してください
        </p>
      )}
    </div>
  );
}
