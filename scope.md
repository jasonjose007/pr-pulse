# PR Pulse — Scope

## One-line summary
A personal GitHub contribution tracker that helps open-source contributors find good first issues, monitor their PRs, and track progress toward programs like GSoC and OSCI.

## Who is this for?
Students and early-career developers who contribute to open source for programs like Google Summer of Code (GSoC), OSCI, Hacktoberfest, or personal growth. They watch multiple repos but lose track of issues and PR status across them.

## What does it do? (End-to-end flow)
1. User enters their GitHub personal access token (stored locally, never leaves the browser).
2. User adds GitHub repos they want to watch for contribution opportunities.
3. Dashboard shows: total PRs, merged count, open issues labeled "good first issue" across all watched repos.
4. Issues page lists all "good first issue" / "help wanted" issues from watched repos, filterable and sortable.
5. PRs page shows all of the user's pull requests across watched repos with live status (open, merged, closed).

## What it does NOT do
- No authentication server or database — everything runs client-side with localStorage.
- No notifications, emails, or webhooks.
- No code review or diff viewing.
- No team features — this is a single-user personal tool.

## Key decisions
- **Client-side only**: GitHub API calls happen directly from the browser using the user's token. No backend to maintain or pay for.
- **localStorage for persistence**: Watched repos and token stored locally. Simple, free, private.
- **Next.js + Tailwind**: Modern stack, deploys free on Vercel, good developer experience.
- **No database**: Keeps the project at $0 cost and reduces complexity.

## Success criteria
- User can add/remove repos to watch.
- User can see "good first issue" labeled issues across all watched repos.
- User can see all their PRs across watched repos with current status.
- Dashboard shows meaningful stats at a glance.
- Works on Vercel free tier with zero ongoing cost.
