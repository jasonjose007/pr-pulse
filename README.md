# PR Pulse

A personal GitHub contribution tracker for open-source contributors. Track your PRs, find good first issues, and monitor progress across repos — built for GSoC, OSCI, and Hacktoberfest prep.

## What it does

1. **Connect** — Enter your GitHub Personal Access Token (stored locally, never leaves the browser).
2. **Watch** — Add repos you want to contribute to.
3. **Discover** — Browse "good first issue" and "help wanted" issues across all watched repos.
4. **Track** — See all your PRs with live status (open, merged, closed).
5. **Dashboard** — Stats at a glance: repos watched, issues available, PRs opened, PRs merged.

## Tech Stack

- **Next.js 16** + TypeScript + Tailwind CSS
- **GitHub REST API** — client-side, no backend needed
- **localStorage** — all data stays in your browser
- **Vercel** — free deployment

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Enter your GitHub PAT with `repo` scope on first visit.

## Create a GitHub Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new)
2. Select the **repo** scope
3. Generate and paste into PR Pulse

## Deploy to Vercel

```bash
npx vercel
```

Or connect the GitHub repo at [vercel.com/new](https://vercel.com/new).

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── repos/page.tsx    # Repo management
│   ├── issues/page.tsx   # Good first issues
│   └── prs/page.tsx      # PR tracking
├── components/           # UI components
├── lib/
│   ├── github.ts         # GitHub API client
│   ├── storage.ts        # localStorage helpers
│   └── types.ts          # TypeScript types
└── hooks/                # React hooks
```

## Privacy

Your GitHub token is stored in `localStorage` and only sent to `api.github.com`. No server, no database, no analytics.
