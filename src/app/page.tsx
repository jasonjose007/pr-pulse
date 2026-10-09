"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, getWatchedRepos } from "@/lib/storage";
import {
  getAuthenticatedUser,
  fetchAllIssues,
  fetchAllPRs,
} from "@/lib/github";
import {
  WatchedRepo,
  GitHubIssue,
  GitHubPR,
  DashboardStats,
} from "@/lib/types";
import Navbar from "@/components/Navbar";
import TokenSetup from "@/components/TokenSetup";
import StatsGrid from "@/components/StatsGrid";
import PRCard from "@/components/PRCard";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<WatchedRepo[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [prs, setPRs] = useState<GitHubPR[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      getAuthenticatedUser(stored).then((user) => {
        if (user) {
          setUsername(user);
        } else {
          setLoading(false);
        }
        setInitialized(true);
      });
    } else {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!token || !username) return;
    setLoading(true);
    const watchedRepos = getWatchedRepos();
    setRepos(watchedRepos);

    if (watchedRepos.length > 0) {
      const [issueData, prData] = await Promise.all([
        fetchAllIssues(token, watchedRepos),
        fetchAllPRs(token, username, watchedRepos),
      ]);
      setIssues(issueData);
      setPRs(prData);
    } else {
      setIssues([]);
      setPRs([]);
    }
    setLoading(false);
  }, [token, username]);

  useEffect(() => {
    if (token && username) fetchData();
  }, [token, username, fetchData]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner text="Initializing..." />
      </div>
    );
  }

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

  const stats: DashboardStats = {
    totalRepos: repos.length,
    totalIssues: issues.length,
    totalPRs: prs.length,
    mergedPRs: prs.filter((p) => p.state === "merged").length,
  };

  const recentPRs = prs.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome back,{" "}
              <span className="text-emerald-400">{username}</span>
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
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

        <StatsGrid stats={stats} loading={loading} />

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Pull Requests
          </h2>
          {loading ? (
            <LoadingSpinner text="Fetching your PRs..." />
          ) : recentPRs.length === 0 ? (
            <EmptyState
              icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              title="No PRs yet"
              description={
                repos.length === 0
                  ? "Start by adding repos to watch, then your PRs will appear here."
                  : "You haven't opened any PRs in your watched repos yet."
              }
              action={
                repos.length === 0
                  ? { label: "Add Repos", href: "/repos" }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {recentPRs.map((pr) => (
                <PRCard key={pr.id} pr={pr} />
              ))}
              {prs.length > 5 && (
                <a
                  href="/prs"
                  className="block text-center text-sm text-emerald-400 hover:text-emerald-300 py-3 transition-colors"
                >
                  View all {prs.length} PRs →
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
