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
          className={`px-6 py-2 rounded-lg font-medium transition ${
            completed
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } disabled:opacity-50`}
        >
          {loading
            ? "更新中..."
            : completed
              ? "✓ 完了済み（クリックで取り消し）"
              : "完了済みにする"}
        </button>
      ) : (
        <p className="text-sm text-gray-500">
          進捗を記録するには
          <a href="/login" className="text-blue-600 hover:underline mx-1">
            ログイン
          </a>
          してください
        </p>
      )}
    </div>
  );
}
