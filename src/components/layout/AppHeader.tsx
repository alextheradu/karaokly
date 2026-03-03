"use client"

import { signOut } from "next-auth/react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, ChevronDown, Shield, Search, ListMusic, Radio } from "lucide-react"
import Link from "next/link"
import { motion } from "motion/react"

interface AppHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    isAdmin?: boolean
  }
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const navItems = [
  { value: "search", label: "Song Finder", icon: Search },
  { value: "playlist", label: "Playlist", icon: ListMusic },
  { value: "jam", label: "Jam", icon: Radio },
]

export function AppHeader({ user, activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 mx-3 sm:mx-4 mt-3 sm:mt-4">
      <div className="glass-card rounded-2xl px-4 sm:px-6 py-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/app" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo-trans.png"
              alt="Karaokly"
              width={120}
              height={36}
              className="h-8 sm:h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation — centered pill nav */}
          {onTabChange && (
            <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 border border-white/5 rounded-full p-1 relative">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.value
                return (
                  <button
                    key={item.value}
                    onClick={() => onTabChange(item.value)}
                    className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 bg-purple-500/20 border border-purple-500/30 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          )}

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs sm:text-sm font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline-block text-sm font-medium max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <ChevronDown className="h-3.5 w-3.5 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-white/10">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              {user.isAdmin && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white focus:text-white focus:bg-white/5">
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                </>
              )}
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 cursor-pointer text-rose-400 focus:text-rose-400 focus:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
