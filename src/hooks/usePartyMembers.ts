"use client"

import { useState, useCallback } from "react"
import type { PartyMemberData } from "@/types"

export function usePartyMembers(initialData: PartyMemberData[]) {
  const [partyMembers, setPartyMembers] = useState<PartyMemberData[]>(initialData)

  const add = useCallback(async (name: string) => {
    const res = await fetch("/api/party-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", member: name }),
    })
    const data = await res.json()
    if (data.partyMembers) setPartyMembers(data.partyMembers)
    return data.success
  }, [])

  const remove = useCallback(async (name: string) => {
    const res = await fetch("/api/party-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", member: name }),
    })
    const data = await res.json()
    if (data.partyMembers) setPartyMembers(data.partyMembers)
  }, [])

  return { partyMembers, add, remove }
}
