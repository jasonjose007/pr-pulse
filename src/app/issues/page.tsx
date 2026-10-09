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
    <div className="min-h-screen bg-[#F4F5F7]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[#172B4D] mb-1">
              Good first issues
            </h1>
            <p className="text-sm text-[#6B778C]">
              {filtered.length} issue{filtered.length !== 1 ? "s" : ""} across your watched repos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-[#DFE1E6] rounded-md px-3 py-1.5 text-sm text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
            >
              <option value="all">All repos</option>
              {repoNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchData}
              disabled={loading}
              className="text-sm text-[#6B778C] hover:text-[#172B4D] transition-colors disabled:opacity-50 px-2"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching issues..." />
        ) : repos.length === 0 ? (
          <EmptyState
            icon=""
            title="No repos watched"
            description="Add repos first, then come back to find issues."
            action={{ label: "Add repos", href: "/repos" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon=""
            title="No issues found"
            description="None of your watched repos have beginner-friendly issues open right now."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
