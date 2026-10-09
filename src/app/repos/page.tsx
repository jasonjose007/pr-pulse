"use client";

import { useEffect, useState } from "react";
import { getToken, getWatchedRepos, removeWatchedRepo } from "@/lib/storage";
import { getAuthenticatedUser } from "@/lib/github";
import { WatchedRepo } from "@/lib/types";
import Navbar from "@/components/Navbar";
import TokenSetup from "@/components/TokenSetup";
import RepoCard from "@/components/RepoCard";
import AddRepoForm from "@/components/AddRepoForm";
import EmptyState from "@/components/EmptyState";

export default function ReposPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<WatchedRepo[]>([]);
  const [initialized, setInitialized] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Watched Repos</h1>
          <p className="text-sm text-gray-400">
            Add GitHub repos to track issues and PRs.
          </p>
        </div>

        <div className="mb-8">
          <AddRepoForm token={token} onAdd={setRepos} />
        </div>

        {repos.length === 0 ? (
          <EmptyState
            icon="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            title="No repos yet"
            description="Add a GitHub repository above to start tracking issues and PRs."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.fullName} repo={repo} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
