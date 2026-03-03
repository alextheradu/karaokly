"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import { useState } from "react"

interface VideoCardProps {
  videoId: string
  title: string
  thumbnail: string
  onAdd: (video: { videoId: string; title: string; thumbnail: string }) => Promise<boolean | undefined>
}

export function VideoCard({ videoId, title, thumbnail, onAdd }: VideoCardProps) {
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    setAdding(true)
    const success = await onAdd({ videoId, title, thumbnail })
    if (success !== false) setAdded(true)
    setAdding(false)
  }

  return (
    <div className="group overflow-hidden rounded-xl bg-zinc-900/50 border border-white/5 transition-all duration-200 hover:border-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-white line-clamp-2 mb-3 leading-snug min-h-[2.5rem]">
          {decodeHTMLEntities(title)}
        </h3>
        <Button
          onClick={handleAdd}
          disabled={added || adding}
          className={`w-full transition-all cursor-pointer ${
            added
              ? "bg-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
          }`}
          size="sm"
        >
          {added ? (
            <>
              <Check className="mr-1.5 h-4 w-4" /> Added
            </>
          ) : (
            <>
              <Plus className="mr-1.5 h-4 w-4" /> Add to Playlist
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function decodeHTMLEntities(text: string) {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
    "&#x2F;": "/",
  }
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x27;|&#x2F;/g, (match) => entities[match] || match)
}
