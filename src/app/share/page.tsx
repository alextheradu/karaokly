import { prisma } from "@/lib/prisma"
import { SharePageClient } from "@/components/share/SharePageClient"
import Image from "next/image"

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <InvalidShareLink />
  }

  const user = await prisma.user.findUnique({
    where: { shareToken: token },
    select: { id: true },
  })

  if (!user) {
    return <InvalidShareLink />
  }

  return (
    <div className="min-h-screen bg-dark-noise">
      <div className="sticky top-0 z-50 glass-card mx-4 mt-4 rounded-2xl px-6 py-3 shadow-lg">
        <Image
          src="/logo-trans.png"
          alt="Karaokly"
          width={140}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </div>
      <SharePageClient token={token} />
    </div>
  )
}

function InvalidShareLink() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-noise">
      <div className="text-center glass-card rounded-2xl p-10 shadow-lg max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Invalid Share Link</h1>
        <p className="text-zinc-400">
          This share link is invalid or has expired. Ask the host for a new link.
        </p>
      </div>
    </div>
  )
}
