import { WatchedRepo } from "./types";

const TOKEN_KEY = "pr-pulse-token";
const REPOS_KEY = "pr-pulse-repos";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getWatchedRepos(): WatchedRepo[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REPOS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addWatchedRepo(repo: WatchedRepo): WatchedRepo[] {
  const repos = getWatchedRepos();
  if (repos.some((r) => r.fullName === repo.fullName)) return repos;
  const updated = [...repos, repo];
  localStorage.setItem(REPOS_KEY, JSON.stringify(updated));
  return updated;
}

export function removeWatchedRepo(fullName: string): WatchedRepo[] {
  const repos = getWatchedRepos().filter((r) => r.fullName !== fullName);
  localStorage.setItem(REPOS_KEY, JSON.stringify(repos));
  return repos;
}
