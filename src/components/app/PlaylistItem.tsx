"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PartyMemberSelect } from "./PartyMemberSelect"
import { Play, Trash2, ExternalLink } from "lucide-react"
import type { PlaylistItemData, PartyMemberData } from "@/types"

interface PlaylistItemProps {
  item: PlaylistItemData
  partyMembers: PartyMemberData[]
  isPlaying?: boolean
  onPlay: (videoId: string) => void
  onRemove: (videoId: string) => void
  onAssign: (videoId: string, member: string) => void
  onAddMember: () => void
  onPopOut: (videoId: string, index: number) => void
  index: number
}

export function PlaylistItem({
  item,
  partyMembers,
  isPlaying,
  onPlay,
  onRemove,
  onAssign,
  onAddMember,
  onPopOut,
  index,
}: PlaylistItemProps) {
  return (
    <div className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.03] ${isPlaying ? "border-l-2 border-purple-500 bg-purple-500/[0.05]" : ""}`}>
      {/* Thumbnail */}
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/5">
        <Image
          src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
          alt={item.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Title + assignment */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white leading-snug line-clamp-1">{item.title}</p>
        <div className="mt-1">
          <PartyMemberSelect
            videoId={item.videoId}
            assignedTo={item.assignedTo}
            partyMembers={partyMembers}
            onAssign={onAssign}
            onAddMember={onAddMember}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 cursor-pointer"
          onClick={() => onPlay(item.videoId)}
          title="Play"
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5 cursor-pointer"
          onClick={() => onPopOut(item.videoId, index)}
          title="Pop out"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
          onClick={() => onRemove(item.videoId)}
          title="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
