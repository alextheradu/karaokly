"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ParticleHeroProps {
  isLoggedIn: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

export function CurtainReveal({ isLoggedIn }: ParticleHeroProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const [exiting, setExiting] = useState(false)

  const handleEnter = () => {
    setExiting(true)
    setTimeout(() => {
      router.push(isLoggedIn ? "/app" : "/login")
    }, 500)
  }

  const initParticles = useCallback((width: number, height: number) => {
    const colors = [
      "rgba(168, 85, 247, 0.6)",  // purple
      "rgba(236, 72, 153, 0.4)",  // pink
      "rgba(34, 211, 238, 0.3)",  // cyan
      "rgba(255, 255, 255, 0.5)", // white
      "rgba(255, 255, 255, 0.3)", // dim white
    ]
    const particles: Particle[] = []
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initParticles])

  return (
    <div className={`min-h-screen flex items-center justify-center relative transition-all duration-500 ${exiting ? "opacity-0 scale-95" : ""}`}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4"
          style={{ textShadow: "0 0 40px rgba(168, 85, 247, 0.3), 0 0 80px rgba(168, 85, 247, 0.1)" }}
        >
          Karaokly
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-lg mx-auto mb-10 font-medium leading-relaxed">
          Your favorite karaoke songs are just a click away.
        </p>
        <Button
          onClick={handleEnter}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-lg px-10 py-6 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] cursor-pointer"
        >
          <Mic2 className="mr-2 h-5 w-5" />
          Enter Karaokly
        </Button>
      </div>
    </div>
  )
}
