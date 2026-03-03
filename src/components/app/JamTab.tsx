"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { QRCodeSVG } from "qrcode.react"
import { QrCode, Copy, Check, Link2 } from "lucide-react"
import { toast } from "sonner"

export function JamTab() {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateShareLink = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/share/token", { method: "POST" })
      const data = await res.json()
      setShareUrl(data.shareUrl)
      setDialogOpen(true)
    } catch {
      toast.error("Failed to generate share link")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success("Link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
          <QrCode className="h-10 w-10 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Start a Jam Session</h3>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Generate a QR code and share link so your friends can add songs to your playlist in real time.
        </p>
        <Button
          onClick={generateShareLink}
          disabled={loading}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-6 text-base rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] cursor-pointer"
        >
          <Link2 className="mr-2 h-5 w-5" />
          Generate Share Link
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-center text-white">Share Your Jam</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            {shareUrl && (
              <div className="p-4 bg-zinc-800 rounded-2xl border border-white/5">
                <QRCodeSVG
                  value={shareUrl}
                  size={200}
                  level="M"
                  bgColor="#27272a"
                  fgColor="#ffffff"
                />
              </div>
            )}
            <div className="flex w-full gap-2">
              <Input
                value={shareUrl || ""}
                readOnly
                className="bg-zinc-800/50 border-white/10 text-zinc-300 text-sm font-mono"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
                className="shrink-0 cursor-pointer border-white/10 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 text-center">
              Anyone with this link can add songs to your playlist
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
