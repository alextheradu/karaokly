import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isAdmin: true,
      createdAt: true,
      _count: {
        select: {
          playlist: true,
          partyMembers: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ accounts: users })
}
