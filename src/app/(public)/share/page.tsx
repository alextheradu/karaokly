import { prisma } from "@/lib/prisma"
import { SharePageClient } from "@/components/share/SharePageClient"

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

  return <SharePageClient token={token} />
}

function InvalidShareLink() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center glass-card rounded-2xl p-10 shadow-lg max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Invalid Share Link</h1>
        <p className="text-zinc-400">
          This share link is invalid or has expired. Ask the host for a new link.
        </p>
      </div>
    </div>
  )
}
