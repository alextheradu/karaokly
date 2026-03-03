"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Users } from "lucide-react"
import type { PartyMemberData } from "@/types"

interface PartyMemberSelectProps {
  videoId: string
  assignedTo: string
  partyMembers: PartyMemberData[]
  onAssign: (videoId: string, member: string) => void
  onAddMember: () => void
}

export function PartyMemberSelect({
  videoId,
  assignedTo,
  partyMembers,
  onAssign,
  onAddMember,
}: PartyMemberSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs cursor-pointer bg-zinc-800/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/20">
          {assignedTo ? (
            <Badge variant="secondary" className="px-2 py-0 text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {assignedTo}
            </Badge>
          ) : (
            <>
              <Users className="h-3.5 w-3.5" />
              Assign
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-white/10">
        {assignedTo && (
          <>
            <DropdownMenuItem onClick={() => onAssign(videoId, "")} className="cursor-pointer text-zinc-500 focus:text-zinc-400 focus:bg-white/5">
              Unassign
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
          </>
        )}
        {partyMembers.map((member) => (
          <DropdownMenuItem
            key={member.id}
            onClick={() => onAssign(videoId, member.name)}
            className="cursor-pointer text-zinc-300 focus:text-white focus:bg-white/5"
          >
            {member.name}
          </DropdownMenuItem>
        ))}
        {partyMembers.length > 0 && <DropdownMenuSeparator className="bg-white/5" />}
        <DropdownMenuItem onClick={onAddMember} className="cursor-pointer text-cyan-400 focus:text-cyan-300 focus:bg-cyan-500/10">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Party Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
