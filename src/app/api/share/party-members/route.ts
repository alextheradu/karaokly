import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

async function getUserByToken(token: string | null) {
  if (!token) return null
  return prisma.user.findUnique({ where: { shareToken: token } })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const user = await getUserByToken(token)

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 })
  }

  const partyMembers = await prisma.partyMember.findMany({
    where: { userId: user.id },
  })

  return NextResponse.json({ partyMembers })
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const user = await getUserByToken(token)

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 })
  }

  const body = await request.json()
  const { action, member } = body

  switch (action) {
    case "add": {
      if (!member) {
        return NextResponse.json({ error: "Missing member name" }, { status: 400 })
      }

      const existing = await prisma.partyMember.findUnique({
        where: { userId_name: { userId: user.id, name: member } },
      })

      if (!existing) {
        await prisma.partyMember.create({
          data: { userId: user.id, name: member },
        })
      }

      const partyMembers = await prisma.partyMember.findMany({
        where: { userId: user.id },
      })
      return NextResponse.json({ success: true, partyMembers })
    }

    case "remove": {
      if (!member) {
        return NextResponse.json({ error: "Missing member name" }, { status: 400 })
      }

      await prisma.partyMember.deleteMany({
        where: { userId: user.id, name: member },
      })

      await prisma.playlistItem.updateMany({
        where: { userId: user.id, assignedTo: member },
        data: { assignedTo: "" },
      })

      const partyMembers = await prisma.partyMember.findMany({
        where: { userId: user.id },
      })
      return NextResponse.json({ success: true, partyMembers })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
