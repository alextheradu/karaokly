import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await request.json()
  const { action, userId } = body

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  // Prevent self-modification for destructive actions
  if (userId === session.user.id && (action === "delete" || action === "demote")) {
    return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 })
  }

  switch (action) {
    case "delete": {
      await prisma.user.delete({ where: { id: userId } })
      return NextResponse.json({ success: true, message: "Account deleted" })
    }

    case "promote": {
      await prisma.user.update({
        where: { id: userId },
        data: { isAdmin: true },
      })
      return NextResponse.json({ success: true, message: "User promoted to admin" })
    }

    case "demote": {
      await prisma.user.update({
        where: { id: userId },
        data: { isAdmin: false },
      })
      return NextResponse.json({ success: true, message: "Admin privileges removed" })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
