"use client"

import Dock from "@/components/Dock"
import { Search, ListMusic, Radio } from "lucide-react"

interface MobileDockProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { value: "search", label: "Search", icon: Search },
  { value: "playlist", label: "Playlist", icon: ListMusic },
  { value: "jam", label: "Jam", icon: Radio },
]

export function MobileDock({ activeTab, onTabChange }: MobileDockProps) {
  const items = tabs.map((tab) => {
    const Icon = tab.icon
    const isActive = activeTab === tab.value
    return {
      icon: (
        <Icon
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-purple-400" : "text-zinc-400"
          }`}
        />
      ),
      label: tab.label,
      onClick: () => onTabChange(tab.value),
      className: isActive
        ? "!border-purple-500/40 !bg-[#1a0a2e] shadow-[0_0_12px_rgba(168,85,247,0.2)]"
        : "",
    }
  })

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <Dock
        items={items}
        panelHeight={58}
        baseItemSize={44}
        magnification={62}
        distance={120}
        spring={{ mass: 0.1, stiffness: 200, damping: 14 }}
      />
    </div>
  )
}
