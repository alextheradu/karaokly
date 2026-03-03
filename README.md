# Karaokly

A karaoke playlist web app where users search for karaoke videos, build playlists, assign songs to party members, and share playlists via QR codes — all in real time.

## Tech Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **UI:** Tailwind CSS v4, shadcn/ui
- **Auth:** NextAuth.js v5 with Google OAuth
- **Database:** PostgreSQL (Docker), Prisma 7 ORM
- **Fonts:** Plus Jakarta Sans

## Getting Started

### Prerequisites

- Node.js 22+ (`nvm use 22`)
- Docker & Docker Compose
- Google OAuth credentials
- YouTube Data API v3 key

### Setup

1. **Clone and install:**
   ```bash
   git clone <repo-url> && cd karaokly
   npm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker compose up -d
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Fill in your credentials:
   ```
   DATABASE_URL="postgresql://karaokly:karaokly_dev@localhost:5433/karaokly"
   AUTH_SECRET="<openssl rand -base64 32>"
   AUTH_TRUST_HOST=true
   AUTH_URL="https://yourdomain.com"
   AUTH_GOOGLE_ID="<your-google-client-id>"
   AUTH_GOOGLE_SECRET="<your-google-client-secret>"
   YOUTUBE_API_KEY="<your-youtube-api-key>"
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start dev server:**
   ```bash
   npm run dev
   ```

### Production

```bash
npm run build
pm2 start ecosystem.config.cjs
```

## Features

- **YouTube Search** — Search for karaoke songs (auto-appends "karaoke" to queries)
- **Playlist Management** — Add, remove, reorder, and clear songs
- **Party Members** — Assign songs to people in your group
- **Jam Sessions** — Generate a share link + QR code so friends can add songs without logging in
- **Pop-out Player** — Open the YouTube player in a separate window
- **Admin Dashboard** — Manage user accounts (promote, demote, delete)

## Project Structure

```
src/
├── app/
│   ├── api/          # Route handlers (search, playlist, party-members, share, admin)
│   ├── app/          # Main authenticated app (3-tab layout)
│   ├── admin/        # Admin dashboard
│   ├── login/        # Google OAuth sign-in
│   ├── share/        # Public shared playlist view
│   ├── player-window/ # Pop-out YouTube player
│   ├── tos/          # Terms of Service
│   └── privacy-policy/
├── components/
│   ├── app/          # App components (tabs, search, playlist, player)
│   ├── layout/       # Header, animated background
│   ├── landing/      # Landing page curtain reveal
│   ├── share/        # Shared playlist components
│   ├── admin/        # Admin table
│   └── ui/           # shadcn/ui primitives
├── hooks/            # usePlaylist, usePartyMembers, useSharePlaylist
├── lib/              # Auth config, Prisma client, utilities
└── types/            # TypeScript interfaces
```
