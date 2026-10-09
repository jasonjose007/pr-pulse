export interface WatchedRepo {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  addedAt: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string;
  labels: string[];
  createdAt: string;
  author: string;
  comments: number;
}

export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string;
  state: "open" | "closed" | "merged";
  createdAt: string;
  updatedAt: string;
  additions: number;
  deletions: number;
  draft: boolean;
}

export interface DashboardStats {
  totalRepos: number;
  totalIssues: number;
  totalPRs: number;
  mergedPRs: number;
}

export interface RateLimit {
  remaining: number;
  limit: number;
  reset: number;
}
