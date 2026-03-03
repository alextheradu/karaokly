"use client"

import { useCallback, useState } from "react"
import { SearchTab } from "./SearchTab"
import { PlaylistTab } from "./PlaylistTab"
import { JamTab } from "./JamTab"
import { AppHeader } from "@/components/layout/AppHeader"
import { MobileDock } from "@/components/layout/MobileDock"
import { usePlaylist } from "@/hooks/usePlaylist"
import { usePartyMembers } from "@/hooks/usePartyMembers"
import { toast } from "sonner"
import type { PlaylistItemData, PartyMemberData } from "@/types"

interface AppTabsProps {
  initialPlaylist: PlaylistItemData[]
  initialPartyMembers: PartyMemberData[]
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    isAdmin?: boolean
  }
}

export function AppTabs({ initialPlaylist, initialPartyMembers, user }: AppTabsProps) {
  const { playlist, add, remove, assign, clear } = usePlaylist(initialPlaylist)
  const { partyMembers, add: addMember } = usePartyMembers(initialPartyMembers)
  const [activeTab, setActiveTab] = useState("search")

  const handleAddToPlaylist = useCallback(async (video: { videoId: string; title: string; thumbnail: string }) => {
    const success = await add(video)
    if (success) {
      toast.success("Song added to playlist")
    }
    return success
  }, [add])

  const handleAddMember = useCallback(() => {
    const name = prompt("Enter party member name:")
    if (name?.trim()) {
      addMember(name.trim())
      toast.success(`${name.trim()} added to the party`)
    }
  }, [addMember])

  return (
    <div className="min-h-screen bg-dark-noise">
      <AppHeader user={user} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-6">
        <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-lg">
          {activeTab === "search" && (
            <SearchTab onAdd={handleAddToPlaylist} />
          )}
          {activeTab === "playlist" && (
            <PlaylistTab
              playlist={playlist}
              partyMembers={partyMembers}
              onRemove={remove}
              onAssign={assign}
              onClear={clear}
              onAddMember={handleAddMember}
            />
          )}
          {activeTab === "jam" && (
            <JamTab />
          )}
        </div>
      </main>

      {/* Mobile dock */}
      <MobileDock activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
