// src/components/layout/PublicHeader.tsx
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export async function PublicHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 mx-3 sm:mx-4 mt-3 sm:mt-4">
      <div className="glass-card rounded-2xl px-4 sm:px-6 py-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo-trans.png"
              alt="Karaokly"
              width={120}
              height={36}
              className="h-8 sm:h-9 w-auto"
              priority
            />
          </Link>
          {session?.user ? (
            <Button
              asChild
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full px-4 text-sm font-medium"
            >
              <Link href="/app">Open App</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-full px-5 text-sm font-semibold shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
