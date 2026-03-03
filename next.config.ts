import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { hostname: "img.youtube.com" },
      { hostname: "i.ytimg.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
}

export default nextConfig
