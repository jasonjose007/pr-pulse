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

  const stateColors = {
    all: "",
    open: "text-[#0284C7]",
    merged: "text-[#8B5CF6]",
    closed: "text-[#E11D48]",
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[#172B4D] mb-1">
              My pull requests
            </h1>
            <p className="text-sm text-[#6B778C]">
              {filtered.length} PR{filtered.length !== 1 ? "s" : ""} across watched repos
            </p>
          </div>
          <select
            value={filterRepo}
            onChange={(e) => setFilterRepo(e.target.value)}
            className="bg-white border border-[#DFE1E6] rounded-md px-3 py-1.5 text-sm text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          >
            <option value="all">All repos</option>
            {uniqueRepos.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 mb-6">
          {(["all", "open", "merged", "closed"] as const).map((state) => (
            <button
              key={state}
              onClick={() => setFilterState(state)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filterState === state
                  ? `font-medium bg-white border border-[#DFE1E6] ${stateColors[state] || "text-[#172B4D]"}`
                  : "text-[#6B778C] hover:text-[#172B4D]"
              }`}
            >
              {state.charAt(0).toUpperCase() + state.slice(1)}
              <span className="font-mono ml-1.5 text-xs">
                {statCounts[state]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your PRs..." />
        ) : repos.length === 0 ? (
          <EmptyState
            icon=""
            title="No repos watched"
            description="Add repos first to see your pull requests."
            action={{ label: "Add repos", href: "/repos" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon=""
            title="No PRs found"
            description={
              filterState !== "all"
                ? `No ${filterState} PRs right now.`
                : "You haven't opened any PRs in your watched repos."
            }
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((pr) => (
              <PRCard key={pr.id} pr={pr} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
