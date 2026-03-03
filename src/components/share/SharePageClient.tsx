"use client"

import { useState } from "react"
import { useSharePlaylist } from "@/hooks/useSharePlaylist"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VideoCard } from "@/components/app/VideoCard"
import { PartyMemberSelect } from "@/components/app/PartyMemberSelect"
import { Search, Loader2, ListMusic, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import type { YouTubeSearchItem } from "@/types"

interface SharePageClientProps {
  token: string
}

export function SharePageClient({ token }: SharePageClientProps) {
  const {
    playlist,
    partyMembers,
    loading,
    addToPlaylist,
    removeFromPlaylist,
    assignMember,
    addPartyMember,
  } = useSharePlaylist(token)

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<YouTubeSearchItem[]>([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.items || [])
    } finally {
      setSearching(false)
    }
  }

  const handleAdd = async (video: { videoId: string; title: string; thumbnail: string }) => {
    await addToPlaylist(video)
    toast.success("Song added to playlist")
    return true
  }

  const handleAddMember = () => {
    const name = prompt("Enter party member name:")
    if (name?.trim()) {
      addPartyMember(name.trim())
      toast.success(`${name.trim()} joined the party`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Search section */}
      <div className="glass-card rounded-2xl p-6 shadow-lg mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Add Songs to the Playlist</h1>
        <p className="text-sm text-zinc-400 mb-6">Search and add karaoke songs for the group</p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs..."
              className="pl-10 h-11 bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
          </div>
          <Button
            type="submit"
            disabled={searching}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 h-11 cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <VideoCard
                key={item.id.videoId}
                videoId={item.id.videoId}
                title={item.snippet.title}
                thumbnail={item.snippet.thumbnails.medium.url}
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}
      </div>

      {/* Playlist section */}
      <div className="glass-card rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-purple-400" />
          Current Playlist
          <span className="text-sm font-normal bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
            {playlist.length}
          </span>
        </h2>

        {playlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlist.map((item) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden bg-zinc-900/50 border border-white/5 transition-all hover:border-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <div className="relative aspect-video">
                  <Image
                    src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 bg-rose-500/80 hover:bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => {
                      removeFromPlaylist(item.videoId)
                      toast.success("Song removed")
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white line-clamp-2 mb-2 leading-snug">{item.title}</p>
                  <PartyMemberSelect
                    videoId={item.videoId}
                    assignedTo={item.assignedTo}
                    partyMembers={partyMembers}
                    onAssign={assignMember}
                    onAddMember={handleAddMember}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500">
            <ListMusic className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No songs yet</p>
            <p className="text-sm mt-1 text-zinc-600">Search and add songs above</p>
          </div>
        )}
      </div>
    </div>
  )
}
