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
    <div className="min-h-screen bg-[#F4F5F7]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[#172B4D] mb-1">
              Watched repos
            </h1>
            <p className="text-sm text-[#6B778C]">
              Add repos to track their issues and your contributions.
            </p>
          </div>
          <div className="w-80 shrink-0">
            <AddRepoForm token={token} onAdd={setRepos} />
          </div>
        </div>

        {repos.length === 0 ? (
          <EmptyState
            icon=""
            title="No repos yet"
            description="Add a repository above to start tracking."
          />
        ) : (
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
