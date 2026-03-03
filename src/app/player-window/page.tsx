"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback, Suspense } from "react"
import { YouTubePlayer } from "@/components/app/YouTubePlayer"
import Image from "next/image"
import type { PlaylistItemData } from "@/types"

function PlayerContent() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get("videoId") || ""
  const initialIndex = parseInt(searchParams.get("index") || "0")

  const [playlist, setPlaylist] = useState<PlaylistItemData[]>([])
  const [currentVideoId, setCurrentVideoId] = useState(videoId)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    fetch("/api/playlist")
      .then((res) => res.json())
      .then((data) => setPlaylist(data.playlist || []))
      .catch(() => {})
  }, [])

  const handleEnded = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentVideoId(playlist[nextIndex].videoId)
    }
  }, [currentIndex, playlist])

  const nextSong = playlist[currentIndex + 1]

  return (
    <div className="min-h-screen bg-black p-3 flex flex-col gap-4">
      {currentVideoId && (
        <YouTubePlayer videoId={currentVideoId} onEnded={handleEnded} />
      )}

      {nextSong && (
        <div className="px-1">
          <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-semibold mb-2">
            Up Next
          </p>
          <button
            onClick={() => {
              setCurrentIndex(currentIndex + 1)
              setCurrentVideoId(nextSong.videoId)
            }}
            className="flex items-center gap-3 w-full text-left rounded-lg p-2 bg-zinc-900/80 border border-white/10 hover:bg-zinc-800/80 transition-colors cursor-pointer"
          >
            <div className="relative w-28 aspect-video rounded-md overflow-hidden shrink-0 border border-white/10">
              <Image
                src={`https://img.youtube.com/vi/${nextSong.videoId}/mqdefault.jpg`}
                alt={nextSong.title}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <p className="text-zinc-200 text-sm font-medium line-clamp-2">{nextSong.title}</p>
          </button>
        </div>
      )}
    </div>
  )
}

export default function PlayerWindowPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PlayerContent />
    </Suspense>
  )
}
