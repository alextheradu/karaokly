"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { RefreshCw, Shield, ShieldOff, Trash2, Loader2 } from "lucide-react"

interface Account {
  id: string
  email: string
  name: string | null
  image: string | null
  isAdmin: boolean
  createdAt: string
  _count: {
    playlist: number
    partyMembers: number
  }
}

interface AccountsTableProps {
  currentUserId: string
}

export function AccountsTable({ currentUserId }: AccountsTableProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/accounts")
      const data = await res.json()
      setAccounts(data.accounts || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleAction = async (userId: string, action: "delete" | "promote" | "demote") => {
    const confirmMessages = {
      delete: "Are you sure you want to delete this account? This cannot be undone.",
      promote: "Promote this user to admin?",
      demote: "Remove admin privileges from this user?",
    }

    if (!confirm(confirmMessages[action])) return

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success(data.message)
      fetchAccounts()
    } else {
      toast.error(data.error || "Action failed")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Accounts</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAccounts}
          disabled={loading}
          className="cursor-pointer border-white/10 bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      ) : (
        <div className="rounded-lg border border-white/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/[0.02] border-white/5">
                <TableHead className="text-zinc-500 uppercase text-xs tracking-wider">User</TableHead>
                <TableHead className="text-zinc-500 uppercase text-xs tracking-wider">Role</TableHead>
                <TableHead className="text-center text-zinc-500 uppercase text-xs tracking-wider">Songs</TableHead>
                <TableHead className="text-center text-zinc-500 uppercase text-xs tracking-wider">Party Members</TableHead>
                <TableHead className="text-right text-zinc-500 uppercase text-xs tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account, i) => (
                <TableRow key={account.id} className={`border-white/5 hover:bg-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={account.image || undefined} />
                        <AvatarFallback className="text-xs bg-purple-500/20 text-purple-400">
                          {account.name?.charAt(0) || account.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{account.name || "\u2014"}</p>
                        <p className="text-xs text-zinc-400">{account.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {account.isAdmin ? (
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-white/10">User</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-zinc-300">{account._count.playlist}</TableCell>
                  <TableCell className="text-center text-zinc-300">{account._count.partyMembers}</TableCell>
                  <TableCell className="text-right">
                    {account.id !== currentUserId && (
                      <div className="flex items-center justify-end gap-1">
                        {account.isAdmin ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(account.id, "demote")}
                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                          >
                            <ShieldOff className="h-4 w-4 mr-1" />
                            Demote
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(account.id, "promote")}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 cursor-pointer"
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Promote
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(account.id, "delete")}
                          className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
