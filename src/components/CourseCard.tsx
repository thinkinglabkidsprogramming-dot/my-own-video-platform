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
      <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
        <div className="relative aspect-video bg-gray-200">
          {thumbnailPath ? (
            <Image
              src={thumbnailPath}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              サムネイルなし
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          )}
          {progress !== null && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>進捗</span>
                <span>
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
