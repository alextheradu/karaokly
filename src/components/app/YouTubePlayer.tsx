"use client"

import { useEffect, useRef, useCallback } from "react"

declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

interface YouTubePlayerProps {
  videoId: string
  onEnded?: () => void
  className?: string
}

export function YouTubePlayer({ videoId, onEnded, className = "" }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const currentVideoRef = useRef<string>("")

  const initPlayer = useCallback(() => {
    if (!containerRef.current || !window.YT?.Player) return

    if (playerRef.current) {
      playerRef.current.destroy()
    }

    currentVideoRef.current = videoId

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      height: "100%",
      width: "100%",
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onStateChange: (event: YT.OnStateChangeEvent) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            onEnded?.()
          }
        },
      },
    })
  }, [videoId, onEnded])

  useEffect(() => {
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)

      window.onYouTubeIframeAPIReady = () => {
        initPlayer()
      }
    } else if (window.YT.Player) {
      initPlayer()
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [initPlayer])

  // Load new video when videoId changes (after initial mount)
  useEffect(() => {
    if (playerRef.current && currentVideoRef.current !== videoId) {
      currentVideoRef.current = videoId
      playerRef.current.loadVideoById(videoId)
    }
  }, [videoId])

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-black ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
