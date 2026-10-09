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
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
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
    <div className="min-h-screen bg-[#F4F5F7]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-xl font-semibold text-[#172B4D]">
              Welcome back, <span className="font-mono">{username}</span>
            </h1>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="text-sm text-[#6B778C] hover:text-[#172B4D] transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <StatsGrid stats={stats} loading={loading} />

        <div className="mt-12">
          <h2 className="text-base font-semibold text-[#172B4D] mb-4">
            Recent pull requests
          </h2>
          {loading ? (
            <LoadingSpinner text="Fetching your PRs..." />
          ) : recentPRs.length === 0 ? (
            <EmptyState
              icon=""
              title="No PRs yet"
              description={
                repos.length === 0
                  ? "Add repos to watch, then your PRs will appear here."
                  : "You haven't opened any PRs in your watched repos yet."
              }
              action={
                repos.length === 0
                  ? { label: "Add repos", href: "/repos" }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-2">
              {recentPRs.map((pr) => (
                <PRCard key={pr.id} pr={pr} />
              ))}
              {prs.length > 5 && (
                <a
                  href="/prs"
                  className="block text-sm text-[#6366F1] hover:text-[#4F46E5] py-2 transition-colors"
                >
                  View all {prs.length} pull requests
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
