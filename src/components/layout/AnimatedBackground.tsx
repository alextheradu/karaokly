"use client"

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-noise">
      {children}
    </div>
  )
}
