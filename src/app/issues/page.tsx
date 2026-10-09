"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, getWatchedRepos } from "@/lib/storage";
import { getAuthenticatedUser, fetchAllIssues } from "@/lib/github";
import { WatchedRepo, GitHubIssue } from "@/lib/types";
import Navbar from "@/components/Navbar";
import TokenSetup from "@/components/TokenSetup";
import IssueCard from "@/components/IssueCard";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function IssuesPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<WatchedRepo[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      getAuthenticatedUser(stored).then((user) => {
        if (user) setUsername(user);
        else setLoading(false);
        setInitialized(true);
      });
    } else {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const watchedRepos = getWatchedRepos();
    setRepos(watchedRepos);
    if (watchedRepos.length > 0) {
      const data = await fetchAllIssues(token, watchedRepos);
      setIssues(data);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token && username) fetchData();
  }, [token, username, fetchData]);

  if (!initialized) return null;

  if (!token || !username) {
    return (
      <TokenSetup
        onComplete={(user) => {
          setTokenState(getToken());
          setUsername(user);
        }}
      />
    );
  }

  const repoNames = [...new Set(issues.map((i) => i.repo))];
  const filtered =
    filter === "all" ? issues : issues.filter((i) => i.repo === filter);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Good First Issues
            </h1>
            <p className="text-sm text-gray-400">
              Beginner-friendly issues across your watched repos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All repos ({issues.length})</option>
              {repoNames.map((name) => (
                <option key={name} value={name}>
                  {name} ({issues.filter((i) => i.repo === name).length})
                </option>
              ))}
            </select>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching issues..." />
        ) : repos.length === 0 ? (
          <EmptyState
            icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            title="No repos watched"
            description="Add repos first, then come back to find issues."
            action={{ label: "Add Repos", href: "/repos" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            title="No issues found"
            description="None of your watched repos have open 'good first issue' or 'help wanted' issues right now."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
