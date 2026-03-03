"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VideoCard } from "./VideoCard"
import { Search, Loader2 } from "lucide-react"
import type { YouTubeSearchItem } from "@/types"

interface SearchTabProps {
  onAdd: (video: { videoId: string; title: string; thumbnail: string }) => Promise<boolean | undefined>
}

export function SearchTab({ onAdd }: SearchTabProps) {
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

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for karaoke songs..."
            className="pl-10 bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20 transition-colors h-11"
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
              onAdd={onAdd}
            />
          ))}
        </div>
      )}

      {results.length === 0 && !searching && (
        <div className="text-center py-16 text-zinc-500">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Search for your favorite karaoke songs</p>
          <p className="text-sm mt-1 text-zinc-600">Results will appear here</p>
        </div>
      )}
    </div>
  )
}
