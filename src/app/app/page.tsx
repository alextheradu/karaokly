import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AppTabs } from "@/components/app/AppTabs"

export default async function AppPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const [playlist, partyMembers] = await Promise.all([
    prisma.playlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { position: "asc" },
    }),
    prisma.partyMember.findMany({
      where: { userId: session.user.id },
    }),
  ])

  // Serialize dates for client components
  const serializedPlaylist = playlist.map((item) => ({
    ...item,
    addedAt: item.addedAt.toISOString(),
  }))

  const serializedPartyMembers = partyMembers.map((member) => ({
    id: member.id,
    name: member.name,
  }))

  return (
    <AppTabs
      initialPlaylist={serializedPlaylist}
      initialPartyMembers={serializedPartyMembers}
      user={session.user}
    />
  )
}
