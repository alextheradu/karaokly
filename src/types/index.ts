export interface PlaylistItemData {
  id: string
  videoId: string
  title: string
  thumbnail: string | null
  assignedTo: string
  position: number
  addedAt: string
}

export interface PartyMemberData {
  id: string
  name: string
}

export interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title: string
    thumbnails: {
      medium: { url: string }
      high: { url: string }
    }
  }
}

export interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[]
  error?: { message: string }
}
