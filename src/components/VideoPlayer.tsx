"use client";

type Props = {
  videoId: string;
  title?: string;
};

export default function VideoPlayer({ videoId, title }: Props) {
  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={title ?? "動画"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
