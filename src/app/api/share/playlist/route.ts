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

  const playlist = await prisma.playlistItem.findMany({
    where: { userId: user.id },
    orderBy: { position: "asc" },
  })

  return NextResponse.json({ playlist })
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const user = await getUserByToken(token)

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 })
  }

  const body = await request.json()
  const { action } = body

  switch (action) {
    case "add": {
      const { video } = body
      if (!video?.videoId || !video?.title) {
        return NextResponse.json({ error: "Invalid video object" }, { status: 400 })
      }

      const existing = await prisma.playlistItem.findUnique({
        where: { userId_videoId: { userId: user.id, videoId: video.videoId } },
      })

      if (!existing) {
        const maxPos = await prisma.playlistItem.aggregate({
          where: { userId: user.id },
          _max: { position: true },
        })

        await prisma.playlistItem.create({
          data: {
            userId: user.id,
            videoId: video.videoId,
            title: video.title,
            thumbnail: video.thumbnail || null,
            position: (maxPos._max.position ?? -1) + 1,
          },
        })
      }

      const playlist = await prisma.playlistItem.findMany({
        where: { userId: user.id },
        orderBy: { position: "asc" },
      })
      return NextResponse.json({ success: true, playlist })
    }

    case "remove": {
      const { videoId } = body
      if (!videoId) {
        return NextResponse.json({ error: "Missing videoId" }, { status: 400 })
      }

      await prisma.playlistItem.deleteMany({
        where: { userId: user.id, videoId },
      })

      const playlist = await prisma.playlistItem.findMany({
        where: { userId: user.id },
        orderBy: { position: "asc" },
      })
      return NextResponse.json({ success: true, playlist })
    }

    case "assign": {
      const { videoId, assignedTo } = body
      await prisma.playlistItem.updateMany({
        where: { userId: user.id, videoId },
        data: { assignedTo: assignedTo || "" },
      })
      return NextResponse.json({ success: true })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
