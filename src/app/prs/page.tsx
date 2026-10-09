"use client";

import { useEffect, useState, useMemo } from "react";
import { getToken, getWatchedRepos } from "@/lib/storage";
import { getAuthenticatedUser, fetchAllPRs } from "@/lib/github";
import { WatchedRepo, GitHubPR } from "@/lib/types";
import Navbar from "@/components/Navbar";
import TokenSetup from "@/components/TokenSetup";
import PRCard from "@/components/PRCard";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PRsPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<WatchedRepo[]>([]);
  const [prs, setPRs] = useState<GitHubPR[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [filterState, setFilterState] = useState<
    "all" | "open" | "merged" | "closed"
  >("all");
  const [filterRepo, setFilterRepo] = useState<string>("all");

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      getAuthenticatedUser(stored).then((user) => {
        if (user) setUsername(user);
        setInitialized(true);
      });
    } else {
      setLoading(false);
      setInitialized(true);
    }
    setRepos(getWatchedRepos());
  }, []);

  useEffect(() => {
    if (!token || !username) return;
    const watchedRepos = getWatchedRepos();
    if (watchedRepos.length === 0) {
      setLoading(false);
      return;
    }
    fetchAllPRs(token, username, watchedRepos).then((data) => {
      setPRs(data);
      setLoading(false);
    });
  }, [token, username]);

  const filtered = useMemo(() => {
    let result = prs;
    if (filterState !== "all") {
      result = result.filter((p) => p.state === filterState);
    }
    if (filterRepo !== "all") {
      result = result.filter((p) => p.repo === filterRepo);
    }
    return result;
  }, [prs, filterState, filterRepo]);

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

  const uniqueRepos = [...new Set(prs.map((p) => p.repo))];

  const statCounts = {
    all: prs.length,
    open: prs.filter((p) => p.state === "open").length,
    merged: prs.filter((p) => p.state === "merged").length,
    closed: prs.filter((p) => p.state === "closed").length,
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              My Pull Requests
            </h1>
            <p className="text-sm text-gray-400">
              Your PRs across all watched repos.
            </p>
          </div>
          <select
            value={filterRepo}
            onChange={(e) => setFilterRepo(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All repos</option>
            {uniqueRepos.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {(["all", "open", "merged", "closed"] as const).map((state) => (
            <button
              key={state}
              onClick={() => setFilterState(state)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterState === state
                  ? "bg-gray-800 text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {state.charAt(0).toUpperCase() + state.slice(1)}
              <span className="ml-1.5 text-xs text-gray-600">
                {statCounts[state]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your PRs..." />
        ) : repos.length === 0 ? (
          <EmptyState
            icon="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            title="No repos watched"
            description="Add repos first, then come back to see your pull requests."
            action={{ label: "Add Repos", href: "/repos" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            title="No PRs found"
            description={
              filterState !== "all"
                ? `No ${filterState} PRs right now.`
                : "You haven't opened any PRs in your watched repos."
            }
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filtered.length} PR{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              {filtered.map((pr) => (
                <PRCard key={pr.id} pr={pr} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
