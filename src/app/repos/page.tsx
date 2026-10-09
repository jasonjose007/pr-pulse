"use client";

import { useEffect, useState } from "react";
import { getToken, getWatchedRepos, removeWatchedRepo, addWatchedRepo } from "@/lib/storage";
import { getAuthenticatedUser, fetchUserRepos, fetchContributedRepos } from "@/lib/github";
import { WatchedRepo } from "@/lib/types";
import Navbar from "@/components/Navbar";
import TokenSetup from "@/components/TokenSetup";
import RepoCard from "@/components/RepoCard";
import AddRepoForm from "@/components/AddRepoForm";

export default function ReposPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<WatchedRepo[]>([]);
  const [initialized, setInitialized] = useState(false);

  const [suggestions, setSuggestions] = useState<WatchedRepo[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [imported, setImported] = useState(false);

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      getAuthenticatedUser(stored).then((user) => {
        if (user) setUsername(user);
        setInitialized(true);
      });
    } else {
      setInitialized(true);
    }
    setRepos(getWatchedRepos());
  }, []);

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

  function handleRemove(fullName: string) {
    const updated = removeWatchedRepo(fullName);
    setRepos(updated);
  }

  function handleQuickAdd(repo: WatchedRepo) {
    const updated = addWatchedRepo(repo);
    setRepos(updated);
    setSuggestions((prev) => prev.filter((r) => r.fullName !== repo.fullName));
  }

  function handleAddAll() {
    let current = getWatchedRepos();
    for (const repo of suggestions) {
      current = addWatchedRepo(repo);
    }
    setRepos(current);
    setSuggestions([]);
  }

  async function loadSuggestions() {
    if (!token || !username) return;
    setLoadingSuggestions(true);
    setImported(true);

    const [owned, contributed] = await Promise.all([
      fetchUserRepos(token),
      fetchContributedRepos(token, username),
    ]);

    const watchedSet = new Set(getWatchedRepos().map((r) => r.fullName));
    const seen = new Set<string>();
    const combined: WatchedRepo[] = [];

    for (const repo of [...contributed, ...owned]) {
      if (!watchedSet.has(repo.fullName) && !seen.has(repo.fullName)) {
        seen.add(repo.fullName);
        combined.push(repo);
      }
    }

    setSuggestions(combined);
    setLoadingSuggestions(false);
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[#172B4D] mb-1">
              Watched repos
            </h1>
            <p className="text-sm text-[#6B778C]">
              Track issues and contributions across these repos.
            </p>
          </div>
          <div className="w-80 shrink-0">
            <AddRepoForm token={token} onAdd={setRepos} />
          </div>
        </div>

        {repos.length === 0 && !imported && (
          <div className="bg-white border border-[#DFE1E6] rounded-lg p-8 text-center mb-6">
            <p className="text-[#172B4D] font-medium mb-1">
              Import your repos from GitHub
            </p>
            <p className="text-sm text-[#6B778C] mb-4 max-w-md mx-auto">
              Automatically find repos you own and repos you{"'"}ve contributed to.
            </p>
            <button
              onClick={loadSuggestions}
              disabled={loadingSuggestions}
              className="bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-[#DFE1E6] disabled:text-[#6B778C] text-white font-medium px-5 py-2.5 rounded-md transition-colors text-sm"
            >
              {loadingSuggestions ? "Scanning GitHub..." : "Import from GitHub"}
            </button>
          </div>
        )}

        {repos.length > 0 && !imported && (
          <div className="mb-6">
            <button
              onClick={loadSuggestions}
              disabled={loadingSuggestions}
              className="text-sm text-[#6366F1] hover:text-[#4F46E5] transition-colors"
            >
              {loadingSuggestions ? "Scanning..." : "Import more from GitHub"}
            </button>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[#172B4D]">
                Found {suggestions.length} repos — click to add
              </p>
              <button
                onClick={handleAddAll}
                className="text-sm text-[#6366F1] hover:text-[#4F46E5] font-medium transition-colors"
              >
                Add all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((repo) => (
                <button
                  key={repo.fullName}
                  onClick={() => handleQuickAdd(repo)}
                  className="bg-white border border-[#DFE1E6] rounded-md px-3 py-1.5 text-sm hover:border-[#6366F1]/40 hover:bg-indigo-50 transition-colors group"
                >
                  <span className="font-mono text-xs">
                    <span className="text-[#6B778C] group-hover:text-[#6366F1]">{repo.owner}/</span>
                    <span className="text-[#172B4D] font-medium group-hover:text-[#6366F1]">{repo.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {imported && suggestions.length === 0 && !loadingSuggestions && (
          <div className="mb-6">
            <p className="text-sm text-[#6B778C]">
              All your GitHub repos are already being watched.
            </p>
          </div>
        )}

        {repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {repos.map((repo) => (
              <RepoCard
                key={repo.fullName}
                repo={repo}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
