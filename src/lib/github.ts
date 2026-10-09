import { GitHubIssue, GitHubPR, RateLimit, WatchedRepo } from "./types";

const API_BASE = "https://api.github.com";

let cachedRateLimit: RateLimit | null = null;

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function updateRateLimit(res: Response) {
  const remaining = res.headers.get("x-ratelimit-remaining");
  const limit = res.headers.get("x-ratelimit-limit");
  const reset = res.headers.get("x-ratelimit-reset");
  if (remaining && limit && reset) {
    cachedRateLimit = {
      remaining: parseInt(remaining),
      limit: parseInt(limit),
      reset: parseInt(reset),
    };
  }
}

export function getRateLimit(): RateLimit | null {
  return cachedRateLimit;
}

export async function getAuthenticatedUser(
  token: string
): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/user`, { headers: headers(token) });
    updateRateLimit(res);
    if (!res.ok) return null;
    const data = await res.json();
    return data.login;
  } catch {
    return null;
  }
}

export async function validateRepo(
  token: string,
  owner: string,
  name: string
): Promise<WatchedRepo | null> {
  try {
    const res = await fetch(`${API_BASE}/repos/${owner}/${name}`, {
      headers: headers(token),
    });
    updateRateLimit(res);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      owner: data.owner.login,
      name: data.name,
      fullName: data.full_name,
      description: data.description || "",
      stars: data.stargazers_count,
      language: data.language || "Unknown",
      addedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function fetchIssues(
  token: string,
  owner: string,
  repo: string,
  label: string
): Promise<GitHubIssue[]> {
  try {
    const res = await fetch(
      `${API_BASE}/repos/${owner}/${repo}/issues?labels=${encodeURIComponent(label)}&state=open&per_page=30&sort=created&direction=desc`,
      { headers: headers(token) }
    );
    updateRateLimit(res);
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .filter((item: Record<string, unknown>) => !item.pull_request)
      .map(
        (item: Record<string, unknown>): GitHubIssue => ({
          id: item.id as number,
          number: item.number as number,
          title: item.title as string,
          url: item.html_url as string,
          repo: `${owner}/${repo}`,
          labels: (
            item.labels as Array<{ name: string }>
          ).map((l) => l.name),
          createdAt: item.created_at as string,
          author: (item.user as { login: string }).login,
          comments: item.comments as number,
        })
      );
  } catch {
    return [];
  }
}

export async function fetchGoodFirstIssues(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubIssue[]> {
  const [goodFirst, helpWanted] = await Promise.all([
    fetchIssues(token, owner, repo, "good first issue"),
    fetchIssues(token, owner, repo, "help wanted"),
  ]);
  const seen = new Set<number>();
  const combined: GitHubIssue[] = [];
  for (const issue of [...goodFirst, ...helpWanted]) {
    if (!seen.has(issue.id)) {
      seen.add(issue.id);
      combined.push(issue);
    }
  }
  return combined.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function fetchUserPRs(
  token: string,
  username: string,
  owner: string,
  repo: string
): Promise<GitHubPR[]> {
  try {
    const res = await fetch(
      `${API_BASE}/search/issues?q=author:${username}+repo:${owner}/${repo}+type:pr&sort=created&order=desc&per_page=30`,
      { headers: headers(token) }
    );
    updateRateLimit(res);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map(
      (item: Record<string, unknown>): GitHubPR => ({
        id: item.id as number,
        number: item.number as number,
        title: item.title as string,
        url: item.html_url as string,
        repo: `${owner}/${repo}`,
        state: (item.pull_request as { merged_at: string | null })?.merged_at
          ? "merged"
          : (item.state as string) === "closed"
            ? "closed"
            : "open",
        createdAt: item.created_at as string,
        updatedAt: item.updated_at as string,
        additions: 0,
        deletions: 0,
        draft: (item.draft as boolean) || false,
      })
    );
  } catch {
    return [];
  }
}

export async function fetchUserRepos(
  token: string
): Promise<WatchedRepo[]> {
  try {
    const res = await fetch(
      `${API_BASE}/user/repos?type=all&sort=updated&per_page=100`,
      { headers: headers(token) }
    );
    updateRateLimit(res);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(
      (repo: Record<string, unknown>): WatchedRepo => ({
        owner: (repo.owner as { login: string }).login,
        name: repo.name as string,
        fullName: repo.full_name as string,
        description: (repo.description as string) || "",
        stars: repo.stargazers_count as number,
        language: (repo.language as string) || "Unknown",
        addedAt: new Date().toISOString(),
      })
    );
  } catch {
    return [];
  }
}

export async function fetchContributedRepos(
  token: string,
  username: string
): Promise<WatchedRepo[]> {
  try {
    const res = await fetch(
      `${API_BASE}/search/issues?q=author:${username}+type:pr+is:merged&sort=updated&order=desc&per_page=50`,
      { headers: headers(token) }
    );
    updateRateLimit(res);
    if (!res.ok) return [];
    const data = await res.json();
    const repoMap = new Map<string, { owner: string; name: string }>();
    for (const item of data.items || []) {
      const url = item.repository_url as string;
      const parts = url.split("/");
      const owner = parts[parts.length - 2];
      const name = parts[parts.length - 1];
      const fullName = `${owner}/${name}`;
      if (!repoMap.has(fullName)) {
        repoMap.set(fullName, { owner, name });
      }
    }
    const repos = await Promise.all(
      Array.from(repoMap.values()).map(({ owner, name }) =>
        validateRepo(token, owner, name)
      )
    );
    return repos.filter((r): r is WatchedRepo => r !== null);
  } catch {
    return [];
  }
}

export async function fetchAllIssues(
  token: string,
  repos: WatchedRepo[]
): Promise<GitHubIssue[]> {
  const results = await Promise.all(
    repos.map((r) => fetchGoodFirstIssues(token, r.owner, r.name))
  );
  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function fetchAllPRs(
  token: string,
  username: string,
  repos: WatchedRepo[]
): Promise<GitHubPR[]> {
  const results = await Promise.all(
    repos.map((r) => fetchUserPRs(token, username, r.owner, r.name))
  );
  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
