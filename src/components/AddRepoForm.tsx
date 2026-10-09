"use client";

import { useState } from "react";
import { validateRepo } from "@/lib/github";
import { addWatchedRepo } from "@/lib/storage";
import { WatchedRepo } from "@/lib/types";

interface AddRepoFormProps {
  token: string;
  onAdd: (repos: WatchedRepo[]) => void;
}

export default function AddRepoForm({ token, onAdd }: AddRepoFormProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    const match = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
    if (!match) {
      setError("Use owner/repo format (e.g. facebook/react)");
      return;
    }

    setLoading(true);
    setError("");

    const repo = await validateRepo(token, match[1], match[2]);
    if (repo) {
      const updated = addWatchedRepo(repo);
      onAdd(updated);
      setInput("");
    } else {
      setError("Repository not found or token lacks access.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="owner/repo (e.g. vercel/next.js)"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          disabled={loading}
        />
        {error && (
          <p className="absolute -bottom-5 left-0 text-red-400 text-xs">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
      >
        {loading ? "Adding..." : "Add Repo"}
      </button>
    </form>
  );
}
