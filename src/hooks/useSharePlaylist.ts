"use client"

import { useState, useCallback, useEffect } from "react"
import type { PlaylistItemData, PartyMemberData } from "@/types"

export function useSharePlaylist(token: string) {
  const [playlist, setPlaylist] = useState<PlaylistItemData[]>([])
  const [partyMembers, setPartyMembers] = useState<PartyMemberData[]>([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    try {
      const [playlistRes, membersRes] = await Promise.all([
        fetch(`/api/share/playlist?token=${token}`),
        fetch(`/api/share/party-members?token=${token}`),
      ])
      const [playlistData, membersData] = await Promise.all([
        playlistRes.json(),
        membersRes.json(),
      ])
      setPlaylist(playlistData.playlist || [])
      setPartyMembers(membersData.partyMembers || [])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    const interval = setInterval(loadAll, 5000)
    return () => clearInterval(interval)
  }, [loadAll])

  const addToPlaylist = useCallback(async (video: { videoId: string; title: string; thumbnail?: string }) => {
    const res = await fetch(`/api/share/playlist?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", video }),
    })
    const data = await res.json()
    if (data.playlist) setPlaylist(data.playlist)
  }, [token])

  const removeFromPlaylist = useCallback(async (videoId: string) => {
    const res = await fetch(`/api/share/playlist?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", videoId }),
    })
    const data = await res.json()
    if (data.playlist) setPlaylist(data.playlist)
  }, [token])

  const assignMember = useCallback(async (videoId: string, assignedTo: string) => {
    await fetch(`/api/share/playlist?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assign", videoId, assignedTo }),
    })
    setPlaylist((prev) =>
      prev.map((item) =>
        item.videoId === videoId ? { ...item, assignedTo } : item
      )
    )
  }, [token])

  const addPartyMember = useCallback(async (name: string) => {
    const res = await fetch(`/api/share/party-members?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", member: name }),
    })
    const data = await res.json()
    if (data.partyMembers) setPartyMembers(data.partyMembers)
  }, [token])

  const removePartyMember = useCallback(async (name: string) => {
    const res = await fetch(`/api/share/party-members?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", member: name }),
    })
    const data = await res.json()
    if (data.partyMembers) setPartyMembers(data.partyMembers)
  }, [token])

  return {
    playlist,
    partyMembers,
    loading,
    addToPlaylist,
    removeFromPlaylist,
    assignMember,
    addPartyMember,
    removePartyMember,
    refresh: loadAll,
  }
}
