"use client";

import { extractYoutubeId } from "@/lib/youtube";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Lesson = {
  id: string;
  title: string;
  youtubeVideoId: string;
  orderIndex: number;
};

type Chapter = {
  id: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
};

export default function ChaptersPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    const res = await fetch(`/api/courses/${courseId}`);
    const data = await res.json();
    setChapters(data.chapters ?? []);
  }

  useEffect(() => {
    fetchData();
  }, [courseId]);

  async function addChapter() {
    if (!newChapterTitle.trim()) return;
    setLoading(true);
    await fetch("/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        title: newChapterTitle,
        orderIndex: chapters.length,
      }),
    });
    setNewChapterTitle("");
    await fetchData();
    setLoading(false);
  }

  async function deleteChapter(chapterId: string) {
    if (!confirm("このチャプターを削除しますか？")) return;
    await fetch(`/api/chapters/${chapterId}`, { method: "DELETE" });
    await fetchData();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">カリキュラム編集</h1>

      <div className="space-y-4 mb-8">
        {chapters.map((chapter, ci) => (
          <ChapterSection
            key={chapter.id}
            chapter={chapter}
            chapterIndex={ci}
            onDelete={() => deleteChapter(chapter.id)}
            onRefresh={fetchData}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          チャプターを追加
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="チャプタータイトル"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addChapter()}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addChapter}
            disabled={loading || !newChapterTitle.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}

function ChapterSection({
  chapter,
  chapterIndex,
  onDelete,
  onRefresh,
}: {
  chapter: Chapter;
  chapterIndex: number;
  onDelete: () => void;
  onRefresh: () => void;
}) {
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonUrl, setLessonUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function addLesson() {
    if (!lessonTitle.trim() || !lessonUrl.trim()) return;
    setSaving(true);
    const youtubeVideoId = extractYoutubeId(lessonUrl.trim());
    await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId: chapter.id,
        title: lessonTitle,
        youtubeVideoId,
        orderIndex: chapter.lessons.length,
      }),
    });
    setLessonTitle("");
    setLessonUrl("");
    setShowAddLesson(false);
    setSaving(false);
    onRefresh();
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm("このレッスンを削除しますか？")) return;
    await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
    onRefresh();
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b">
        <h2 className="font-semibold text-gray-800 text-sm">
          第{chapterIndex + 1}章: {chapter.title}
        </h2>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-600 text-xs"
        >
          削除
        </button>
      </div>
      <ul>
        {chapter.lessons.map((lesson, li) => (
          <li
            key={lesson.id}
            className="flex items-center gap-3 px-5 py-3 border-b last:border-0"
          >
            <span className="text-xs text-gray-400 w-5">{li + 1}</span>
            <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
            <span className="text-xs text-gray-400 font-mono">
              {lesson.youtubeVideoId}
            </span>
            <button
              onClick={() => deleteLesson(lesson.id)}
              className="text-red-400 hover:text-red-600 text-xs"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3">
        {showAddLesson ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="レッスンタイトル"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="YouTube URL または動画ID"
              value={lessonUrl}
              onChange={(e) => setLessonUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={addLesson}
                disabled={saving || !lessonTitle.trim() || !lessonUrl.trim()}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {saving ? "追加中..." : "追加"}
              </button>
              <button
                onClick={() => setShowAddLesson(false)}
                className="px-4 py-1.5 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddLesson(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            + レッスンを追加
          </button>
        )}
      </div>
    </div>
  );
}
