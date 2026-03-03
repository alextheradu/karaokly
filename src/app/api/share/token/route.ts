import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { shareToken: true },
  })

  let shareToken = user?.shareToken

  if (!shareToken) {
    shareToken = randomBytes(10).toString("hex")
    await prisma.user.update({
      where: { id: session.user.id },
      data: { shareToken },
    })
  }

  const host = request.headers.get("host") || "karaokly.com"
  const protocol = request.headers.get("x-forwarded-proto") || "https"
  const shareUrl = `${protocol}://${host}/share?token=${shareToken}`

  return NextResponse.json({ shareUrl, shareToken })
}
