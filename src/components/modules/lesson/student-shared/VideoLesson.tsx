"use client";

import React from "react";
import { PlayCircle, Clock } from "lucide-react";

interface VideoDataDetails {
  videoUrl?: string;
  durationSeconds?: number;
}

interface VideoLessonProps {
  videoData?: VideoDataDetails | null;
  title: string;
}

// 🟢 Helper: Extract YouTube Embed URL
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  let videoId = "";

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    videoId = urlParams.get("v") || "";
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function VideoLesson({ videoData, title }: VideoLessonProps) {
  const embedUrl = videoData?.videoUrl ? getYouTubeEmbedUrl(videoData.videoUrl) : null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <PlayCircle className="w-5 h-5 text-primary" /> Video Lesson
      </h3>

      {embedUrl ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-black shadow-md">
            <iframe
              src={embedUrl}
              title={title}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <Clock className="w-4 h-4 text-primary" />
            <span>
              Duration:{" "}
              <strong className="text-foreground font-semibold">
                {videoData?.durationSeconds ?? 0}
              </strong>{" "}
              seconds
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
          <p className="text-sm font-medium text-destructive">
            Invalid or unsupported video URL.
          </p>
          {videoData?.videoUrl && (
            <a
              href={videoData.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary underline break-all"
            >
              {videoData.videoUrl}
            </a>
          )}
        </div>
      )}
    </div>
  );
}