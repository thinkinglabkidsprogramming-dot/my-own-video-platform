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

export default function CourseCard({ id, title, description, thumbnailPath, completedCount, totalCount }: Props) {
  const progress = totalCount && totalCount > 0
    ? Math.round((completedCount! / totalCount) * 100)
    : null;

  return (
    <Link href={`/courses/${id}`} className="block group">
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        overflow: "hidden",
        transition: "box-shadow 0.25s, transform 0.25s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
        className="group-hover:shadow-xl group-hover:-translate-y-1.5"
      >
        <div className="relative aspect-video" style={{ background: "#f0ede6" }}>
          {thumbnailPath ? (
            <Image src={thumbnailPath} alt={title} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: "var(--muted)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.882V19a1 1 0 01-1.447.894L15 18M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.3) 0%, transparent 60%)",
          }} />
        </div>
        <div className="p-5">
          <h2 className="line-clamp-2 group-hover:[color:var(--accent)]"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontWeight: 400,
              color: "var(--text)",
              fontSize: "1.1rem",
              lineHeight: 1.35,
              transition: "color 0.2s",
              marginBottom: "0.4rem",
            }}>
            {title}
          </h2>
          {description && (
            <p className="text-sm line-clamp-2" style={{ color: "var(--muted)", lineHeight: 1.5 }}>
              {description}
            </p>
          )}
          {progress !== null && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted)", fontWeight: 600 }}>
                <span>進捗</span>
                <span>{completedCount}/{totalCount}</span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: "var(--border)" }}>
                <div className="h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%`, background: "var(--accent)" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
