# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Karaokly is a karaoke playlist web app built with Next.js 16 (App Router). Users sign in with Google OAuth, search for karaoke videos via YouTube, build playlists, assign songs to party members, and share playlists via token-based links with QR codes.

## Commands

- **Dev server:** `npm run dev` (requires `nvm use 22` first — Node 22+ required)
- **Build:** `npm run build`
- **Install dependencies:** `npm install`
- **Database:** `docker compose up -d` (PostgreSQL on port 5433)
- **Prisma migrate:** `npx prisma migrate dev`
- **Prisma generate:** `npx prisma generate` (outputs to `src/generated/prisma/`)
- **Lint:** `npm run lint`

## Tech Stack

- **Framework:** Next.js 16 with App Router, TypeScript
- **UI:** Tailwind CSS v4, shadcn/ui components (`src/components/ui/`)
- **Auth:** NextAuth.js v5 (Auth.js) with Google OAuth, Prisma adapter
- **Database:** PostgreSQL via Docker Compose, Prisma 7 ORM with `@prisma/adapter-pg`
- **Font:** Plus Jakarta Sans (via `next/font/google`)

## Architecture

### API Routes (`src/app/api/`)

All API routes use Next.js Route Handlers. Authenticated routes call `auth()` from `src/lib/auth.ts`. Mutations use a single POST endpoint per resource with an `action` field discriminator (e.g., `{ action: "add", video: {...} }`).

- `api/search` — YouTube search proxy, auto-appends "karaoke" to queries
- `api/playlist` — CRUD playlist items (actions: add, remove, assign, clear)
- `api/party-members` — CRUD party members (actions: add, remove)
- `api/share/token` — Generate share token for current user
- `api/share/playlist` — Token-based shared playlist ops (no auth)
- `api/share/party-members` — Token-based shared party member ops (no auth)
- `api/admin/accounts` — List accounts (admin only)
- `api/admin/users` — Manage users: delete, promote, demote (admin only)

### Pages (`src/app/`)

- `/` — Landing page with animated gradient background and curtain reveal animation
- `/login` — Google OAuth sign-in (no email/password)
- `/app` — Main authenticated app: 3-tab layout (Song Finder, Playlist, Jam)
- `/share?token=` — Public shared playlist view with 5-second polling
- `/player-window` — Pop-out YouTube player (opened via `window.open()`)
- `/admin` — Admin dashboard with accounts table (admin-gated)
- `/tos`, `/privacy-policy` — Static legal pages

### Key Patterns

- **Server Components** for pages: check auth via `auth()`, prefetch data with Prisma, pass to Client Components as props
- **Client Components** for interactivity: tabs, search, playlist management
- **Custom hooks** in `src/hooks/`: `usePlaylist`, `usePartyMembers`, `useSharePlaylist`
- **Glass card styling** via `.glass-card` class (frosted glass with backdrop-blur)
- **Animated gradient** via `.bg-karaokly-gradient` class (peach/pink/sky/mint cycling)

### Database (Prisma)

Schema in `prisma/schema.prisma`. Config in `prisma.config.ts` (reads `DATABASE_URL` from `.env`). Key models: `User`, `PlaylistItem` (with `position` for ordering), `PartyMember`, plus NextAuth adapter models (`Account`, `Session`, `VerificationToken`).

### Environment Variables (`.env`)

- `DATABASE_URL` — PostgreSQL connection string (port 5433 for local Docker)
- `AUTH_SECRET` — NextAuth session encryption secret
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth credentials
- `YOUTUBE_API_KEY` — YouTube Data API v3 key