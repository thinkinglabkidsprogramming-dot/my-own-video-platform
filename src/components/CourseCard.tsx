import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  description: string | null;
  thumbnailPath: string | null;
  completedCount?: number;
  totalCount?: number;
};

export default function CourseCard({
  id,
  title,
  description,
  thumbnailPath,
  completedCount,
  totalCount,
}: Props) {
  const progress =
    totalCount && totalCount > 0
      ? Math.round((completedCount! / totalCount) * 100)
      : null;

  return (
    <Link href={`/courses/${id}`} className="block group">
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          transition: "box-shadow 0.2s, transform 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
        className="group-hover:shadow-lg group-hover:-translate-y-1"
      >
        <div className="relative aspect-video" style={{ background: "#f0eeea" }}>
          {thumbnailPath ? (
            <Image src={thumbnailPath} alt={title} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-sm" style={{ color: "var(--muted)" }}>
              サムネイルなし
            </div>
          )}
        </div>
        <div className="p-4">
          <h2
            className="line-clamp-2 group-hover:[color:var(--accent)]"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              color: "var(--text)",
              fontSize: "1rem",
              transition: "color 0.2s",
            }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-sm mt-1.5 line-clamp-2" style={{ color: "var(--muted)" }}>
              {description}
            </p>
          )}
          {progress !== null && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
                <span>進捗</span>
                <span>{completedCount}/{totalCount}</span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: "var(--border)" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%`, background: "var(--accent)" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
