import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  if (!q) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  const query = q.toLowerCase().includes("karaoke") ? q : `${q} karaoke`

  const url = new URL("https://www.googleapis.com/youtube/v3/search")
  url.searchParams.set("part", "snippet")
  url.searchParams.set("type", "video")
  url.searchParams.set("q", query)
  url.searchParams.set("maxResults", "10")
  url.searchParams.set("videoEmbeddable", "true")
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY!)

  const response = await fetch(url.toString(), { next: { revalidate: 60 } })
  const data = await response.json()
  return NextResponse.json(data)
}
