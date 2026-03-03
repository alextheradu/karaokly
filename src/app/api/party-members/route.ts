import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const partyMembers = await prisma.partyMember.findMany({
    where: { userId: session.user.id },
  })

  return NextResponse.json({ partyMembers })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { action, member } = body

  switch (action) {
    case "add": {
      if (!member) {
        return NextResponse.json({ error: "Missing member name" }, { status: 400 })
      }

      const existing = await prisma.partyMember.findUnique({
        where: { userId_name: { userId: session.user.id, name: member } },
      })

      if (!existing) {
        await prisma.partyMember.create({
          data: { userId: session.user.id, name: member },
        })
      }

      const partyMembers = await prisma.partyMember.findMany({
        where: { userId: session.user.id },
      })
      return NextResponse.json({ success: true, partyMembers })
    }

    case "remove": {
      if (!member) {
        return NextResponse.json({ error: "Missing member name" }, { status: 400 })
      }

      await prisma.partyMember.deleteMany({
        where: { userId: session.user.id, name: member },
      })

      // Unassign songs from removed member
      await prisma.playlistItem.updateMany({
        where: { userId: session.user.id, assignedTo: member },
        data: { assignedTo: "" },
      })

      const partyMembers = await prisma.partyMember.findMany({
        where: { userId: session.user.id },
      })
      return NextResponse.json({ success: true, partyMembers })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
