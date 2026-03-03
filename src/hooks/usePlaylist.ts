"use client"

import { useState, useCallback } from "react"
import type { PlaylistItemData } from "@/types"

export function usePlaylist(initialData: PlaylistItemData[]) {
  const [playlist, setPlaylist] = useState<PlaylistItemData[]>(initialData)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    const res = await fetch("/api/playlist")
    const data = await res.json()
    setPlaylist(data.playlist || [])
  }, [])

  const add = useCallback(async (video: { videoId: string; title: string; thumbnail?: string }) => {
    setLoading(true)
    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", video }),
      })
      const data = await res.json()
      if (data.playlist) setPlaylist(data.playlist)
      return data.success
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (videoId: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", videoId }),
      })
      const data = await res.json()
      if (data.playlist) setPlaylist(data.playlist)
    } finally {
      setLoading(false)
    }
  }, [])

  const assign = useCallback(async (videoId: string, assignedTo: string) => {
    await fetch("/api/playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assign", videoId, assignedTo }),
    })
    setPlaylist((prev) =>
      prev.map((item) =>
        item.videoId === videoId ? { ...item, assignedTo } : item
      )
    )
  }, [])

  const clear = useCallback(async () => {
    setLoading(true)
    try {
      await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      })
      setPlaylist([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { playlist, loading, add, remove, assign, clear, refresh }
}
