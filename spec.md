# PR Pulse — Technical Specification

## Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSR-capable, easy Vercel deploy, good DX |
| Language | TypeScript | Type safety, better IDE support |
| Styling | Tailwind CSS | Utility-first, fast prototyping, small bundle |
| Charts | None (stat cards only) | Keep scope minimal for hackathon |
| Storage | localStorage | No database cost, single-user tool |
| API | GitHub REST API v3 | Well-documented, token-based auth |
| Hosting | Vercel (free tier) | Zero-config Next.js deploy |

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Navbar
│   ├── page.tsx            # Dashboard
│   ├── globals.css         # Tailwind + custom styles
│   ├── repos/page.tsx      # Repo management
│   ├── issues/page.tsx     # Good first issues
│   └── prs/page.tsx        # PR tracking
├── components/
│   ├── Navbar.tsx           # Top navigation
│   ├── TokenSetup.tsx       # Token input screen
│   ├── StatsGrid.tsx        # Dashboard stat cards
│   ├── RepoCard.tsx         # Watched repo display
│   ├── AddRepoForm.tsx      # Add repo input
│   ├── IssueCard.tsx        # Issue list item
│   ├── PRCard.tsx           # PR list item
│   ├── EmptyState.tsx       # Empty state placeholder
│   └── LoadingSpinner.tsx   # Loading indicator
├── lib/
│   ├── github.ts            # GitHub API client
│   ├── storage.ts           # localStorage read/write
│   └── types.ts             # Shared TypeScript types
└── hooks/
    └── useLocalStorage.ts   # React hook for localStorage
```

## Data Flow

1. **On load**: Read token + watched repos from localStorage.
2. **If no token**: Show TokenSetup component — user enters PAT, stored in localStorage.
3. **If token exists**: Fetch repo details, issues, and PRs from GitHub API.
4. **Display**: Render fetched data in the appropriate page components.
5. **On add repo**: Validate via GitHub API → add to localStorage → refetch data.
6. **On remove repo**: Remove from localStorage → update UI.

## GitHub API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /repos/{owner}/{repo}` | Validate repo exists, get metadata |
| `GET /repos/{owner}/{repo}/issues?labels=good+first+issue&state=open` | Fetch beginner issues |
| `GET /repos/{owner}/{repo}/issues?labels=help+wanted&state=open` | Fetch help-wanted issues |
| `GET /search/issues?q=author:{user}+repo:{owner}/{repo}+type:pr` | Fetch user's PRs in repo |
| `GET /user` | Get authenticated user's username |

## Types

```typescript
interface WatchedRepo {
  owner: string;
  name: string;
  fullName: string;       // "owner/name"
  description: string;
  stars: number;
  language: string;
  addedAt: string;        // ISO date
}

interface GitHubIssue {
  id: number;
  title: string;
  url: string;            // html_url
  repo: string;           // "owner/name"
  labels: string[];
  createdAt: string;
  author: string;
  comments: number;
}

interface GitHubPR {
  id: number;
  title: string;
  url: string;
  repo: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
  updatedAt: string;
  additions: number;
  deletions: number;
}
```

## localStorage Schema

| Key | Type | Description |
|-----|------|-------------|
| `pr-pulse-token` | string | GitHub PAT |
| `pr-pulse-repos` | WatchedRepo[] | JSON array of watched repos |

## Rate Limiting
- Unauthenticated: 60 requests/hour (unusable)
- With PAT: 5,000 requests/hour (sufficient)
- Display remaining rate limit in UI footer

## Security Considerations
- Token stored in localStorage — acceptable for a single-user personal tool
- Token only sent in `Authorization` header to `api.github.com`
- No server-side storage, no cookies, no third-party requests
- `.env.example` documents that no server env vars are needed
