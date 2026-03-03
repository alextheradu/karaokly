import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const playlist = await prisma.playlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { position: "asc" },
  })

  return NextResponse.json({ playlist })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
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
        where: { userId_videoId: { userId: session.user.id, videoId: video.videoId } },
      })

      if (!existing) {
        const maxPos = await prisma.playlistItem.aggregate({
          where: { userId: session.user.id },
          _max: { position: true },
        })

        await prisma.playlistItem.create({
          data: {
            userId: session.user.id,
            videoId: video.videoId,
            title: video.title,
            thumbnail: video.thumbnail || null,
            position: (maxPos._max.position ?? -1) + 1,
          },
        })
      }

      const playlist = await prisma.playlistItem.findMany({
        where: { userId: session.user.id },
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
        where: { userId: session.user.id, videoId },
      })

      const playlist = await prisma.playlistItem.findMany({
        where: { userId: session.user.id },
        orderBy: { position: "asc" },
      })
      return NextResponse.json({ success: true, playlist })
    }

    case "assign": {
      const { videoId, assignedTo } = body
      await prisma.playlistItem.updateMany({
        where: { userId: session.user.id, videoId },
        data: { assignedTo: assignedTo || "" },
      })
      return NextResponse.json({ success: true })
    }

    case "clear": {
      await prisma.playlistItem.deleteMany({
        where: { userId: session.user.id },
      })
      return NextResponse.json({ success: true, playlist: [] })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
