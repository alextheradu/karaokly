// src/components/layout/PublicFooter.tsx
import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="py-8 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          © 2025 Karaokly. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-500">
          <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-zinc-700">·</span>
          <Link href="/tos" className="hover:text-zinc-300 transition-colors">
            Terms of Service
          </Link>
          <span className="text-zinc-700">·</span>
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            YouTube Terms
          </a>
          <span className="text-zinc-700">·</span>
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            Google Privacy
          </a>
        </nav>
      </div>
    </footer>
  )
}
