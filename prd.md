# PR Pulse — Product Requirements Document

## Problem
Open-source contributors — especially students preparing for GSoC, OSCI, or Hacktoberfest — watch dozens of repositories. They need to:
- Find beginner-friendly issues across those repos.
- Track which PRs they've opened, and whether they've been merged.
- See their contribution progress at a glance.

GitHub's own UI scatters this across repo pages, notification feeds, and profile activity. There's no single view for "here are my target repos, here are the issues I could work on, and here's my PR status across all of them."

## Solution
PR Pulse is a personal dashboard that connects to the GitHub API via the user's token and shows:
1. **Watched Repos**: Add any GitHub repo by owner/name. See stars, language, and description.
2. **Good First Issues**: Aggregated list of issues labeled `good first issue` or `help wanted` from all watched repos. Filter by repo and sort by date.
3. **My PRs**: Every PR the user has opened in watched repos, with real-time status (open/merged/closed), review state, and direct links.
4. **Dashboard Stats**: Total watched repos, open issues available, PRs opened, PRs merged — with visual cards.

## User Stories

### US-1: Token Setup
As a user, I enter my GitHub personal access token on first visit so the app can fetch my data. The token is stored in localStorage and never sent to any server other than api.github.com.

### US-2: Add Watched Repo
As a user, I can type a repo in `owner/repo` format and add it to my watch list. The app validates it exists via the GitHub API before adding.

### US-3: Remove Watched Repo
As a user, I can remove any repo from my watch list.

### US-4: View Dashboard
As a user, I see a dashboard with stat cards (repos watched, issues available, PRs opened, PRs merged) and a list of my recent PRs.

### US-5: Browse Issues
As a user, I see all "good first issue" and "help wanted" labeled issues from my watched repos. I can filter by repo and sort by newest/oldest.

### US-6: View My PRs
As a user, I see all my PRs across watched repos with their current status, and can click through to GitHub.

## Non-functional Requirements
- **Performance**: GitHub API responses cached in memory during session; avoid redundant calls.
- **Privacy**: Token never leaves the browser except to api.github.com. No analytics or tracking.
- **Cost**: $0 to run. No database, no paid APIs, free Vercel hosting.
- **Responsive**: Works on desktop and tablet. Mobile is nice-to-have.

## Out of Scope
- OAuth login flow (would require a backend)
- Push notifications
- Multi-user or team features
- Code diff viewing
- Automated PR creation
