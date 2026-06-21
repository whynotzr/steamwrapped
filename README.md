# SteamWrapped

Your Steam gaming life in animated slides — Spotify Wrapped style.

## Live site setup

This is a **Next.js** app ready to deploy as a public website.

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `STEAM_API_KEY` | [Steam Web API key](https://steamcommunity.com/dev/apikey) |
| `SESSION_SECRET` | Random string, 32+ characters |
| `NEXT_PUBLIC_APP_URL` | Public URL (e.g. `https://yourdomain.com`) |

### 2. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Deploy (recommended: Vercel)

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the same environment variables in **Project → Settings → Environment Variables**
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Deploy

After deploy, share links look like: `https://yourdomain.com/u/76561198...`

### Demo

- Story mode (mock data): `/u/demo`
- Real profile: paste a SteamID64 or profile URL on the home page

## Features

- Animated Wrapped slides (playtime, top games, achievements, personality, share card)
- Steam OpenID sign-in (`/api/auth/steam`)
- PNG export for Discord / social
- Open Graph previews when sharing `/u/...` links
- Mobile-friendly tap navigation

## Requirements

- Target Steam profile must be **public** (profile + game details)
- Large libraries may take several minutes on first load (cached 24h locally)

## Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · Steam Web API

## Notes for production

- **Vercel Pro** (or self-hosting) recommended for large profiles — generation can exceed 60s
- File cache (`.cache/wrapped`) is ephemeral on serverless — profiles regenerate on cold starts
- Discord/Twitter previews need `NEXT_PUBLIC_APP_URL` set correctly
