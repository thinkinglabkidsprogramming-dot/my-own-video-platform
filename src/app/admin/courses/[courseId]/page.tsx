"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string | null;
  thumbnailPath: string | null;
};

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setPreview(data.thumbnailPath);
      });
  }, [courseId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    let thumbnailPath = course?.thumbnailPath ?? null;

    if (thumbnailFile) {
      const form = new FormData();
      form.append("file", thumbnailFile);
      const res = await fetch("/api/upload/thumbnail", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        setError("サムネイルのアップロードに失敗しました");
        setLoading(false);
        return;
      }
      const data = await res.json();
      thumbnailPath = data.path;
    }

    const res = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, thumbnailPath }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "更新に失敗しました");
    } else {
      router.push("/admin/courses");
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("このコースを削除しますか？")) return;
    await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    router.push("/admin/courses");
  }

  if (!course) return <p className="text-gray-500">読み込み中...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">コース編集</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            サムネイル画像
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {preview && (
            <img
              src={preview}
              alt="プレビュー"
              className="mt-2 rounded-lg w-full aspect-video object-cover"
            />
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "更新中..." : "保存"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/courses/${courseId}/chapters`)}
            className="px-6 py-2 rounded-lg border hover:bg-gray-50 text-gray-700"
          >
            カリキュラム編集
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 ml-auto"
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
}
