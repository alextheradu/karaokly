# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Karaokly is a karaoke playlist web app. Users sign up with email verification, search for karaoke videos via YouTube, build playlists, assign songs to party members, and share playlists via token-based links.

## Commands

- **Start server:** `node server.js` (runs on port from `.env`, default 4006)
- **Install dependencies:** `npm install`
- No test suite, linter, or build step is configured.

## Architecture

This is a single-file Express.js server (`server.js`) serving static HTML pages from `public/`.

### Backend (server.js)

- **Auth:** Email/password with bcrypt hashing, express-session for session management, email verification via nodemailer (Gmail SMTP)
- **Data storage:** All user data (accounts, playlists, party members) stored in a flat `logins.json` file, read/written synchronously via `loadLogins()`/`saveLogins()`
- **YouTube search:** Proxied through `/api/search` endpoint, auto-appends "karaoke" to queries
- **Share system:** Token-based playlist sharing — share endpoints mirror the authenticated playlist/party-member endpoints but use `?token=` query param instead of session auth
- **Admin:** `isAdmin` middleware checks user record flag; admin endpoints at `/admin/*` for account management and support emails

### Frontend (public/)

All frontend pages are standalone HTML files with inline CSS and JavaScript (no build tooling, no framework):

- `public/index.html` — Landing page
- `public/app/index.html` — Main app (search, playlist, player, party members, share QR code)
- `public/login/index.html` — Login page
- `public/sign-up/index.html` — Signup page
- `public/share.html` — Shared playlist view (accessed via share token)
- `public/player-window.html` — Pop-out video player window
- `public/admin.html` — Admin dashboard
- `public/style.css` — Shared styles (pages also have extensive inline styles)

### Environment Variables (.env)

- `PORT` — Server port
- `YOUTUBE_API_KEY` — Google YouTube Data API v3 key
- `GMAIL_PASSWORD` — Gmail app password for sending emails via nodemailer
