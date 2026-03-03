import { Search, ListMusic, Users, Share2 } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Search YouTube",
    description: "Find karaoke tracks instantly from YouTube's library — just type a song or artist name.",
  },
  {
    icon: ListMusic,
    title: "Build your playlist",
    description: "Queue songs and reorder them to set the perfect flow for your session.",
  },
  {
    icon: Users,
    title: "Assign to party members",
    description: "Track who sings what so nobody misses their turn throughout the night.",
  },
  {
    icon: Share2,
    title: "Share with a link",
    description: "Guests can view the live playlist via QR code — no login needed.",
  },
]

export function LandingFeatures() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Everything you need for a great karaoke night
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
