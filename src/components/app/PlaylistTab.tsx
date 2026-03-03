"use client"

import { useState, useCallback } from "react"
import { PlaylistItem } from "./PlaylistItem"
import { YouTubePlayer } from "./YouTubePlayer"
import { Button } from "@/components/ui/button"
import { ListMusic, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { PlaylistItemData, PartyMemberData } from "@/types"

interface PlaylistTabProps {
  playlist: PlaylistItemData[]
  partyMembers: PartyMemberData[]
  onRemove: (videoId: string) => Promise<void>
  onAssign: (videoId: string, member: string) => Promise<void>
  onClear: () => Promise<void>
  onAddMember: () => void
}

export function PlaylistTab({
  playlist,
  partyMembers,
  onRemove,
  onAssign,
  onClear,
  onAddMember,
}: PlaylistTabProps) {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const currentIndex = playlist.findIndex((item) => item.videoId === currentVideoId)

  const handlePlay = useCallback((videoId: string) => {
    setCurrentVideoId(videoId)
  }, [])

  const handleEnded = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < playlist.length - 1) {
      setCurrentVideoId(playlist[currentIndex + 1].videoId)
    }
  }, [currentIndex, playlist])

  const handlePopOut = useCallback((videoId: string, index: number) => {
    window.open(
      `/player-window?videoId=${videoId}&index=${index}`,
      "karaokly-player",
      "width=720,height=540"
    )
  }, [])

  const handleRemove = useCallback(async (videoId: string) => {
    if (videoId === currentVideoId) {
      setCurrentVideoId(null)
    }
    await onRemove(videoId)
    toast.success("Song removed from playlist")
  }, [currentVideoId, onRemove])

  const handleClear = useCallback(async () => {
    setCurrentVideoId(null)
    await onClear()
    toast.success("Playlist cleared")
  }, [onClear])

  return (
    <div>
      {/* Player */}
      {currentVideoId && (
        <div className="mb-6 rounded-xl overflow-hidden border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <YouTubePlayer
            videoId={currentVideoId}
            onEnded={handleEnded}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-purple-400" />
          Your Playlist
          <span className="text-sm font-normal bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
            {playlist.length}
          </span>
        </h3>
        {playlist.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* List */}
      {playlist.length > 0 ? (
        <div className="divide-y divide-white/5">
          {playlist.map((item, index) => (
            <PlaylistItem
              key={item.id}
              item={item}
              index={index}
              isPlaying={item.videoId === currentVideoId}
              partyMembers={partyMembers}
              onPlay={handlePlay}
              onRemove={handleRemove}
              onAssign={onAssign}
              onAddMember={onAddMember}
              onPopOut={handlePopOut}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-zinc-500">
          <ListMusic className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Your playlist is empty</p>
          <p className="text-sm mt-1 text-zinc-600">Search for songs and add them here</p>
        </div>
      )}
    </div>
  )
}
